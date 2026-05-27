import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";

export default function Redirect() {
  const { slug } = useParams<{ slug: string }>();
  const [status, setStatus] = useState<"loading" | "error" | "expired">("loading");

  useEffect(() => {
    if (!slug) {
      setStatus("error");
      return;
    }

    // Call the HTTP action to handle redirect
    const timer = setTimeout(() => {
      // In a real app, this would call your Convex HTTP endpoint
      // For demo, we'll just show an error
      setStatus("error");
    }, 3000);

    return () => clearTimeout(timer);
  }, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Redirecting...</h1>
            <p className="text-slate-600">Taking you to your destination</p>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Link Not Found</h1>
            <p className="text-slate-600 mb-4">
              The short link you're trying to access doesn't exist.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Back to Home
            </a>
          </>
        )}

        {status === "expired" && (
          <>
            <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Link Expired</h1>
            <p className="text-slate-600 mb-4">
              This link has expired and is no longer available.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Back to Home
            </a>
          </>
        )}
      </div>
    </div>
  );
}
