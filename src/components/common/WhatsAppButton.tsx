"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export function WhatsAppButton({
  phoneNumber = "+1234567890",
  defaultMessage = "Hello! I would like to inquire about custom glass cutting and pricing.",
}: WhatsAppButtonProps) {
  const encodedMsg = encodeURIComponent(defaultMessage);
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  const href = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with our Glass Specialists on WhatsApp"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 h-14 pl-4 pr-5 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white shadow-[0_8px_28px_rgba(84,51,235,0.4)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
    >
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
        <MessageCircle className="w-5 h-5 text-white" />
      </div>
      <div className="text-left">
        <div className="text-[10px] uppercase tracking-wider text-white/80 font-semibold leading-none">
          Live Assistance
        </div>
        <div className="text-xs font-bold leading-tight mt-0.5">
          Chat on WhatsApp
        </div>
      </div>
    </a>
  );
}
