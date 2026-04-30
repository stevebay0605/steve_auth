"use client"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { supabase } from "@/lib/supabase"
 import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function Home (){
    const router = useRouter()
    const [checking , setChecking] =useState(true)
    useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push("/dashboard")
      } else {
        setChecking(false) 
      }
    }
    checkSession()
  }, [router])

  
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <Spinner className="text-[#111] text-2xl" />
      </div>
    )
  }

    return(
       <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] font-sans p-5">

            <div className="text-center max-w-md">
                <h1 className="text-3xl font-semibold text-[#111] mb-4">
                    Bienvenue
                </h1>

                <p className="text-[#666] mb-8 text-sm">
                    Une application simple pour gerer vos utilisateur 
                </p>

                <div className="flex gap-4 justify-center">

                    <Button className="bg-[#111] text-white px-5 py-2 rounded-lg" onClick={()=>router.push('/login')}>
                        Se connecter
                    </Button>

                    <Button className="px-5 py-2 rounded-lg" variant="outline" onClick={()=> router.push('/register')}>
                        S&apos;inscrire
                    </Button>

                </div>
            </div>
       </div>
    )
}