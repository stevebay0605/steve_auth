'use client'

import {useState} from "react"
import {useRouter} from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"


export default function LoginPage(){
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  async function handelConnexion() {
    if (!email || !motDePasse){
      setErreur("Remplir tous les champs ")
      return
    }
    setChargement(true)
    setErreur("")

    const {data , error }= await supabase.auth.signInWithPassword({
      email,
      password: motDePasse
    })

    

    if(error){
      setErreur("Email ou mot de passe incorrect")
      setChargement(false)
      return
    }
    const {data:profile , error:profileError} = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

    if (profileError){
    console.log(profileError)
    }

    localStorage.setItem("user" ,JSON.stringify(profile))
    setChargement(false)
    router.push("/dashboard")

    
  }

  return(
    <div className="min-h-screen flex items-center justify-center content-center bg-[#f5f5f5] font-sans p-5">

      <div className="w-full max-w-[400]">

        <div className="text-center mb-9 ">
          <h1 className="text-2xl font-medium text-[#111] mb-2">
            Connexion
          </h1>
          <p className="text-sm text-[#888] m-0">
            Bienvenue ! Entrez vos identifiants
          </p>
        </div>

        <div className="bg-white border-[#e5e5e5] rounded-2xl px-7 py-8">
          <div className="mb-4.5">
            <Input className="w-full px-3 py-2.5 border-[#ddd] rounded-s-lg text-sm outline-none mb-5 box-border " type="email" placeholder="email@gmail.com" value={email} onChange={(e)=>setEmail(e.target.value)}>
            </Input>

            <Input className="w-full px-3 py-2.5 border-[#ddd] rounded-s-lg text-sm outline-none mb-5 box-border " type="password" placeholder="*****" value={motDePasse} onChange={(e)=>{setMotDePasse(e.target.value)}}>
            </Input>
          </div>
          {erreur && (
            <p className="text-sm text-red-500 mb-4 -mt-2 ">
              {erreur}
            </p>
          )}
          <Button className={cn(
    "w-full p-2.75 text-white border-none rounded-lg mb-2.5 text-[14px] font-medium font-sans transition-colors",
    chargement ? "bg-[#555] cursor-not-allowed" : "bg-[#111] cursor-pointer hover:bg-black"
  )} onClick={handelConnexion} disabled={chargement}>
             {chargement? 'connexion...': 'Se connecter'}
          </Button>

            <div className="text-center text-sm text-[#888] m-0">
              <p>Pas encore de compte {""}

                <a className="text-[#111] font-medium" href="/register">
                    S&apos;inscrire
                </a>
              </p>
            </div>
            
        </div>
       
         <p className="text-center text-sm text-[#aaa] mt-5">
            Compte test : stevebay@gmail.com / stevebay0605
          </p>
      </div>
    </div>
  )
}