import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Copy, Trash2, Eye, MoreVertical } from "lucide-react";
import toast from "react-hot-toast";
import { Id } from "@/convex/_generated/dataModel";

interface Link {
  _id: Id<"links">;
  slug: string;
  originalUrl: string;
  clicks: number;
  createdAt: number;
  expiresAt?: number;
  isExpired: boolean;
}

interface LinksTableProps {
  links: Link[];
  onDeleteSuccess?: () => void;
}

export default function LinksTable({ links, onDeleteSuccess }: LinksTableProps) {
  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);

  const deleteLink = useMutation(api.mutations.deleteLink);

  const handleCopyUrl = (slug: string) => {
    const shortUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard!");
  };

  const handleOpenUrl = (slug: string) => {
    window.open(`/${slug}`, "_blank");
  };

  const handleDeleteClick = (linkId: string) => {
    setLinkToDelete(linkId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!linkToDelete) return;

    try {
      await deleteLink({ linkId: linkToDelete as Id<"links"> });
      toast.success("Link deleted");
      onDeleteSuccess?.();
      setShowDeleteConfirm(false);
      setLinkToDelete(null);
    } catch (error) {
      toast.error("Failed to delete link");
    }
  };

  const handleSelectAll = () => {
    if (selectedLinks.size === links.length) {
      setSelectedLinks(new Set());
    } else {
      setSelectedLinks(new Set(links.map((l) => l._id)));
    }
  };

  const handleSelectLink = (linkId: string) => {
    const newSet = new Set(selectedLinks);
    if (newSet.has(linkId)) {
      newSet.delete(linkId);
    } else {
      newSet.add(linkId);
    }
    setSelectedLinks(newSet);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isExpired = (link: Link) => {
    return link.isExpired || (link.expiresAt && link.expiresAt < Date.now());
  };

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-slate-500 text-lg">No links yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <>
      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedLinks.size === links.length}
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                Short URL
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                Original URL
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                Clicks
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                Created
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                Status
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {links.map((link) => (
              <tr key={link._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedLinks.has(link._id)}
                    onChange={() => handleSelectLink(link._id)}
                    className="rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <code className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {link.slug}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600 truncate max-w-xs">
                    {link.originalUrl}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-900">
                    {link.clicks}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {formatDate(link.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      isExpired(link)
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {isExpired(link) ? "Expired" : "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleCopyUrl(link.slug)}
                      title="Copy URL"
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => handleOpenUrl(link.slug)}
                      title="Open"
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(link._id)}
                      title="Delete"
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Delete Link?</h3>
            <p className="text-slate-600 mb-6">
              This action cannot be undone. All analytics for this link will be deleted.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
