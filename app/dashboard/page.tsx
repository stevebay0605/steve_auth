"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";


type User = {
  id: number;
  nom: string;
  prenom: string;
  adresse: string;
  tel: string;
  email: string;
  created_at: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [avatar, setAvatar] = useState<string |null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.push("/");
        return;
      }

      setAvatar(data.user.user_metadata?.avatar_url || null)


      const { data: profile, error: profilError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profilError) {
        console.log(profilError);
        router.push("/");
        return;
      }
      setUser(profile);

    const isConnect= sessionStorage.getItem("fresh_login");
    if (isConnect) {
      sessionStorage.removeItem("fresh_login"); 
    } else {
      toast.success(`Bon retour, ${profile.prenom}`);
    }
      
    };

    getUser();
  }, [router]);

  function handleDeconnexion() {
    supabase.auth.signOut()
    router.push("/");
    toast.warning("Vous etes deconnecte")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] font-sans">
        <p className="text-[#aaa] text-sm ">Chargement...</p>
      </div>
    );
  }

   const infos = [
    { label: "Email", valeur: user.email },
    { label: "Téléphone", valeur: user.tel || "—" },
    { label: "Adresse", valeur: user.adresse || "—" },
    {
      label: "Membre depuis",
      valeur: new Date(user.created_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
  ];

  return (
   <div className="min-h-screen bg-[#F7F6F3] font-sans px-5 py-10">
      <div className="max-w-120 mx-auto">
 
        
        <div className="flex justify-between items-center mb-8">
          <p className="text-[11px] font-medium tracking-widest uppercase text-[#999]">
            Auth
          </p>
          <button
            onClick={handleDeconnexion}
            className="h-8 px-4 text-[12px] text-[#999] border border-[#E8E8E8] rounded-lg bg-white hover:border-red-300 hover:text-red-500 transition-colors cursor-pointer"
          >
            Se déconnecter
          </button>
        </div>
 
      
        <div className="bg-white rounded-2xl border border-[#E8E8E8] px-7 py-8">
 
          <div className="flex items-center gap-4 pb-6 mb-6 border-b border-[#F0F0F0]">
            <div className="w-13 h-13 rounded-full bg-[#111] flex items-center justify-center shrink-0 overflow-hidden">
              {avatar ? (
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-[15px] font-medium">
                  {user.nom.charAt(0)}{user.prenom.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <p className="text-[17px] font-medium text-[#111]">
                {user.nom} {user.prenom}
              </p>
              <span className="inline-block mt-1 text-[11px] text-[#999] bg-[#F7F6F3] border border-[#EFEFEF] rounded-full px-2.5 py-0.5">
                Membre
              </span>
            </div>
          </div>
 
          
          <div className="space-y-0">
            {infos.map(({ label, valeur }, i) => (
              <div
                key={label}
                className={`flex justify-between items-center py-3.5 ${
                  i < infos.length - 1 ? "border-b border-[#F0F0F0]" : ""
                }`}
              >
                <span className="text-[12px] text-[#aaa] uppercase tracking-[0.05em] font-medium">
                  {label}
                </span>
                <span className="text-[13px] text-[#111] font-medium max-w-[60%] text-right truncate">
                  {valeur}
                </span>
              </div>
            ))}
          </div>
        </div>
 
        
        <p className="text-center text-[11px] text-[#ccc] mt-6">
          Connecté en tant que{" "}
          <span className="text-[#aaa] font-medium">{user.email}</span>
        </p>
      </div>
    </div>
  );
}
 