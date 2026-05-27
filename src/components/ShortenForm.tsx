import { useState, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";
import { Link2, Loader2 } from "lucide-react";

interface ShortenFormProps {
  onSuccess?: (slug: string) => void;
}

export default function ShortenForm({ onSuccess }: ShortenFormProps) {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [expiryDays, setExpiryDays] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [slugError, setSlugError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const createLink = useMutation(api.mutations.createLink);
  const checkSlug = useQuery(api.mutations.checkSlugAvailable);

  // Debounced slug availability check
  const handleSlugChange = useCallback(
    async (slug: string) => {
      setCustomSlug(slug);

      if (!slug) {
        setSlugError("");
        return;
      }

      if (slug.length < 3 || slug.length > 50) {
        setSlugError("Slug must be 3-50 characters");
        return;
      }

      if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
        setSlugError("Only alphanumeric and hyphens allowed");
        return;
      }

      // Simulate checking availability (in real app, use debounced query)
      setSlugError(""); // Placeholder - would call checkSlug query
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!url.trim()) {
        toast.error("Please enter a URL");
        return;
      }

      const expiresAt = expiryDays
        ? Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000
        : undefined;

      const result = await createLink({
        originalUrl: url,
        customSlug: customSlug || undefined,
        expiresAt,
      });

      toast.success("Link created successfully!");
      setUrl("");
      setCustomSlug("");
      setExpiryDays("");

      onSuccess?.(result.slug);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create link"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Shorten URL</h2>

      {/* URL Input */}
      <div className="mb-6">
        <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-2">
          Long URL
        </label>
        <div className="relative">
          <Link2 className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            id="url"
            type="url"
            placeholder="https://example.com/very/long/url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Custom Slug Input */}
      <div className="mb-6">
        <label htmlFor="slug" className="block text-sm font-medium text-slate-700 mb-2">
          Custom Slug (optional)
        </label>
        <div className="flex items-center gap-2">
          <span className="text-slate-600">scs.io/</span>
          <input
            id="slug"
            type="text"
            placeholder="my-custom-slug"
            value={customSlug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              slugError ? "border-red-500" : "border-slate-300"
            }`}
          />
        </div>
        {slugError && <p className="text-red-500 text-sm mt-2">{slugError}</p>}
      </div>

      {/* Advanced Options */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-4"
      >
        {showAdvanced ? "Hide" : "Show"} Advanced Options
      </button>

      {showAdvanced && (
        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <label htmlFor="expiry" className="block text-sm font-medium text-slate-700 mb-2">
            Expiry (days) - Optional
          </label>
          <input
            id="expiry"
            type="number"
            placeholder="30"
            min="1"
            max="365"
            value={expiryDays}
            onChange={(e) => setExpiryDays(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Scissors className="w-5 h-5" />
            Shorten URL
          </>
        )}
      </button>
    </form>
  );
}

import { Scissors } from "lucide-react";
