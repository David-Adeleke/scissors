import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Globe, Monitor, MousePointerClick } from "lucide-react";

interface AnalyticsDashboardProps {
  linkData: {
    clicks: number;
    createdAt: number;
  };
  analytics: {
    clicksByCountry: Array<{ name: string; value: number }>;
    clicksByDevice: Array<{ name: string; value: number }>;
    clicksByReferrer: Array<{ name: string; value: number }>;
    clicksOverTime: Array<{ time: string; value: number }>;
  };
}

const COLORS = ["#3B82F6", "#EC4899", "#8B5CF6", "#F59E0B", "#10B981"];

export default function AnalyticsDashboard({
  linkData,
  analytics,
}: AnalyticsDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MousePointerClick className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Clicks</p>
              <p className="text-3xl font-bold text-slate-900">
                {linkData.clicks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Countries</p>
              <p className="text-3xl font-bold text-slate-900">
                {analytics.clicksByCountry.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Monitor className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Top Referrer</p>
              <p className="text-2xl font-bold text-slate-900 truncate">
                {analytics.clicksByReferrer[0]?.name || "Direct"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clicks Over Time */}
        {analytics.clicksOverTime.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Clicks Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.clicksOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  style={{ fontSize: "12px" }}
                  tick={{ dy: 5 }}
                />
                <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  dot={{ fill: "#3B82F6", r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Device Breakdown */}
        {analytics.clicksByDevice.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Device Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.clicksByDevice}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) =>
                    `${name}: ${value}`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.clicksByDevice.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top Referrers */}
      {analytics.clicksByReferrer.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Top Referrers
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.clicksByReferrer}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Countries */}
      {analytics.clicksByCountry.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Top Countries
          </h3>
          <div className="space-y-3">
            {analytics.clicksByCountry.slice(0, 10).map((country) => (
              <div key={country.name} className="flex items-center justify-between">
                <span className="text-slate-700">{country.name}</span>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 rounded-full px-3 py-1">
                    <span className="text-sm font-semibold text-blue-600">
                      {country.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
