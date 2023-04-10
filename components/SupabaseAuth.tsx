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
      setMessage("メール送信しました");
    }
    setLoading(false);
  };

  return (
      <form
        className="bg-white p-6 rounded shadow-md flex flex-col items-center"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold mb-4">ログイン</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            メールアドレス
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading}
        >
          {loading ? "送信中..." : "ログイン"}
        </button>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </form>
  );  
};

export default SupabaseAuth;
