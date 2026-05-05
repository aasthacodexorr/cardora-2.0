import { MapPin } from "lucide-react";

const columns = [
  {
    title: "Popular Makes",
    links: ["Used Toyota", "Used Hyundai", "Used BMW", "Used Honda", "Used Mercedes", "Used Ford", "Used Dodge", "Used Volkswagen"],
  },
  {
    title: "Popular Car Types",
    links: ["Used SUVs", "Used Vans", "Used Hatchbacks", "Used Sedans", "Used Coupes", "Used Convertibles", "Used Pick-up"],
  },
  {
    title: "About Us",
    links: ["Home", "Find Your Car", "Sell or Trade In", "Car Finance", "Payment Calculator", "Skip the Dealership", "About Us", "Contact Us"],
  },
  {
    title: "Follow Us",
    links: ["Facebook", "Instagram", "TikTok", "YouTube"],
  },
];

const Footer = () => {
  return (
    <footer className="w-full bg-dark-section text-dark-section-foreground border-t border-dark-border">
      <div className="mx-auto max-w-[1400px] px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[14px] font-bold tracking-widest uppercase mb-5">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-[15px] uppercase text-dark-section-foreground/85 hover:text-brand-green transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-[14px] font-bold tracking-widest uppercase mb-5">Contact Us</h3>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-dark-section-foreground/85 shrink-0 mt-0.5" />
              <address className="not-italic text-[15px] leading-relaxed text-dark-section-foreground/85">
                8050 Dixie Rd,<br />
                Brampton, ON<br />
                L6T 4W6
              </address>
            </div>
          </div>
        </div>

        <div className="copyright_sec mt-12 pt-6 border-t border-dark-border flex flex-col md:flex-row gap-4 justify-between text-[14px] text-dark-section-foreground/70">
          <p>© 2026 Cardora Motor Group. All rights reserved.</p>
          <p>
            <a href="#" className="hover:text-dark-section-foreground">Privacy Policy</a>
            {" | "}
            <a href="#" className="hover:text-dark-section-foreground">Terms &amp; Conditions</a>
            {" | "}
            <a href="#" className="hover:text-dark-section-foreground">Site Map</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
