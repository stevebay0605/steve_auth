'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

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
          .upsert({ id: user.id, nom, prenom, email: user.email })
          .select()
          .single()

        localStorage.setItem("user", JSON.stringify(newProfile))

        const profilComplet = newProfile?.adresse && newProfile?.tel
        router.push(profilComplet ? "/dashboard" : "/complete-profile")
        return 
      }

      localStorage.setItem("user", JSON.stringify(profile))

      const profilComplet = profile?.adresse && profile?.tel
      router.push(profilComplet ? "/dashboard" : "/complete-profile")

      toast.success("vous etes connecter")
    }



    handleAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Connexion en cours...</p>
    </div>
  )
}