"use client";

import { useState } from "react";
import { CheckCircle2, Send, Loader2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-[#000000]">Inquiry Transmitted</h3>
        <p className="text-xs text-[#787574] max-w-sm mx-auto leading-relaxed">
          Thank you for reaching out. One of our architectural glass estimators will review your dimensions and contact you within 24 business hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-2 text-xs font-semibold text-[#5433eb] hover:underline"
        >
          Send another inquiry &rarr;
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#000000]">Your Name *</label>
          <input
            type="text"
            required
            placeholder="Sarah Jenkins"
            className="w-full h-12 px-5 rounded-full bg-white border border-[#ebebeb] text-sm text-[#000000] placeholder:text-[#787574] focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#000000]">Email Address *</label>
          <input
            type="email"
            required
            placeholder="sarah@designstudio.com"
            className="w-full h-12 px-5 rounded-full bg-white border border-[#ebebeb] text-sm text-[#000000] placeholder:text-[#787574] focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#000000]">Phone Number</label>
          <input
            type="tel"
            placeholder="+1 (555) 019-2834"
            className="w-full h-12 px-5 rounded-full bg-white border border-[#ebebeb] text-sm text-[#000000] placeholder:text-[#787574] focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#000000]">Project Type</label>
          <div className="relative">
            <select
              defaultValue="residential"
              className="w-full h-12 px-5 pr-10 rounded-full bg-white border border-[#ebebeb] text-sm text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] appearance-none transition-all cursor-pointer"
            >
              <option value="residential">Residential Renovation</option>
              <option value="commercial">Commercial / Architectural</option>
              <option value="shower">Custom Shower Enclosure</option>
              <option value="mirrors">Mirror Installation</option>
              <option value="other">Other / Custom Fabrication</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#787574] text-xs">
              ▼
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-[#000000]">
          Estimated Dimensions &amp; Project Description *
        </label>
        <textarea
          required
          rows={4}
          placeholder="Please include approximate dimensions (W x H mm), glass thickness, corner or hole requirements, and your project location for freight estimation..."
          className="w-full p-4 rounded-[24px] bg-white border border-[#ebebeb] text-sm text-[#000000] placeholder:text-[#787574] focus:outline-none focus:ring-2 focus:ring-[#5433eb]/20 focus:border-[#5433eb] transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-13 rounded-full bg-[#5433eb] hover:bg-[#4527cd] text-white text-xs font-semibold shadow-[0_8px_24px_rgba(84,51,235,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Inquiry...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Submit Inquiries &amp; Request CAD Review</span>
          </>
        )}
      </button>
    </form>
  );
}
