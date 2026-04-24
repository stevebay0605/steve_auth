"use client"
import { Button } from "@/components/ui/button"
 import { useRouter } from "next/navigation"

export default function Home (){
    const router = useRouter()

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