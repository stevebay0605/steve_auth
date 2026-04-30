"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function CompleteProfile() {
  const router = useRouter()
  const [adresse, setAdresse] = useState("")
  const [tel, setTel] = useState("")
  const [chargement, setChargement] = useState(false)

  async function handleSubmit() {
    if (!adresse || !tel) {
      toast.warning("Remplir tous les champs")
      return
    }

    setChargement(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    const { error } = await supabase
      .from("profiles")
      .update({ adresse, tel })
      .eq("id", user.id)

    if (error) {
      toast.error("Erreur lors de la mise à jour")
      setChargement(false)
      return
    }

    toast.success("Profil complété !")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f5f5f5] p-5 font-sans">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium text-[#111] mb-2">
            Compléter le profil
          </h1>
          <p className="text-sm text-[#888]">
            Quelques infos supplémentaires pour finaliser votre compte
          </p>
        </div>

        <div className="bg-white rounded-2xl px-7 py-8">
          <Input
            placeholder="Adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            className="mb-4"
          />
          <Input
            placeholder="Téléphone"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            className="mb-6"
          />
          <Button
            className="w-full bg-black text-white hover:bg-gray-900"
            onClick={handleSubmit}
            disabled={chargement}
          >
            {chargement ? "Enregistrement..." : "Terminer"}
          </Button>
        </div>
      </div>
    </div>
  )
}