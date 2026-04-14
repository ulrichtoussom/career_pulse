import { createClient } from '@/backend/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function POST(req) {

    const supabase = await createClient()
    try {

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

        const { id, structured_data } = await req.json()

        if (!id || !structured_data) {
            return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
        }

        const { error } = await supabase
            .from('career_profiles')
            .update({ structured_data })
            .eq('id', id)
            .eq('user_id', session.user.id)

        if (error) throw error

        return NextResponse.json({ message: 'success' }, { status: 200 })

    } catch (err) {
        console.error('update Error:', err.message)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
