import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { Scissors, Zap, BarChart3, QrCode } from "lucide-react";

export default function Landing() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scissors className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-slate-900">Scissor</span>
        </div>
        {isSignedIn ? (
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Dashboard
          </button>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            Sign In
          </button>
        )}
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Shorten URLs. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Track Everything.
          </span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Fast, minimal URL shortener with QR codes, custom slugs, and real-time analytics.
          Perfect for marketing campaigns and link management.
        </p>

        {isSignedIn ? (
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
          >
            Go to Dashboard
          </button>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
          >
            Get Started
          </button>
        )}
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
          Why Choose Scissor?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Lightning Fast</h3>
            <p className="text-slate-600">
              Generate short links in under one second. Redirects are instant with 302 redirects
              for accurate analytics.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-indigo-100 rounded-lg w-fit mb-4">
              <QrCode className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">QR Codes</h3>
            <p className="text-slate-600">
              Generate beautiful, customizable QR codes. Download as SVG or PNG with a single
              click.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Real-Time Analytics</h3>
            <p className="text-slate-600">
              Track every click with country, device, and referrer data. Beautiful charts and
              insights.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Shorten Your Links?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of users simplifying their link management today.
          </p>
          {isSignedIn ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Access Dashboard
            </button>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Sign In Now
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
