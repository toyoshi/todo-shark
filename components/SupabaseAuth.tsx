// components/SupabaseAuth.tsx
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const SupabaseAuth = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({'email': email});

    if (error) {
      setMessage("エラー: " + error.message);
    } else {
      setMessage("メールを確認してください");
    }
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "送信中..." : "ログイン"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SupabaseAuth;
