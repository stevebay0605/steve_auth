'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Callback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user

      if (!user) {
        router.push("/login")
        return
      }
      
      window.history.replaceState({}, document.title, "/dashboard");


      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (!profile) {
        const fullName = user.user_metadata.full_name || ""
        const parts = fullName.trim().split(" ")

        const nom = parts[0] || "User"
        const prenom = parts.slice(1).join(" ") || ""

        const { data: newProfile } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            nom,
            prenom,
            email: user.email,
          })
          .select()
          .single()

        localStorage.setItem("user", JSON.stringify(newProfile))
      } else {
        localStorage.setItem("user", JSON.stringify(profile))
      }

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