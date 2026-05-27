import { useAuth } from "@clerk/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router-dom";
import ShortenForm from "@/components/ShortenForm";
import LinksTable from "@/components/LinksTable";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const userLinks = useQuery(api.mutations.getUserLinks);
  const selectedAnalytics = selectedLinkId
    ? useQuery(api.mutations.getLinkAnalytics, {
        linkId: selectedLinkId as any,
      })
    : null;

  if (!isSignedIn) {
    navigate("/");
    return null;
  }

  if (userLinks === undefined) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const selectedLink = userLinks?.find((l) => l._id === selectedLinkId);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Create short links, generate QR codes, and track analytics
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Shortener Form */}
        <div className="lg:col-span-1">
          <ShortenForm
            onSuccess={() => setRefreshKey((k) => k + 1)}
          />
        </div>

        {/* Right: Links & Analytics */}
        <div className="lg:col-span-2 space-y-8">
          {/* Links Table */}
          <LinksTable
            links={userLinks || []}
            onDeleteSuccess={() => setRefreshKey((k) => k + 1)}
          />

          {/* Analytics Dashboard */}
          {selectedLink && selectedAnalytics && (
            <div>
              <button
                onClick={() => setSelectedLinkId(null)}
                className="mb-4 text-slate-600 hover:text-slate-900 font-medium text-sm"
              >
                ← Close Analytics
              </button>
              <AnalyticsDashboard
                linkData={selectedLink}
                analytics={{
                  clicksByCountry: selectedAnalytics.clicksByCountry || [],
                  clicksByDevice: selectedAnalytics.clicksByDevice || [],
                  clicksByReferrer: selectedAnalytics.clicksByReferrer || [],
                  clicksOverTime: selectedAnalytics.clicksOverTime || [],
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
