// app/auth/callback/route.js
// Route handler qui gère TOUS les retours OAuth et PKCE de Supabase :
//   - Google / GitHub OAuth  → redirige vers /
//   - Reset password         → redirige vers /auth/reset-password

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    // Le paramètre "next" permet de rediriger vers /auth/reset-password après le reset
    const next = searchParams.get('next') ?? '/';

    // Sur Render (et tout reverse proxy), request.url contient l'URL interne
    // du proxy (ex: http://127.0.0.1:10000) et non l'URL publique.
    // On reconstruit l'origin public depuis :
    // 1. NEXT_PUBLIC_SITE_URL (variable d'env baked au build — le plus fiable)
    // 2. Les headers x-forwarded-* injectés par le proxy (fallback)
    // 3. request.url en dernier recours (dev local)
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
    const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const origin =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (forwardedHost ? `${forwardedProto}://${forwardedHost}` : null) ||
        new URL(request.url).origin;

    if (code) {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    },
                },
            }
        );

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }

        console.error('[auth/callback] exchangeCodeForSession error:', error.message);
    }

    // Code absent ou échange échoué
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
