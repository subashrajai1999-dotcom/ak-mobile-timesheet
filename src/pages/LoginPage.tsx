import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, saveAuth } from "../services/api";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const user = await loginApi(email.trim(), password.trim());
      saveAuth(user);
      navigate("/", { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Login failed. Check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* AK Logo / Header Block */}
        <div className="bg-[#0f3f6e] rounded-2xl px-6 pt-10 pb-8 text-white text-center shadow-2xl mb-6">
          {/* AK Logo */}
          <div className="w-20 h-20 mx-auto rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center mb-4 shadow-inner">
            <span className="text-3xl font-black tracking-tight text-white">AK</span>
          </div>

          <h1 className="text-lg font-bold tracking-wide">AK Field Portal</h1>
          <p className="text-blue-200 text-xs mt-1 font-medium">
            Time & Attendance · Site Management
          </p>

          <div className="mt-6 text-left space-y-4">
            {/* Email */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300">
                <Mail size={16} />
              </div>
              <input
                type="email"
                placeholder="Work Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-blue-300 focus:outline-none focus:border-white/60 focus:bg-white/15 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300">
                <Lock size={16} />
              </div>
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-10 py-3 text-sm text-white placeholder-blue-300 focus:outline-none focus:border-white/60 focus:bg-white/15 transition"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-3 bg-red-500/20 border border-red-400/40 text-red-200 text-xs font-semibold rounded-lg px-3 py-2 text-left">
              ⚠ {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="mt-5 w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-bold py-3 rounded-xl text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing In…
              </>
            ) : (
              "SIGN IN"
            )}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-[11px]">
          Use your AK web application credentials
        </p>
        <p className="text-center text-slate-600 text-[11px] mt-1">
          © 2026 AK Project Technologies LLC
        </p>
      </div>
    </div>
  );
}
