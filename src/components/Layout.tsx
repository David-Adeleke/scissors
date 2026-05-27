import { UserButton, useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { Scissors } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Scissors className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">Scissor</span>
          </button>

          <nav className="flex items-center gap-6">
            {isSignedIn ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  Dashboard
                </button>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <button
                onClick={() => navigate("/")}
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
