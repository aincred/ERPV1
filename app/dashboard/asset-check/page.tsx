"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

type AssetForm = {
  acceptType: string;
  assetType: string;
  manufacturer: string;
  macAddress: string;
  ipAddress: string;
  location: string;
  custodian: string;
  os: string;
  antivirus: string;
  osUpdated: boolean;
  osGenuine: boolean;
  thirdPartyInstalled: boolean;
  thirdPartyName: string;
  antivirusStatus: string;
  firewallEnabled: boolean;
  firewallAllProfiles: boolean;
  smbDisabled: boolean;
  accountLockoutPolicy: boolean;
  passwordPolicy: boolean;
  auditPolicy: boolean;
  guestDisabled: boolean;
  ctrlAltDelRequired: boolean;
  inactivityLimitSet: boolean;
  machineAccountLockout: boolean;
  anonymousSamDisabled: boolean;
  anonymousSamSharesDisabled: boolean;
  everyonePermissionDisabled: boolean;
  rdpEnabled: boolean;
  usbEnabled: boolean;
  biosPassword: boolean;
  registryPermissions: boolean;
  cleanDesktop: boolean;
  windowsLicenseStatus?: "active" | "expired" | "notActivated" | "";
  [dynamicKey: string]: any;
};

export default function AssetCheckPage() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [fullViewPhoto, setFullViewPhoto] = useState<string | null>(null);
  const router = useRouter();

  const [form, setForm] = useState<AssetForm>({
    acceptType: "",
    assetType: "",
    manufacturer: "",
    macAddress: "",
    ipAddress: "",
    location: "",
    custodian: "",
    os: "",
    antivirus: "",
    osUpdated: false,
    osGenuine: false,
    thirdPartyInstalled: false,
    thirdPartyName: "",
    antivirusStatus: "",
    firewallEnabled: false,
    firewallAllProfiles: false,
    smbDisabled: false,
    accountLockoutPolicy: false,
    passwordPolicy: false,
    auditPolicy: false,
    guestDisabled: false,
    ctrlAltDelRequired: false,
    inactivityLimitSet: false,
    machineAccountLockout: false,
    anonymousSamDisabled: false,
    anonymousSamSharesDisabled: false,
    everyonePermissionDisabled: false,
    rdpEnabled: false,
    usbEnabled: false,
    biosPassword: false,
    registryPermissions: false,
    cleanDesktop: false,
    windowsLicenseStatus: "",
  });

  // Load persisted form and photos
  useEffect(() => {
    const savedForm = localStorage.getItem("savedForm");
    const savedPhoto = localStorage.getItem("capturedPhoto");
    const savedField = localStorage.getItem("capturedField");
    const savedExpanded = localStorage.getItem("expandedState");

    if (savedForm) {
      setForm(JSON.parse(savedForm));
      localStorage.removeItem("savedForm");
    }

    if (savedPhoto && savedField) {
      setForm((prev) => ({
        ...prev,
        [`${savedField}_cameraPhoto`]: savedPhoto,
      }));
      localStorage.removeItem("capturedPhoto");
      localStorage.removeItem("capturedField");
    }

    if (savedExpanded) {
      setExpanded(JSON.parse(savedExpanded));
      localStorage.removeItem("expandedState");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name } = target;
    let value: string | boolean;

    if (target instanceof HTMLInputElement) {
      value = target.type === "checkbox" ? target.checked : target.value;
    } else {
      value = target.value;
    }

    setForm({ ...form, [name]: value });
  };

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
      anonymousSamDisabled: "Do Not Allow Anonymous Enumeration of SAM Accounts is Enabled?",
      anonymousSamSharesDisabled:
        "Do Not Allow Anonymous Enumeration of SAM Accounts and Shares is Enabled?",
      everyonePermissionDisabled:
        "Let 'Everyone' Permissions Apply to Anonymous Users is Disabled?",
      rdpEnabled: "Is Remote Desktop Enabled?",
      usbEnabled: "Is USB Port Enabled?",
      biosPassword: "Is BIOS Password Configured?",
      registryPermissions: "Check for Users Registry Permissions?",
      cleanDesktop: "Clean Desktop? (Desktop Should Be Clean)",
    };
    return labels[key] || key;
  };

  const toggleExpand = (key: string) => {
    setExpanded((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("expandedState", JSON.stringify(updated));
      return updated;
    });
  };

  const checkBlur = (imageDataUrl: string, key: string) => {
  const img = new Image();
  img.src = imageDataUrl;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let sum = 0;
    let sumSq = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      const brightness =
        0.34 * pixels[i] + 0.5 * pixels[i + 1] + 0.16 * pixels[i + 2];
      sum += brightness;
      sumSq += brightness * brightness;
    }

    const mean = sum / (pixels.length / 4);
    const variance = sumSq / (pixels.length / 4) - mean * mean;

    if (variance < 500) {
      setForm((prev) => ({ ...prev, [`${key}_photo_blur`]: true }));
      toast.error("⚠️ The uploaded photo seems blurry. Please upload a clearer image.", {
        duration: 4000,
      });
    } else {
      setForm((prev) => ({ ...prev, [`${key}_photo_blur`]: false }));
      toast.success("✅ The uploaded image looks clear!", { duration: 3000 });
    }
  };
};
  return (
    <>
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-200 p-6"
      >
        <div className="max-w-4xl mx-auto bg-gray-900/70 border border-gray-800 rounded-2xl shadow-lg p-6 backdrop-blur-sm">
          <h1 className="text-2xl font-bold mb-6 text-cyan-400 text-center">
            🧩 Asset & Security Compliance Checklist
          </h1>

          <div className="space-y-5">
            {/* Accept Type */}
            <div>
              <label className="block mb-1 font-medium text-gray-300">Accept Type</label>
              <select
                name="acceptType"
                value={form.acceptType}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">Select Type</option>
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
              </select>
            </div>

            {/* Asset Type */}
            <div>
              <label className="block mb-1 font-medium text-gray-300">Asset/Device Type</label>
              <select
                name="assetType"
                value={form.assetType}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">Select Asset Type</option>
                <option value="pc">PC</option>
                <option value="laptop">Laptop</option>
                <option value="printer">Printer</option>
                <option value="server">Server</option>
                <option value="networkDevice">Network Devices</option>
              </select>
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block mb-1 font-medium text-gray-300">
                Manufacturer Name / Model Number
              </label>
              <input
                type="text"
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                placeholder="e.g. Dell Inspiron 5410"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            
            {/* MAC & IP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-300">MAC Address</label>
                <input
                  type="text"
                  name="macAddress"
                  value={form.macAddress}
                  onChange={handleChange}
                  placeholder="00-14-22-01-23-45"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-300">IP Address of Asset</label>
                <input
                  type="text"
                  name="ipAddress"
                  value={form.ipAddress}
                  onChange={handleChange}
                  placeholder="192.168.1.10"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* Location & Custodian */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-300">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Head Office"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-300">Custodian Name</label>
                <input
                  type="text"
                  name="custodian"
                  value={form.custodian}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* OS & Antivirus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium text-gray-300">Operating System</label>
                <input
                  type="text"
                  name="os"
                  value={form.os}
                  onChange={handleChange}
                  placeholder="e.g. Windows 10 Pro"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-300">Antivirus Name</label>
                <input
                  type="text"
                  name="antivirus"
                  value={form.antivirus}
                  onChange={handleChange}
                  placeholder="e.g. Windows Defender"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* Security & Compliance Dropdown */}
            <div className="mt-6 border-t border-gray-700 pt-4">
              <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg transition"
              >
                <h2 className="text-lg font-semibold text-cyan-400">🔍 Security & Compliance Checks</h2>
                {open ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5 text-cyan-400" />}
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-4 space-y-3 px-2"
                  >
                    {[
                      "osUpdated",
                      "osGenuine",
                      "thirdPartyInstalled",
                      "antivirusStatus",
                      "firewallEnabled",
                      "firewallAllProfiles",
                      "smbDisabled",
                      "accountLockoutPolicy",
                      "passwordPolicy",
                      "auditPolicy",
                      "guestDisabled",
                      "ctrlAltDelRequired",
                      "inactivityLimitSet",
                      "machineAccountLockout",
                      "anonymousSamDisabled",
                      "anonymousSamSharesDisabled",
                      "everyonePermissionDisabled",
                      "rdpEnabled",
                      "usbEnabled",
                      "biosPassword",
                      "registryPermissions",
                      "cleanDesktop",
                    ].map((key) => (
                      <div key={key} className="flex flex-col gap-1 border-b border-gray-800 pb-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!expanded[key]}
                            onChange={() => toggleExpand(key)}
                            className="accent-cyan-500 w-4 h-4 cursor-pointer"
                          />
                          <label className="font-medium text-gray-300">{getLabel(key)}</label>
                        </div>

                        <AnimatePresence>
                          {expanded[key] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {/* Select Yes/No */}
                              {key === "antivirusStatus" ? (
                                <select
                                  name={key}
                                  value={form.antivirusStatus}
                                  onChange={(e) =>
                                    setForm({ ...form, antivirusStatus: e.target.value })
                                  }
                                  className="mt-2 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400"
                                >
                                  <option value="">Select Status</option>
                                  <option value="updated">Updated</option>
                                  <option value="notUpdated">Not Updated/Expired License</option>
                                </select>
                              ) : (
                                <select
                                  name={key}
                                  value={form[key as keyof AssetForm] ? "yes" : "no"}
                                  onChange={(e) =>
                                    setForm({ ...form, [key]: e.target.value === "yes" })
                                  }
                                  className="mt-2 w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-400"
                                >
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                                </select>
                              )}

                              {/* Upload Photo */}
                              {form[key as keyof AssetForm] === false && (
                                <div className="mt-3 flex flex-col sm:flex-row gap-3">
                                  <div className="flex-1">
                                    <label className="block mb-1 font-medium text-gray-300">
                                      Upload Proof Photo
                                    </label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer focus:ring-2 focus:ring-cyan-400"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onload = () => {
                                            const dataUrl = reader.result as string;
                                            setForm((prev) => ({
                                              ...prev,
                                              [`${key}_photo`]: dataUrl,
                                            }));
                                            checkBlur(dataUrl, `${key}_photo`);
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                    {form[`${key}_photo`] && (
                                      <div className="relative mt-2">
                                        <img
                                          src={form[`${key}_photo`]}
                                          alt="Uploaded"
                                          className="w-full max-h-48 object-contain rounded-lg cursor-pointer"
                                          onClick={() => setFullViewPhoto(form[`${key}_photo`])}
                                        />
                                        <button
                                          onClick={() =>
                                            setForm((prev) => {
                                              const copy = { ...prev };
                                              delete copy[`${key}_photo`];
                                              return copy;
                                            })
                                          }
                                          className="absolute top-1 right-1 text-red-500 font-bold bg-gray-800 rounded-full w-6 h-6 flex items-center justify-center"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  if (!form.acceptType || !form.assetType || !form.manufacturer) {
                    toast.error("Please fill Accept Type, Asset Type, and Manufacturer", {
                      duration: 3000,
                    });
                    return;
                  }

                  const securityChecks: Record<string, any> = {};
                  Object.keys(form).forEach((key) => {
                    if (key.endsWith("_photo") || key.endsWith("_cameraPhoto")) {
                      const baseKey = key.replace(/_(photo|cameraPhoto)/, "");
                      if (!securityChecks[baseKey]) securityChecks[baseKey] = {};
                      securityChecks[baseKey].photo = form[key];
                    }
                  });

                  const submission = {
                    ...form,
                    securityChecks,
                    submittedAt: new Date().toLocaleString(),
                  };

                  const existing = JSON.parse(localStorage.getItem("submissions") || "[]");
                  existing.push(submission);
                  localStorage.setItem("submissions", JSON.stringify(existing));

                  toast.success("✅ Form submitted and saved successfully!", { duration: 3000 });

                  localStorage.removeItem("savedForm");
                  localStorage.removeItem("capturedPhoto");
                  localStorage.removeItem("capturedField");
                  localStorage.removeItem("expandedState");
                }}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/50 hover:scale-105 transform transition-all duration-300"
              >
                🚀 Submit
              </button>
            </div>
          </div>
        </div>

        {/* Full View Modal */}
        {fullViewPhoto && (
          <div
            onClick={() => setFullViewPhoto(null)}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer"
          >
            <img src={fullViewPhoto} className="max-h-full max-w-full rounded-lg" />
          </div>
        )}
      </motion.div>
    </>
  );
}

