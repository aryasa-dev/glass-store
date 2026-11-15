"use client";

import React, { useState } from "react";
import { Printer, Copy, Check, Share2 } from "lucide-react";

interface OrderConfirmationActionsProps {
  orderNumber: string;
}

export function OrderConfirmationActions({ orderNumber }: OrderConfirmationActionsProps) {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5 print:hidden">
      <button
        onClick={handlePrint}
        className="h-10 px-4 rounded-full bg-white hover:bg-[#f2f4f5] text-[#000000] text-xs font-semibold border border-[#ebebeb] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all flex items-center gap-1.5 cursor-pointer tracking-tight"
        title="Print Spec Sheet"
      >
        <Printer className="w-3.5 h-3.5 text-[#787574]" />
        <span>Print Specification</span>
      </button>

      <button
        onClick={handleCopyLink}
        className="h-10 px-4 rounded-full bg-white hover:bg-[#f2f4f5] text-[#000000] text-xs font-semibold border border-[#ebebeb] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all flex items-center gap-1.5 cursor-pointer tracking-tight"
        title="Copy order confirmation link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700">Link Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-[#787574]" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
