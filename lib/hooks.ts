import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabaseClient";

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const user = session.user;
        const { data, error } = await supabase.from("users").select("*").eq("id", user.id);
        if (data.length === 0) {
            // 新しいユーザーレコードを作成する
            const { error } = await supabase.from("users").insert([{ id: user.id, email: user.email }]);
            if (error) {
                console.log("Error creating user:", error.message);
            } else {
                console.log("User created successfully");
            }
        }

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

  return { user, loading };
}

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(() => {});

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}