"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {supabase} from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"



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

    try {
        
    
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
throw error  }

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

   toast.success("Inscription effectue avec success")

   setChargement(false)
   router.push("/login")
    }
 catch (error) {
            setErreur(error.message)
    setChargement(false)
    toast.error(error.message || String(error))
    }
  }

    return(
        <div className="min-h-screen flex justify-center items-center bg-[#f5f5f5] p-5 font-sans">
            <div className="w-full max-w-100">
                <div className="text-center mb-9">
                    <h1 className="text-2xl font-medium text-[#111] mb-2">
                        Inscription
                    </h1>
                    <p className="text-sm text-[#888] mb-0">
                        creer votre compte
                    </p>
                </div>

                <div className=" bg-white border-[#e5e5e5] rounded-2xl px-7 py-8">
                    <Input placeholder="Nom" value={nom} onChange={(e)=>setNom(e.target.value)} className="w-full px-3 py-2.5 border-[#ddd] rounded-s-lg text-sm outline-none mb-5 box-border" />
                    <Input placeholder="Prenom" value={prenom} onChange={(e)=>setPrenom(e.target.value)} className="w-full px-3 py-2.5 border-[#ddd] rounded-s-lg text-sm outline-none mb-5 box-border" />
                    <Input placeholder="Adresse" value={adresse} onChange={(e)=>setAdresse(e.target.value)} className="w-full px-3 py-2.5 border-[#ddd] rounded-s-lg text-sm outline-none mb-5 box-border" />
                    <Input placeholder="Telephone" value={tel} onChange={(e)=>setTel(e.target.value)} className="w-full px-3 py-2.5 border-[#ddd] rounded-s-lg text-sm outline-none mb-5 box-border" />

                    <Input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-3 py-2.5 border-[#ddd] rounded-s-lg text-sm outline-none mb-5 box-border" />
                    <Input type="password" placeholder="Mot de passe" value={motDePasse} onChange={(e)=>setMotDePasse(e.target.value)} className="w-full px-3 py-2.5 border-[#ddd] rounded-s-lg text-sm outline-none mb-5 box-border" />
                    <Input type="password" placeholder="Confirmer mot de passe" value={confirmMdp} onChange={(e)=>setConfirmMdp(e.target.value)} className="w-full px-3 py-2.5 border-[#ddd] rounded-s-lg text-sm outline-none mb-5 box-border" />

                    {erreur && (
                        <p className="text-red-500 text-sm  mb-3">
                            {erreur}
                        </p>
                     )} 
                    <Button className={cn("w-full text-white", chargement? "bg-gray-400" : "bg-black hover:bg-gray-900")} onClick={handleRegister} disabled={chargement}>
                        {chargement? "Creation..." : "S'inscrire"}
                    </Button>

                    <p className="text-center text-sm text-[#888] mt-4">
                        Deja un compte ?  
                        <a href="/login" className="text-black font-medium"> 
                            Se connecter
                        </a> 
                    </p>
                </div>
            </div>
        </div>
    )
}