"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {supabase} from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"




export default function Register(){
const router = useRouter()

const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [adresse, setAdresse] = useState("")
  const [tel, setTel] = useState("")
  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [confirmMdp, setConfirmMdp] = useState("")
  const [erreur, setErreur] = useState("")
  const [chargement, setChargement] = useState(false)

  async function handleRegister(){
    if (!nom || !prenom || !motDePasse || !confirmMdp){
        setErreur("Remplir tous les champs ")
        return
    }
    if (motDePasse !== confirmMdp){
        setErreur("Les mots de passe ne correspondent pas ")
        return
    }
    setChargement(true)
    setErreur("")

    const {data , error}= await supabase.auth.signUp({
    email,
    password:motDePasse,
  })

   if (error){
    setErreur(error.message)
    setChargement(false)
    toast.warning(String(error))
    return
   }

   if(data.user){
    await supabase.from("profiles").insert({
        id: data.user.id,
        nom,
        prenom,
        adresse,
        tel,
        email,
    })
   }

   setChargement(false)
   router.push("/login")
   toast.success("Inscription reussie")
  }

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.warning(String(error));
    }
  }
 const inputClass =
    "w-full h-[40px] px-3 text-[13px] bg-[#F7F6F3] border border-[#E8E8E8] rounded-lg outline-none focus:border-[#111] transition-colors text-[#111] placeholder:text-[#bbb]";
 
  const labelClass =
    "block text-[11px] font-medium uppercase tracking-[0.06em] text-[#999] mb-1.5";
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3] p-5 font-sans">
      <div className="w-full max-w-110">
 
       
        <p className="text-center text-[11px] font-medium tracking-widest uppercase text-[#999] mb-8">
          Auth
        </p>
 
        <div className="bg-white rounded-2xl border border-[#E8E8E8] px-8 py-9">
 
          <div className="mb-7">
            <h1 className="text-[20px] font-medium text-[#111] mb-1">Inscription</h1>
            <p className="text-[13px] text-[#999]">Créer votre compte</p>
          </div>
 
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelClass}>Nom</label>
              <Input
                placeholder="Bayonne"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Prénom</label>
              <Input
                placeholder="Steve"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
 
          
          <div className="mb-4">
            <label className={labelClass}>Adresse</label>
            <Input
              placeholder="Brazzaville, Congo"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="mb-4">
            <label className={labelClass}>Téléphone</label>
            <Input
              placeholder="+242 06 000 0000"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              className={inputClass}
            />
          </div>
 
        
          <div className="mb-4">
            <label className={labelClass}>Email</label>
            <Input
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
 
          
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label className={labelClass}>Mot de passe</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Confirmer</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmMdp}
                onChange={(e) => setConfirmMdp(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
 
          {erreur && (
            <p className="text-[12px] text-red-500 mt-2 mb-1">{erreur}</p>
          )}
 
         
          <Button
            onClick={handleRegister}
            disabled={chargement}
            className={cn(
              "w-full h-10.5 rounded-lg text-[13px] font-medium mt-5 transition-colors flex items-center justify-center gap-2",
              chargement
                ? "bg-[#555] cursor-not-allowed text-white"
                : "bg-[#111] hover:bg-[#222] text-white cursor-pointer"
            )}
          >
            {chargement ? (
              <>
                <Spinner className="text-sm" />
                Création...
              </>
            ) : (
              "S'inscrire"
            )}
          </Button>
 
         
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#EFEFEF]" />
            <span className="text-[11px] text-[#bbb] uppercase tracking-wider">ou</span>
            <div className="flex-1 h-px bg-[#EFEFEF]" />
          </div>
 
        
          <Button
            onClick={handleGoogleLogin}
            className="w-full h-10.5 bg-white border border-[#E8E8E8] rounded-lg text-[13px] font-medium text-[#333] hover:bg-[#F7F6F3] transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-4 h-4"
            />
            Continuer avec Google
          </Button>
 
          <p className="text-center text-[12px] text-[#aaa] mt-6">
            Déjà un compte ?{" "}
            <a href="/login" className="text-[#111] font-medium hover:underline">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}