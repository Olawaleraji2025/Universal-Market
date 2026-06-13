import { useEffect, useMemo, useRef, useState } from "react";

import Button from "../ui/button";
import { Input } from "../ui/input";

export default function RequestModal({
  open,
  onClose,
  productTitle,
  priceLabel,
  whatsappMessage,
  requestWhatsAppNumber,
  defaultCountryCode = "234",
}) {
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const [showLogin, setShowLogin] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const firstFieldRef = useRef(null);

  const buildWhatsAppText = useMemo(() => {
    const base = whatsappMessage?.trim()
      ? whatsappMessage.trim()
      : "Hi, I’m interested in this product.";

    const optionalMessage = message?.trim();
    const nameLine = fullName?.trim()
      ? `Name: ${fullName.trim()}`
      : "Name: (not provided)";

    const contactLine = contact?.trim()
      ? `Contact: ${contact.trim()}`
      : "Contact: (not provided)";

    const requestLine = `Product: ${productTitle} | Price: ${priceLabel}`;
    const msgLine = optionalMessage ? `Message: ${optionalMessage}` : "";

    return [base, requestLine, nameLine, contactLine, msgLine]
      .filter(Boolean)
      .join("\n");
  }, [
    whatsappMessage,
    fullName,
    contact,
    message,
    productTitle,
    priceLabel,
  ]);

  const whatsappHref = useMemo(() => {
    const text = encodeURIComponent(buildWhatsAppText);
    return `https://wa.me/${requestWhatsAppNumber}?text=${text}`;
  }, [buildWhatsAppText, requestWhatsAppNumber]);

  useEffect(() => {
    if (!open) return;

    // Reset form when opening (deferred to avoid warnings)
    const t = window.setTimeout(() => {
      setFullName("");
      setContact("");
      setMessage("");
      setShowLogin(false);
      setSubmitted(false);
      firstFieldRef.current?.focus?.();
    }, 0);

    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const validate = () => {
    if (!fullName.trim()) return { ok: false, error: "Please enter your full name." };
    if (!contact.trim()) return { ok: false, error: "Please enter your WhatsApp or phone number." };
    return { ok: true };
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (!v.ok) {
      alert(v.error);
      return;
    }

    // UI success state (no backend; we still open WhatsApp via the button below)
    setSubmitted(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" aria-hidden={false}>
      <div
        className="absolute inset-0 bg-black/50"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose?.();
        }}
      />

      <div className="relative min-h-full flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Request product"
          className="w-full max-w-lg bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#01241a]">Request Item</h2>
              <p className="text-sm text-gray-600 mt-1">Fill your details to request this product.</p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-600"
            >
              ✕
            </Button>
          </div>

          <div className="px-5 py-4 space-y-4">
            {!submitted ? (
              <>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-emerald-800">You’re requesting</p>
                  <p className="mt-1 text-sm font-bold text-[#01241a]">{productTitle}</p>
                  <p className="text-sm text-emerald-900 font-semibold">{priceLabel}</p>
                </div>

                <form className="space-y-4" onSubmit={onSubmit}>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-semibold text-[#01241a]"
                      htmlFor="fullName"
                    >
                      Full Name
                    </label>
                    <Input
                      ref={firstFieldRef}
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Raji Olawale"
                      autoComplete="name"
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-semibold text-[#01241a]"
                      htmlFor="contact"
                    >
                      WhatsApp or Phone number
                    </label>
                    <Input
                      id="contact"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder={`e.g. ${defaultCountryCode} 80...`}
                      inputMode="tel"
                      autoComplete="tel"
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-sm font-semibold text-[#01241a]"
                      htmlFor="message"
                    >
                      Optional message
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Add any extra details (delivery, condition, etc.)"
                      className="w-full min-h-[90px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-1/2"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="w-1/2 bg-[#064e3b] hover:bg-emerald-900 text-white"
                    >
                      Submit request
                    </Button>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-gray-600">Already have an account?</span>
                      <button
                        type="button"
                        className="text-xs font-semibold text-[#064e3b] hover:text-emerald-900"
                        onClick={() => setShowLogin((v) => !v)}
                      >
                        Login
                      </button>
                    </div>

                    {showLogin && (
                      <div className="mt-3 bg-gray-50 border border-gray-100 rounded-xl p-3">
                        <p className="text-xs text-gray-600">Login UI placeholder (no backend connected).</p>
                        <div className="mt-2 flex gap-2">
                          <Input
                            placeholder="Email or phone"
                            className="bg-white"
                          />
                          <Button
                            type="button"
                            className="bg-[#064e3b] hover:bg-emerald-900 text-white"
                          >
                            Login
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    By submitting, we’ll prepare your WhatsApp request details.
                  </p>
                </form>
              </>
            ) : (
              <>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-emerald-800">Request Received!</p>
                  <p className="mt-1 text-sm text-[#01241a] font-bold">Your request has been logged.</p>
                  <p className="text-sm text-gray-600 mt-1">
                    You can continue the conversation directly on WhatsApp.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="w-1/2 bg-[#064e3b] hover:bg-emerald-900 text-white"
                    onClick={() => window.open(whatsappHref, "_blank", "noopener,noreferrer")}
                  >
                    Continue to WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    className="w-1/2"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

