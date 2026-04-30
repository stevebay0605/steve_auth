"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";


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
      
    };

    getUser();
  }, [router]);

  function handleDeconnexion() {
    supabase.auth.signOut()
    router.push("/");
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] font-sans">
        <p className="text-[#aaa] text-sm ">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans px-5 py-10">
      <div className="max-w-[600] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-medium text-[#111] m-0">Mon profil</h1>
          <Button
            variant="outline"
            className="px-4 py-2   text-sm text-[#666] cursor-pointer font-sans hover:bg-red-500 hover:text-black"
            onClick={handleDeconnexion}
          >
            Se deconnecter
          </Button>
        </div>

        <div className="bg-white rounded-xl px-7 py-8 mb-4">
          <div className="flex items-center gap-5 mb-8 pb-6 border-b-[#f0f0f0]">
            <div className="w-[64] h-[64] rounded-[50%] bg-[#111] text-white flex items-center justify-center text-2xl font-medium shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-full"
                />
                
              ) : (
                <span className="text-white text-xl font-medium">
                  {user.nom.charAt(0)}
                  {user.prenom.charAt(0)}
                </span>
              )}
            </div>
            <div className="">
              <p className="text-2xl font-medium text-[#111] mb-1">
                {user.nom} {user.prenom}
              </p>
              <span className="inline-block py-0.75 px-2.5 bg-[#f0f0f0] rounded-3xl text-sm text-[#555]"></span>
            </div>
          </div>
          {[
            ["Email", user.email],
            ["tel", user.tel],
            ["addrese", user.adresse],
            ["membre depuis", new Date(user.created_at).toLocaleDateString()],
          ].map(([label, valeur]) => (
            <div
              className="flex justify-between items-center py-3.5 border-b-[#f0f0f0]"
              key={label}
            >
              <span className="text-sm text-[#999]">{label}</span>

              <span className="text-sm text-[#111] font-medium">{valeur}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-[#bbb] text-center">
          Connecté en tant que{" "}
          <strong className="text-[#999]">{user.email}</strong>
        </p>
      </div>
    </div>
  );
}
