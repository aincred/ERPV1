"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type AssetForm = {
  id?: string;
  submittedAt?: string;
  acceptType: string;
  assetType: string;
  manufacturer: string;
  macAddress: string;
  ipAddress: string;
  location: string;
  custodian: string;
  os: string;
  securityChecks: Record<string, any>;
};

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<AssetForm[]>([]);
  const [selected, setSelected] = useState<AssetForm | null>(null);
  const [photoView, setPhotoView] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await fetch("/api/asset-submissions");
        const json = await res.json();
        if (res.ok && json.success && Array.isArray(json.submissions)) {
          setSubmissions(json.submissions);
          return;
        }
        console.error("Failed to fetch submissions from API:", json);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
      // fallback to localStorage if API fails
      const data = localStorage.getItem("submissions");
      if (data) {
        try {
          setSubmissions(JSON.parse(data));
        } catch {
          setSubmissions([]);
        }
      }
    };
    fetchSubmissions();
  }, []);

  const getLabel = (key: string) => {
    const labels: Record<string, string> = {
      osUpdated: "Is Operating System Updated?",
      osGenuine: "Is Windows (OS) Genuine?",
      thirdPartyInstalled: "Any 3rd Party Software Installed?",
      antivirusStatus: "Antivirus Status Active?",
      firewallEnabled: "Is Firewall Enabled?",
      firewallAllProfiles: "Is Firewall Enabled for All Profiles?",
      smbDisabled: "Is SMB Services Disabled?",
      accountLockoutPolicy: "Is Account Lockout Policy Configured?",
      passwordPolicy: "Is Password Policy Configured?",
      auditPolicy: "Is All Audit Policy Configured?",
      guestDisabled: "Is Guest Account Disabled?",
      ctrlAltDelRequired: "Is CTRL+ALT+DEL Required for Interactive Logins?",
      inactivityLimitSet: "Is Machine Inactivity Limit Set?",
      machineAccountLockout: "Is Machine Account Lockout Threshold Set?",
      anonymousSamDisabled: "Do Not Allow Anonymous Enumeration of SAM Accounts?",
      anonymousSamSharesDisabled:
        "Do Not Allow Anonymous Enumeration of SAM Accounts and Shares?",
      everyonePermissionDisabled:
        "Let 'Everyone' Permissions Apply to Anonymous Users Disabled?",
      rdpEnabled: "Is Remote Desktop Enabled?",
      usbEnabled: "Is USB Port Enabled?",
      biosPassword: "Is BIOS Password Configured?",
      registryPermissions: "Check for Users Registry Permissions?",
      cleanDesktop: "Clean Desktop?",
    };
    return labels[key] || key;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400">
        Submitted Asset Data
      </h1>

      {submissions.length === 0 ? (
        <p className="text-gray-400">No submissions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-700 rounded-lg">
            <thead className="bg-gray-800 text-cyan-300">
              <tr>
                <th className="p-3 border border-gray-700">#</th>
                <th className="p-3 border border-gray-700">Accept Type</th>
                <th className="p-3 border border-gray-700">Asset Type</th>
                <th className="p-3 border border-gray-700">Manufacturer</th>
                <th className="p-3 border border-gray-700">MAC</th>
                <th className="p-3 border border-gray-700">IP</th>
                <th className="p-3 border border-gray-700">Location</th>
                <th className="p-3 border border-gray-700">Custodian</th>
                <th className="p-3 border border-gray-700">OS</th>
                <th className="p-3 border border-gray-700 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((item, index) => (
                <tr
                  key={index}
                  className="text-sm text-gray-200 even:bg-gray-900 odd:bg-gray-800"
                >
                  <td className="p-3 border border-gray-700 text-center">
                    {index + 1}
                  </td>
                  <td className="p-3 border border-gray-700">
                    {item.acceptType}
                  </td>
                  <td className="p-3 border border-gray-700">
                    {item.assetType}
                  </td>
                  <td className="p-3 border border-gray-700">
                    {item.manufacturer}
                  </td>
                  <td className="p-3 border border-gray-700">
                    {item.macAddress}
                  </td>
                  <td className="p-3 border border-gray-700">
                    {item.ipAddress}
                  </td>
                  <td className="p-3 border border-gray-700">
                    {item.location}
                  </td>
                  <td className="p-3 border border-gray-700">
                    {item.custodian}
                  </td>
                  <td className="p-3 border border-gray-700">{item.os}</td>
                  <td className="p-3 border border-gray-700 text-center">
                    <button
                      onClick={() => setSelected(item)}
                      className="px-3 py-1 text-sm bg-cyan-600 hover:bg-cyan-700 rounded-md text-white transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative border border-cyan-700 overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <X size={22} />
              </button>

              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
                Asset Details
              </h2>

              <div className="space-y-2 text-gray-200">
                <p>
                  <span className="text-cyan-400 font-semibold">
                    Accept Type:
                  </span>{" "}
                  {selected.acceptType}
                </p>
                <p>
                  <span className="text-cyan-400 font-semibold">
                    Asset Type:
                  </span>{" "}
                  {selected.assetType}
                </p>
                <p>
                  <span className="text-cyan-400 font-semibold">
                    Manufacturer:
                  </span>{" "}
                  {selected.manufacturer}
                </p>
                <p>
                  <span className="text-cyan-400 font-semibold">
                    MAC Address:
                  </span>{" "}
                  {selected.macAddress}
                </p>
                <p>
                  <span className="text-cyan-400 font-semibold">
                    IP Address:
                  </span>{" "}
                  {selected.ipAddress}
                </p>
                <p>
                  <span className="text-cyan-400 font-semibold">Location:</span>{" "}
                  {selected.location}
                </p>
                <p>
                  <span className="text-cyan-400 font-semibold">
                    Custodian:
                  </span>{" "}
                  {selected.custodian}
                </p>
                <p>
                  <span className="text-cyan-400 font-semibold">OS:</span>{" "}
                  {selected.os}
                </p>
              </div>

              {/* 🔍 Security & Compliance Checks */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-cyan-300 mb-3">
                  🔍 Security & Compliance Checks
                </h3>
                {selected.securityChecks &&
                Object.keys(selected.securityChecks).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(selected.securityChecks).map(
                      ([key, check]: any, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-gray-800 rounded-lg border border-gray-700"
                        >
                          <p className="text-gray-300 font-medium">
                            {getLabel(key)}
                          </p>
                          <p className="text-sm mt-1">
                            ✅ Status:{" "}
                            <span
                              className={`font-semibold ${
                                check.value === true
                                  ? "text-green-400"
                                  : check.value === false
                                  ? "text-red-400"
                                  : "text-yellow-400"
                              }`}
                            >
                              {check.value === true
                                ? "Yes"
                                : check.value === false
                                ? "No"
                                : "Not Specified"}
                            </span>
                          </p>
                          {check.photo && (
                            <img
                              src={check.photo}
                              alt="Proof"
                              onClick={() => setPhotoView(check.photo)}
                              className="w-28 h-28 mt-2 object-cover rounded-lg border border-cyan-500 cursor-pointer hover:scale-105 hover:border-cyan-400 transition"
                            />
                          )}
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-400">No compliance data found.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Photo Viewer */}
      <AnimatePresence>
        {photoView && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setPhotoView(null)}
              className="absolute top-5 right-5 text-gray-300 hover:text-white"
            >
              <X size={28} />
            </button>
            <motion.img
              src={photoView}
              alt="Full view"
              className="max-w-full max-h-[85vh] rounded-xl border border-cyan-500 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
