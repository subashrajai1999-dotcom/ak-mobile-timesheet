import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, saveAuth } from "../services/api";
import { Lock, Mail, Eye, EyeOff, Loader2, RotateCw, ShieldCheck } from "lucide-react";

// Generate a random 5-character alphanumeric captcha
function generateCaptcha(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // exclude 0, O, 1, I for clarity
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptchaInput("");
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (!captchaInput.trim()) {
      setError("Please enter the Captcha code shown.");
      return;
    }

    // Case-insensitive captcha comparison
    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setError("Incorrect Captcha. Please enter the new code shown.");
      refreshCaptcha();
      return;
    }

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
      refreshCaptcha(); // refresh captcha on failed login
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* AK Logo / Header Block */}
        <div className="bg-[#0f3f6e] rounded-2xl px-6 pt-8 pb-7 text-white text-center shadow-2xl mb-4 border border-blue-800/40">
          {/* AK Logo */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center mb-3 shadow-inner">
            <span className="text-2xl font-black tracking-tight text-white">AK</span>
          </div>

          <h1 className="text-base font-bold tracking-wide">AK Field Portal</h1>
          <p className="text-blue-200 text-[11px] mt-0.5 font-medium">
            Time & Attendance · Site Management
          </p>

          <form onSubmit={handleLogin} className="mt-5 text-left space-y-3.5">
            {/* Field 1: Work Email */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-blue-200 tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  placeholder="e.g. user@akpt.ae"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-blue-300/70 focus:outline-none focus:border-white/60 focus:bg-white/15 transition"
                />
              </div>
            </div>

            {/* Field 2: Password */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-blue-200 tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300">
                  <Lock size={16} />
                </div>
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-blue-300/70 focus:outline-none focus:border-white/60 focus:bg-white/15 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white cursor-pointer"
                  title={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Field 3: Visual Captcha */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-blue-200 tracking-wider mb-1">
                Security Captcha
              </label>

              <div className="flex items-center gap-2 mb-2">
                {/* Styled Captcha Display Box with strike lines and random slant */}
                <div
                  className="flex-1 bg-gradient-to-r from-slate-800 via-blue-950 to-slate-900 border border-blue-400/40 rounded-xl py-2 px-3 flex items-center justify-around select-none relative overflow-hidden shadow-inner"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 1px, transparent 1px)`,
                    backgroundSize: "6px 6px",
                  }}
                  title="Captcha Code"
                >
                  {/* Decorative diagonal strike lines */}
                  <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(45deg,transparent_45%,#fff_49%,#fff_51%,transparent_55%)]" />

                  {captchaCode.split("").map((ch, idx) => {
                    const rotations = ["-rotate-6", "rotate-3", "-rotate-2", "rotate-6", "-rotate-4"];
                    const colors = ["text-amber-300", "text-emerald-300", "text-cyan-300", "text-pink-300", "text-yellow-200"];
                    return (
                      <span
                        key={idx}
                        className={`text-base font-black font-mono tracking-wider ${rotations[idx % rotations.length]} ${colors[idx % colors.length]} drop-shadow-md`}
                      >
                        {ch}
                      </span>
                    );
                  })}
                </div>

                {/* Refresh Captcha Button */}
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-blue-200 hover:text-white border border-white/20 transition cursor-pointer flex-shrink-0"
                  title="Generate new Captcha"
                  aria-label="Refresh Captcha"
                >
                  <RotateCw size={16} />
                </button>
              </div>

              {/* Captcha Input */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300">
                  <ShieldCheck size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Enter Captcha Code"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  maxLength={5}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white uppercase font-mono tracking-widest placeholder-blue-300/70 focus:outline-none focus:border-white/60 focus:bg-white/15 transition"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-400/40 text-red-200 text-xs font-semibold rounded-lg px-3 py-2 text-left">
                ⚠ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-xs tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Verifying…
                </>
              ) : (
                "SIGN IN"
              )}
            </button>
          </form>
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
