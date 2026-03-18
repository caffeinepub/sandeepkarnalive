import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Camera,
  CheckCircle,
  FileText,
  Loader2,
  Shield,
  Upload,
  User,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

const STEPS = [
  { id: 1, label: "Document", icon: FileText },
  { id: 2, label: "Selfie", icon: Camera },
  { id: 3, label: "Review", icon: Shield },
];

type KYCStatus = "idle" | "pending" | "verified" | "rejected";

export function KYC() {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState("passport");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<KYCStatus>("idle");
  const [dragging, setDragging] = useState(false);
  const docInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  function handleDocFile(file: File | null) {
    if (!file) return;
    setDocFile(file);
    toast.success("Document uploaded successfully!");
  }

  function handleSelfie(file: File | null) {
    if (!file) return;
    setSelfieFile(file);
    toast.success("Selfie captured!");
  }

  async function handleSubmit() {
    setScanning(true);
    await new Promise((r) => setTimeout(r, 3000));
    setScanning(false);
    setStatus("pending");
    toast.success("KYC submitted! Under review by admin.");
  }

  const statusBadge: Record<
    KYCStatus,
    { label: string; color: string; glow: string }
  > = {
    idle: {
      label: "Not Submitted",
      color: "rgba(255,255,255,0.4)",
      glow: "none",
    },
    pending: {
      label: "Pending Review",
      color: "#FFD700",
      glow: "0 0 10px rgba(255,215,0,0.4)",
    },
    verified: {
      label: "Verified ✓",
      color: "#00FF88",
      glow: "0 0 10px rgba(0,255,136,0.4)",
    },
    rejected: {
      label: "Rejected",
      color: "#FF3366",
      glow: "0 0 10px rgba(255,51,102,0.4)",
    },
  };

  const s = statusBadge[status];

  return (
    <div className="min-h-screen bg-mesh pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-3xl font-bold text-white">
              KYC <span className="gold-gradient">Verification</span>
            </h1>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{
                background: `${s.color}15`,
                color: s.color,
                border: `1px solid ${s.color}30`,
                boxShadow: s.glow,
              }}
            >
              {s.label}
            </span>
          </div>
          <p className="text-white/40 text-sm">
            Complete identity verification to unlock higher withdrawal limits.
          </p>
        </motion.div>

        {/* 3-step progress bar */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, idx) => (
            <>
              <button
                key={s.id}
                type="button"
                onClick={() => step > s.id && setStep(s.id)}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background:
                      step > s.id
                        ? "linear-gradient(135deg, #00FF88, #00cc66)"
                        : step === s.id
                          ? "linear-gradient(135deg, #FFD700, #FFA500)"
                          : "rgba(255,255,255,0.08)",
                    boxShadow:
                      step === s.id
                        ? "0 0 15px rgba(255,215,0,0.4)"
                        : step > s.id
                          ? "0 0 10px rgba(0,255,136,0.3)"
                          : "none",
                  }}
                >
                  {step > s.id ? (
                    <CheckCircle className="w-5 h-5 text-black" />
                  ) : (
                    <s.icon
                      className="w-4 h-4"
                      style={{
                        color:
                          step === s.id ? "#0a0a0a" : "rgba(255,255,255,0.4)",
                      }}
                    />
                  )}
                </div>
                <span
                  className="text-xs font-medium"
                  style={{
                    color: step >= s.id ? "#FFD700" : "rgba(255,255,255,0.3)",
                  }}
                >
                  {s.label}
                </span>
              </button>
              {idx < STEPS.length - 1 && (
                <div
                  key={`line-${String(idx)}`}
                  className="flex-1 h-0.5 mx-3 mb-5"
                  style={{
                    background:
                      step > s.id ? "#00FF88" : "rgba(255,255,255,0.08)",
                  }}
                />
              )}
            </>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Document */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,215,0,0.15)",
              }}
            >
              <h2 className="font-display font-bold text-white text-xl mb-1">
                Document Upload
              </h2>
              <p className="text-white/40 text-sm mb-5">
                Upload a clear photo of your government-issued ID
              </p>

              {/* Doc type selector */}
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { val: "passport", label: "Passport" },
                  { val: "national_id", label: "National ID" },
                  { val: "driving_license", label: "Driver License" },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setDocType(opt.val)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background:
                        docType === opt.val
                          ? "rgba(255,215,0,0.15)"
                          : "rgba(255,255,255,0.05)",
                      border:
                        docType === opt.val
                          ? "1px solid rgba(255,215,0,0.4)"
                          : "1px solid rgba(255,255,255,0.08)",
                      color:
                        docType === opt.val
                          ? "#FFD700"
                          : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  handleDocFile(e.dataTransfer.files[0]);
                }}
                onClick={() => docInputRef.current?.click()}
                onKeyDown={(e) =>
                  e.key === "Enter" && docInputRef.current?.click()
                }
                data-ocid="kyc.dropzone"
                className="rounded-xl flex flex-col items-center justify-center py-12 cursor-pointer transition-all w-full text-center"
                style={{
                  border: `2px dashed ${dragging ? "#FFD700" : docFile ? "#00FF88" : "rgba(255,215,0,0.3)"}`,
                  background: dragging
                    ? "rgba(255,215,0,0.05)"
                    : docFile
                      ? "rgba(0,255,136,0.04)"
                      : "rgba(255,255,255,0.02)",
                }}
              >
                <input
                  ref={docInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => handleDocFile(e.target.files?.[0] || null)}
                />
                {docFile ? (
                  <>
                    <CheckCircle
                      className="w-10 h-10 mb-3"
                      style={{ color: "#00FF88" }}
                    />
                    <p className="font-medium text-white text-sm">
                      {docFile.name}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#00FF88" }}>
                      Document uploaded successfully
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mb-3 text-white/20" />
                    <p className="font-medium text-white/60 text-sm">
                      Drop your document here
                    </p>
                    <p className="text-xs text-white/30 mt-1">
                      or click to browse — JPG, PNG, PDF accepted
                    </p>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!docFile) {
                    toast.error("Please upload your document first.");
                    return;
                  }
                  setStep(2);
                }}
                data-ocid="kyc.primary_button"
                className="mt-5 w-full h-11 rounded-lg font-bold text-sm glow-btn-yellow"
              >
                Continue to Selfie
              </button>
            </motion.div>
          )}

          {/* Step 2: Selfie */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(0,240,255,0.15)",
              }}
            >
              <h2 className="font-display font-bold text-white text-xl mb-1">
                Selfie Verification
              </h2>
              <p className="text-white/40 text-sm mb-5">
                Take a clear selfie showing your face and holding your ID
              </p>

              {/* Face outline guide */}
              <div
                className="relative mx-auto w-48 h-60 rounded-3xl mb-6 flex items-center justify-center"
                style={{
                  border: "2px dashed rgba(0,240,255,0.4)",
                  background: "rgba(0,240,255,0.03)",
                }}
              >
                <User className="w-24 h-24 text-white/10" />
                {/* Corner guides */}
                {[
                  "top-2 left-2",
                  "top-2 right-2",
                  "bottom-2 left-2",
                  "bottom-2 right-2",
                ].map((pos, pi) => (
                  <div
                    key={String(pi)}
                    className={`absolute ${pos} w-5 h-5`}
                    style={{
                      borderTop: pos.includes("top")
                        ? "2px solid #00F0FF"
                        : "none",
                      borderBottom: pos.includes("bottom")
                        ? "2px solid #00F0FF"
                        : "none",
                      borderLeft: pos.includes("left")
                        ? "2px solid #00F0FF"
                        : "none",
                      borderRight: pos.includes("right")
                        ? "2px solid #00F0FF"
                        : "none",
                    }}
                  />
                ))}
                {selfieFile && (
                  <div
                    className="absolute inset-0 flex items-center justify-center rounded-3xl"
                    style={{ background: "rgba(0,255,136,0.1)" }}
                  >
                    <CheckCircle
                      className="w-12 h-12"
                      style={{ color: "#00FF88" }}
                    />
                  </div>
                )}
              </div>

              <input
                ref={selfieInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={(e) => handleSelfie(e.target.files?.[0] || null)}
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => selfieInputRef.current?.click()}
                  data-ocid="kyc.upload_button"
                  className="flex-1 h-11 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
                  style={{
                    background: "rgba(0,240,255,0.1)",
                    border: "1px solid rgba(0,240,255,0.3)",
                    color: "#00F0FF",
                  }}
                >
                  <Camera className="w-4 h-4" /> Take Selfie
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!selfieFile) {
                      toast.error("Please take a selfie first.");
                      return;
                    }
                    setStep(3);
                  }}
                  data-ocid="kyc.primary_button"
                  className="flex-1 h-11 rounded-lg font-bold text-sm glow-btn-yellow"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review / Scan */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-2xl p-6 text-center"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,215,0,0.15)",
              }}
            >
              <h2 className="font-display font-bold text-white text-xl mb-1">
                Review & Submit
              </h2>
              <p className="text-white/40 text-sm mb-6">
                Verify your information before submitting
              </p>

              {scanning ? (
                <div className="flex flex-col items-center py-8">
                  {/* AI scan animation */}
                  <div className="relative w-24 h-24 mb-6">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: "2px solid rgba(255,215,0,0.2)",
                        animation: "rotate-ring 2s linear infinite",
                      }}
                    />
                    <div
                      className="absolute inset-2 rounded-full"
                      style={{
                        border: "2px solid rgba(255,215,0,0.5)",
                        animation: "rotate-ring 1.5s linear infinite reverse",
                      }}
                    />
                    <div
                      className="absolute inset-4 rounded-full"
                      style={{
                        border: "2px solid #FFD700",
                        animation: "rotate-ring 1s linear infinite",
                        boxShadow: "0 0 20px rgba(255,215,0,0.4)",
                      }}
                    />
                    <Shield
                      className="absolute inset-0 m-auto w-8 h-8"
                      style={{ color: "#FFD700" }}
                    />
                  </div>
                  <p className="font-display font-bold text-white text-lg">
                    AI Scanning...
                  </p>
                  <p className="text-white/40 text-sm mt-1">
                    Verifying your identity documents
                  </p>
                  <div className="flex gap-1 mt-4">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={String(i)}
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: "#FFD700",
                          animation: `glow-pulse 1s ease-in-out ${i * 0.3}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : status === "pending" ? (
                <div className="py-8">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: "rgba(255,215,0,0.1)",
                      border: "2px solid rgba(255,215,0,0.4)",
                      boxShadow: "0 0 20px rgba(255,215,0,0.3)",
                    }}
                  >
                    <Loader2
                      className="w-8 h-8 animate-spin"
                      style={{ color: "#FFD700" }}
                    />
                  </div>
                  <p className="font-display font-bold text-white text-xl mb-2">
                    Verification Pending
                  </p>
                  <p className="text-white/40 text-sm">
                    Admin will review your documents within 24-48 hours.
                  </p>
                </div>
              ) : (
                <>
                  {/* Summary */}
                  <div className="space-y-3 text-left mb-6">
                    <div
                      className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FileText
                          className="w-4 h-4"
                          style={{ color: "#FFD700" }}
                        />
                        <span className="text-sm text-white/70">
                          Document Type
                        </span>
                      </div>
                      <span className="text-sm font-medium text-white capitalize">
                        {docType.replace("_", " ")}
                      </span>
                    </div>
                    <div
                      className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Upload
                          className="w-4 h-4"
                          style={{ color: "#FFD700" }}
                        />
                        <span className="text-sm text-white/70">Document</span>
                      </div>
                      {docFile ? (
                        <span
                          className="flex items-center gap-1 text-sm"
                          style={{ color: "#00FF88" }}
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Uploaded
                        </span>
                      ) : (
                        <span
                          className="flex items-center gap-1 text-sm"
                          style={{ color: "#FF3366" }}
                        >
                          <XCircle className="w-3.5 h-3.5" /> Missing
                        </span>
                      )}
                    </div>
                    <div
                      className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Camera
                          className="w-4 h-4"
                          style={{ color: "#FFD700" }}
                        />
                        <span className="text-sm text-white/70">Selfie</span>
                      </div>
                      {selfieFile ? (
                        <span
                          className="flex items-center gap-1 text-sm"
                          style={{ color: "#00FF88" }}
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Captured
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-white/40">
                          Optional
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    data-ocid="kyc.submit_button"
                    className="w-full h-11 rounded-lg font-bold text-sm glow-btn-yellow"
                  >
                    <Shield className="w-4 h-4 inline mr-2" /> Submit for
                    Verification
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
