"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

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
    <div className="min-h-screen flex justify-center items-center bg-[#F7F6F3] p-5 font-sans">
      <div className="w-full max-w-100">
          
        <p className="text-center text-[11px] font-medium tracking-widest uppercase text-[#999] mb-8">
          Auth
        </p>
 
        <div className="bg-white rounded-2xl border border-[#E8E8E8] px-8 py-9">
 
          <div className="mb-7">
            <h1 className="text-[20px] font-medium text-[#111] mb-1"> completer le profil</h1>
            <p className="text-[13px] text-[#999]">Quelques infos supplémentaires pour finaliser votre compte</p>
          </div>
        

          <div className="mb-4">
            <label className="block text-[11px] font-medium uppercase tracking-[0.06em] text-[#999] mb-1.5">
              Addresse
            </label>
            <Input
              placeholder="Adresse"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              className="w-full h-10 px-3 text-[13px] bg-[#F7F6F3] border border-[#E8E8E8] rounded-lg outline-none focus:border-[#111] transition-colors text-[#111] placeholder:text-[#bbb]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[11px] font-medium uppercase tracking-[0.06em] text-[#999] mb-1.5">
              Telephone
            </label>
            <Input
              placeholder="Téléphone"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              className="w-full h-10 px-3 text-[13px] bg-[#F7F6F3] border border-[#E8E8E8] rounded-lg outline-none focus:border-[#111] transition-colors text-[#111] placeholder:text-[#bbb]"
            />
          </div>

          <Button
            className={cn(
                          "w-full h-10.5 rounded-lg text-[13px] font-medium mt-5 transition-colors flex items-center justify-center gap-2",
                          chargement
                            ? "bg-[#555] cursor-not-allowed text-white"
                            : "bg-[#111] hover:bg-[#222] text-white cursor-pointer"
                        )}
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