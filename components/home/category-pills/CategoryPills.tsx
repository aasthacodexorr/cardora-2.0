/* =========================
   CategoryPills Component (Home)
   Horizontal scrollable pill row on the homepage.
   Each pill links to the inventory page pre-filtered
   by a specific category (EVs, Sedans, SUVs, etc.).
   Uses FontAwesome icons for visual cues.
========================= */

import CategoryPill from "./CategoryPill";
import { getCategories, CONTAINER_CLASS } from "./constants"
import { useAppConfig } from "@/app/providers";

const CategoryPills = () => {
  const appConfig = useAppConfig();
  const categories = getCategories(appConfig);
  return (
    <section className="w-full bg-background">
      <div className={CONTAINER_CLASS}>
        {categories.map(({ label, icon, href }) => (
          <CategoryPill
            key={label}
            label={label}
            icon={icon}
            href={href}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryPills;
