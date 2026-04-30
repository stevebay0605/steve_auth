"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const [checking , setChecking] = useState(true)

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
        <Spinner  className="text-[#111] text-2xl" />  
      </div>
    )
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
  async function handelConnexion() {
    if (!email || !motDePasse) {
      setErreur("Remplir tous les champs ");
      return;
    }
    setChargement(true);
    setErreur("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    });

    if (error) {
      setErreur("Email ou mot de passe incorrect");
      setChargement(false);
      return;
    }
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.log(profileError);
    }

    toast.success("authentification reussie ");

    localStorage.setItem("user", JSON.stringify(profile));
    setChargement(false);
    router.push("/dashboard");
    toast.success("vous etes connecter")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F6F3] p-5 font-sans">
      <div className="w-full max-w-100">
          
        <p className="text-center text-[11px] font-medium tracking-widest uppercase text-[#999] mb-8">
          Auth
        </p>
 
        <div className="bg-white rounded-2xl border border-[#E8E8E8] px-8 py-9">
 
          <div className="mb-7">
            <h1 className="text-[20px] font-medium text-[#111] mb-1">Connexion</h1>
            <p className="text-[13px] text-[#999]">Bienvenue, entrez vos identifiants</p>
          </div>
 
          
          <div className="mb-4">
            <label className="block text-[11px] font-medium uppercase tracking-[0.06em] text-[#999] mb-1.5">
              Email
            </label>
            <Input
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 text-[13px] bg-[#F7F6F3] border border-[#E8E8E8] rounded-lg outline-none focus:border-[#111] transition-colors text-[#111] placeholder:text-[#bbb]"
            />
          </div>
 
        
          <div className="mb-2">
            <label className="block text-[11px] font-medium uppercase tracking-[0.06em] text-[#999] mb-1.5">
              Mot de passe
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handelConnexion()}
              className="w-full h-10 px-3 text-[13px] bg-[#F7F6F3] border border-[#E8E8E8] rounded-lg outline-none focus:border-[#111] transition-colors text-[#111] placeholder:text-[#bbb]"
            />
          </div>
 
          {erreur && (
            <p className="text-[12px] text-red-500 mt-2 mb-1">{erreur}</p>
          )}
 
          
          <Button
            onClick={handelConnexion}
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
                Connexion...
              </>
            ) : (
              "Se connecter"
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
            Pas de compte ?{" "}
            <a href="/register" className="text-[#111] font-medium hover:underline">
              S&apos;inscrire
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}