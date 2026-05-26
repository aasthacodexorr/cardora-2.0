/* =========================
   CategoryPills Component (Home)
   Horizontal scrollable pill row on the homepage.
   Each pill links to the inventory page pre-filtered
   by a specific category (EVs, Sedans, SUVs, etc.).
   Uses FontAwesome icons for visual cues.
========================= */

import CategoryPill from "./CategoryPill";
import { CATEGORIES, CONTAINER_CLASS } from "./constants";

const CategoryPills = () => {
  return (
    <section className="w-full bg-background">
      <div className={CONTAINER_CLASS}>
        {CATEGORIES.map(({ label, icon, queryParams }) => (
          <CategoryPill
            key={label}
            label={label}
            icon={icon}
            href={`/inventory${queryParams ? `?${queryParams}` : ""}`}
          />
        ))}
      </div>
    </section>
  );
};

export default CategoryPills;
