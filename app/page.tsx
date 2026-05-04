"use client"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { supabase } from "@/lib/supabase"
 import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


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
      
      <div className="min-h-screen bg-white font-sans flex flex-col">
  
        
        <nav className="flex justify-between items-center px-10 py-5 border-b border-[#EFEFEF]">
          <span className="text-[13px] font-medium tracking-[0.08em] uppercase text-[#111]">
            Auth App
          </span>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/login")}
              className="h-8.5 px-4 text-[13px] text-[#666] border border-[#E8E8E8] rounded-lg bg-transparent hover:bg-[#F7F6F3] transition-colors cursor-pointer"
            >
              Se connecter
            </Button>
            <Button
              onClick={() => router.push("/register")}
              className="h-8.5 px-4 text-[13px] font-medium text-white bg-[#111] rounded-lg hover:bg-[#222] transition-colors cursor-pointer border-none"
            >
              Commencer
            </Button>
          </div>
        </nav>
  
      
        <div className="flex flex-col items-center justify-center text-center px-6 py-20 bg-white">
  
          <h1 className="text-[38px] font-medium text-[#111] leading-[1.2] tracking-[-0.02em] max-w-130 mb-4">
            Gérez vos utilisateurs{" "}
            <span className="text-[#aaa]">sans probleme</span>
          </h1>
  
          <p className="text-[15px] text-[#888] max-w-95 leading-relaxed mb-9">
            Auth App est une solution simple et sécurisée pour l&apos;authentification
            et la gestion de comptes utilisateurs.
          </p>
  
          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/register")}
              className="h-10.5 px-6 text-[13px] font-medium text-white bg-[#111] rounded-lg hover:bg-[#222] transition-colors cursor-pointer border-none"
            >
              Créer un compte
            </Button>
            <Button
              onClick={() => router.push("/login")}
              className="h-10.5 px-6 text-[13px] text-[#111] border border-[#E8E8E8] rounded-lg bg-transparent hover:bg-[#F7F6F3] transition-colors cursor-pointer"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    )
}