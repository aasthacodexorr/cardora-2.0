import { Phone, Mail, MessageCircle, MessageSquare } from "lucide-react";
import { useState } from "react";

const contactCards = [
  { title: "Call us", subtitle: "Call Us Anytime Now", icon: Phone },
  { title: "WhatsApp", subtitle: "Chat on WhatsApp", icon: MessageCircle },
  { title: "Email", subtitle: "Send Us an Email", icon: Mail },
  { title: "Text", subtitle: "Text Us Right Now", icon: MessageSquare },
];

const GetInTouch = () => {
  const [tab, setTab] = useState<"Sales" | "Service">("Sales");

  return (
    <section className="w-full bg-dark-section text-dark-section-foreground get_toch">
      <div className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
          {/* Left: hours */}
          <div>
            <h2 className="text-[28px] lg:text-[34px] font-extrabold leading-tight">
              Get in touch with us, we're here to help
            </h2>

            <div className="mt-8 rounded-xl border border-dark-border bg-dark-card p-6">
              <div className="flex gap-2">
                {(["Sales", "Service"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-5 py-2 rounded-md text-[15px] font-semibold transition-colors ${
                      tab === t
                        ? "bg-dark-section text-brand-green"
                        : "text-dark-section-foreground/80 hover:text-dark-section-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="mt-5 space-y-3 text-[15px]">
                <div className="flex justify-between">
                  <span className="text-dark-section-foreground/70">Mon-Fri:</span>
                  <span>10:00 AM to 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-section-foreground/70">Saturday:</span>
                  <span>10:00 AM to 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-section-foreground/70">Sunday:</span>
                  <span>12:00 PM to 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: contact cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {contactCards.map(({ title, subtitle, icon: Icon }) => (
              <a
                key={title}
                href="#"
                className="rounded-xl border border-dark-border bg-dark-card p-6 flex items-center justify-between hover:border-brand-green transition-colors"
              >
                <div>
                  <h3 className="text-[20px] font-bold">{title}</h3>
                  <p className="text-[14px] text-dark-section-foreground/70 mt-1">{subtitle}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-brand-green flex items-center justify-center">
                  <Icon className="h-6 w-6 text-brand-green-foreground" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
