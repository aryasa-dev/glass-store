import type { Metadata } from "next";
import { PublicNavbar } from "@/components/common/PublicNavbar";
import { PublicFooter } from "@/components/common/PublicFooter";
import { ContactForm } from "./ContactForm";
import { Mail, Phone, MapPin, Clock, MessageCircle, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Commercial Glazing Inquiries",
  description:
    "Get in touch with our glass cutting technicians, submit architectural blueprints, or request freight quotes for custom panels.",
  openGraph: {
    title: "Contact & Commercial Glazing Inquiries | Shop.",
    description:
      "Connect with our glass engineering specialists for custom architectural blueprints, technical tolerances, and freight delivery logistics.",
    url: "/contact",
    images: [
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Shop. Commercial Glazing Support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Commercial Glazing Inquiries | Shop.",
    description:
      "Get in touch with our engineering team for precision cut glass solutions.",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&h=630&q=80",
    ],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f2f4f5] text-[#000000] flex flex-col justify-between">
      <PublicNavbar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 sm:py-20 w-full space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-[#000000] border border-[#ebebeb] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <Sparkles className="w-3.5 h-3.5 text-[#5433eb]" />
            Direct Estimator Channel
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#000000]">
            Speak to a Glass Specialist
          </h1>
          <p className="text-sm sm:text-base text-[#787574] leading-relaxed">
            Need customized notch cuts, bulk architectural orders, or help calculating complex templates? Send us your project details below.
          </p>
        </div>

        {/* Two Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Card (1 col) */}
          <div className="space-y-6">
            <div className="bg-white rounded-[28px] p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] border-0 space-y-6">
              <div>
                <h3 className="font-bold text-base text-[#000000]">Foundry Showroom</h3>
                <p className="text-xs text-[#787574] mt-1">
                  Visit our sample room to inspect glass clarity, edge polishes, and tint swatches.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#5433eb]/10 text-[#5433eb] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#000000]">Factory Location</div>
                    <div className="text-[#787574] mt-0.5 leading-relaxed">
                      123 Precision Way, Industrial Park, San Francisco, CA 94107
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#5433eb]/10 text-[#5433eb] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#000000]">Direct Telephone</div>
                    <div className="text-[#787574] mt-0.5">+1 (555) 019-2834</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#5433eb]/10 text-[#5433eb] flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#000000]">Estimations &amp; CAD Files</div>
                    <div className="text-[#787574] mt-0.5">quotes@precisionglass.store</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#5433eb]/10 text-[#5433eb] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#000000]">Operating Hours</div>
                    <div className="text-[#787574] mt-0.5">Mon – Fri: 7:30 AM – 5:30 PM PST</div>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct card */}
            <div className="bg-[#5433eb] text-white rounded-[28px] p-6 shadow-[0_8px_24px_rgba(84,51,235,0.35)] space-y-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <h4 className="font-bold text-sm">Need Faster Response?</h4>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Connect directly with our workshop floor technicians via WhatsApp for fast sizing clarifications.
              </p>
              <a
                href="https://wa.me/15550192834?text=Hello%2C%20I%20have%20an%20urgent%20glass%20sizing%20question"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#5433eb] text-xs font-bold hover:bg-neutral-100 transition-colors"
              >
                Open WhatsApp Chat &rarr;
              </a>
            </div>
          </div>

          {/* Form Card (2 cols, #ffffff, rounded-[28px], dual-layer soft elevation, border-0) */}
          <div className="lg:col-span-2 bg-white rounded-[28px] p-8 sm:p-10 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] border-0">
            <div className="border-b border-[#ebebeb] pb-5 mb-6">
              <h2 className="text-xl font-bold text-[#000000]">Request a Custom Fabrication Quote</h2>
              <p className="text-xs text-[#787574] mt-1">
                Fill in your project requirements and dimensions below.
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
