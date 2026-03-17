

import { createClient } from '@/backend/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function POST(req) {

    // utilisation de notre client supabase centralise backend/lib/supabase   
    const supabase = createClient()
    try {

        const { data : { session }} = await supabase.auth.getSession()
        if(!session) NextResponse({ error : ' non Autorisé'}, { status : 401})
        
        const {id, structured_data} = await req.json()
        
        // Mise a jour de la table avec les securite RLS 
        const { error } = await supabase.from('career_profiles')
            .update({ structured_data })
            .eq('id', id)
            .eq('user_id', session.user.id)

        if(error) throw error 

        return NextResponse({message : 'success'}, { status : 200})

    }catch(err){
        console.log('update Error : ', err.message)
        return NextResponse({error : err.message}, {status : 500 })
    }

}
