'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Callback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push("/login")
        return
      }

     
      let { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()

 
      if (!profile) {
        const fullName = data.user.user_metadata.full_name || ""
        const [nom, prenom] = fullName.split(" ")

        const { data: newProfile } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            nom: nom || "User",
            prenom: prenom || "",
            email: data.user.email,
          })
          .select()
          .single()

        profile = newProfile
      }

      localStorage.setItem("user", JSON.stringify(profile))

      router.push("/dashboard")
    }

    handleAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Connexion en cours...</p>
    </div>
  )
}