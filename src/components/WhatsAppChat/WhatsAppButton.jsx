import React, { useRef, useState } from "react";
import Button from "/src/components/ui/button.jsx";
import { FaWhatsapp } from 'react-icons/fa';
import WhatsAppModal from "./WhatsAppModal";
import { WHATSAPP_NUMBER, PRE_FILLED_MESSAGE, buildWhatsAppUrl } from "./whatsappConfig";

export default function WhatsAppButton(props) {
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [error, setError] = useState(null);

  const openModal = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    setError(null);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setIsOpening(false);
    setError(null);
  };

  const handleConfirm = async () => {
    setError(null);
    if (!WHATSAPP_NUMBER) {
      setError("Business WhatsApp number is not configured. Please set VITE_WHATSAPP_NUMBER.");
      return;
    }

    const url = buildWhatsAppUrl(WHATSAPP_NUMBER, PRE_FILLED_MESSAGE);
    if (!url) {
      setError("Couldn't build WhatsApp link. Please try again.");
      return;
    }

    try {
      setIsOpening(true);
      // Open in a new tab/window. wa.me works for web and will redirect to app where available.
      const win = window.open(url, "_blank");
      if (!win) throw new Error("popup-blocked");
      // Close modal after a short delay to show loading state
      setTimeout(() => {
        setOpen(false);
        setIsOpening(false);
      }, 600);
    } catch (e) {
      console.error(e);
      setIsOpening(false);
      setError("Couldn't open WhatsApp. Please try again.");
    }
  };

  return (
    <>
      <Button
        {...props}
        ref={triggerRef}
        onClick={openModal}
        className={`${props.className ?? ""} flex items-center justify-center gap-2`}
      >
        <FaWhatsapp className="w-4 h-4" aria-hidden />
        Chat on WhatsApp
      </Button>

      <WhatsAppModal
        open={open}
        onClose={closeModal}
        onConfirm={handleConfirm}
        isOpening={isOpening}
        error={error}
        initialFocusRef={triggerRef}
      />
    </>
  );
}
