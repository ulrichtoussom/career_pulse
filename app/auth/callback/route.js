// app/auth/callback/route.js
// Route handler qui gère TOUS les retours OAuth et PKCE de Supabase :
//   - Google / GitHub OAuth  → redirige vers /
//   - Reset password         → redirige vers /auth/reset-password

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // Le paramètre "next" permet de rediriger vers /auth/reset-password après le reset
    const next = searchParams.get('next') ?? '/';

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
