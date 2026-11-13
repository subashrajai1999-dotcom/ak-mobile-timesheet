import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { App as CapApp } from "@capacitor/app";
import { LogOut, AlertTriangle, X, Shield, ArrowRight } from "lucide-react";
import { getAuth, clearAuth, isLoggedIn } from "../../services/api";

export default function SessionExitModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showExitModal, setShowExitModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const user = getAuth();

  // Listen to Android hardware back button and App lifecycle
  useEffect(() => {
    let backButtonListener: any = null;
    let appStateListener: any = null;

    // 1. Android Back Button handling (Capacitor)
    const setupCapacitorListeners = async () => {
      try {
        backButtonListener = await CapApp.addListener("backButton", ({ canGoBack }) => {
          // If on home page, prompt before closing app
          if (location.pathname === "/" && isLoggedIn()) {
            setShowExitModal(true);
          } else if (canGoBack) {
            window.history.back();
          } else if (isLoggedIn()) {
            setShowExitModal(true);
          } else {
            CapApp.exitApp();
          }
        });

        // 2. Detect when user leaves app and comes back
        appStateListener = await CapApp.addListener("appStateChange", ({ isActive }) => {
          if (!isActive && isLoggedIn()) {
            // User minimized or switched to another app
            sessionStorage.setItem("ak_switched_away", "true");
          } else if (isActive && isLoggedIn()) {
            // User came back from another app
            const wasSwitched = sessionStorage.getItem("ak_switched_away");
            if (wasSwitched === "true") {
              sessionStorage.removeItem("ak_switched_away");
              setShowResumeModal(true);
            }
          }
        });
      } catch (err) {
        // Fallback for Web browser environment
        console.log("Capacitor App listeners running in web mode:", err);
      }
    };

    setupCapacitorListeners();

    // 3. Web Browser Visibility Change (tab switch or minimize in browser)
    const handleVisibilityChange = () => {
      if (document.hidden && isLoggedIn()) {
        sessionStorage.setItem("ak_switched_away_web", "true");
      } else if (!document.hidden && isLoggedIn()) {
        const wasAway = sessionStorage.getItem("ak_switched_away_web");
        if (wasAway === "true") {
          sessionStorage.removeItem("ak_switched_away_web");
          setShowResumeModal(true);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (backButtonListener?.remove) backButtonListener.remove();
      if (appStateListener?.remove) appStateListener.remove();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [location.pathname]);

  const handleLogoutAndExit = () => {
    clearAuth();
    setShowExitModal(false);
    setShowResumeModal(false);
    try {
      CapApp.exitApp();
    } catch {
      navigate("/login", { replace: true });
    }
  };

  const handleJustExit = () => {
    setShowExitModal(false);
    try {
      CapApp.exitApp();
    } catch {
      window.close();
    }
  };

  const handleResumeStay = () => {
    setShowResumeModal(false);
  };

  const handleResumeLogout = () => {
    clearAuth();
    setShowResumeModal(false);
    navigate("/login", { replace: true });
  };

  if (!isLoggedIn()) return null;

  return (
    <>
      {/* Modal 1: Exit App Prompt (When trying to close app or pressing back on Home) */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-2xl border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <LogOut size={26} strokeWidth={2.3} />
            </div>

            <h3 className="text-base font-bold text-gray-900">Closing the App?</h3>
            <p className="text-xs text-gray-600 mt-1 mb-5 leading-relaxed">
              Veliya porathukku munnaadi, <strong>Logout panna virumbureengala?</strong>
            </p>

            <div className="space-y-2">
              {/* Option 1: Logout & Exit (Recommended for shared site phones) */}
              <button
                type="button"
                onClick={handleLogoutAndExit}
                className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <LogOut size={15} />
                <span>Sign Out & Close App</span>
              </button>

              {/* Option 2: Just Close without logout */}
              <button
                type="button"
                onClick={handleJustExit}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
              >
                Close App (Stay Signed In)
              </button>

              {/* Option 3: Cancel and stay in app */}
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="w-full py-2 px-3 text-slate-500 hover:text-slate-700 text-xs font-medium cursor-pointer"
              >
                Cancel / Stay in App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: App Switched / Backgrounded Resume Check */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-2xl border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3">
              <Shield size={26} strokeWidth={2.3} />
            </div>

            <div className="inline-block bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1">
              Security Check
            </div>

            <h3 className="text-base font-bold text-gray-900">Welcome Back</h3>
            <p className="text-xs text-gray-600 mt-1 mb-5 leading-relaxed">
              Neenga vera app use pannitu thirumba vanthirukeenga. Logged in as <strong>{user?.name || "User"}</strong>.
            </p>

            <div className="space-y-2">
              {/* Continue working */}
              <button
                type="button"
                onClick={handleResumeStay}
                className="w-full py-2.5 px-3 rounded-xl bg-[#0f3f6e] hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Continue Session</span>
                <ArrowRight size={15} />
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={handleResumeLogout}
                className="w-full py-2 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut size={14} />
                <span>Sign Out Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
