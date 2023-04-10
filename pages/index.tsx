// pages/index.tsx
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { supabase } from "../lib/supabaseClient";
import SupabaseAuth from "../components/SupabaseAuth";

const Home: NextPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Todo Shark</h1>
      {user ? (
        <div>
          <h2>ログイン成功！</h2>
          <p>ユーザーID: {user.id}</p>
          <p>メールアドレス: {user.email}</p>
        </div>
      ) : (
        <SupabaseAuth />
      )}
    </div>
  );
};

export default Home;
