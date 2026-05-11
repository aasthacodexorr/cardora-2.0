import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import google from "../assets/google.png";
import google_review from "../assets/Goolge-Review-Logo.jpg";

type Review = {
  initial: string;
  name: string;
  text: string;
};
const reviews: Review[] = [
  {
    initial: "J",
    name: "It's Jerry",
    text: "So, I recently bought a 2021 Jetta High line from Cardora, and I can confidently say the experience was nothing short of amazing—thanks to Sam! From the very beginning, Sam went above and beyond to make sure everything went smoothly. I encountered a few issues during the deal, but he personally stepped in and resolved everything with professionalism and genuine care.",
  },
  {
    initial: "S",
    name: "Shimul Rajput",
    text: "Just bought my first car and Sam was amazing! He was so supportive, quick to respond, and made the whole process feel easy and stress-free. Couldn't have asked for a better experience! Highly recommended! ✨",
  },
  {
    initial: "K",
    name: "Katie McWade",
    text: "My husband and I recently went through Sam for the purchase of our new family vehicle. He worked very hard for us for the best rate possible and turned what had been a stressful and frustrating process, into something absolutely seamless and enjoyable. He was absolutely wonderful to work with and we are incredibly happy with our newly purchased vehicle. Thank you so much Sam for your fantastic service and a great experience!",
  },
];

const GoogleG = () => (
  <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.4 0 10.3-2.1 14-5.4l-6.5-5.5C29.5 34.6 26.9 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.5 5.5C41.9 35.5 44 30 44 24c0-1.3-.1-2.3-.4-3.5z"
    />
  </svg>
);

const Reviews = () => {
  return (
    // added class reviews_section 
    <section className="w-full bg-review-bg reviews_section">
      <div className="mx-auto max-w-[1400px] px-6 py-14">
        <h2 className="text-[34px] lg:text-[44px] font-extrabold text-foreground tracking-tight text-center mb-8">
          People love buying with Cardora
        </h2>

        {/* Top Google bar */}
        <div className="flex justify-center">
          {/* added class reviews_google_bar  */}
          <div className="inline-flex items-center gap-4 rounded-xl bg-card px-5 py-3 shadow-sm border border-border reviews_google_bar">
            <Image src={google} alt="Google" className="h-5 w-5" />
            {/* <GoogleG /> */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-star text-star" />
              ))}
            </div>
            <span className="text-[15px] font-medium text-foreground">
              5.0 (33)
            </span>
            <a
              href="#"
              className="text-[15px] underline text-foreground hover:opacity-80"
            >
              View all
            </a>
          </div>
        </div>

        {/* Cards */}
        <div className="relative mt-8 ">
          <button
            aria-label="Previous"
            className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-card border border-border shadow-md items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <article
                key={r.name}
                className="rounded-2xl bg-card p-6 shadow-sm flex flex-col"
              >
                <div className="flex items-center gap-4">
                  {/* added class round_pill_reviews  */}
                  <div className="h-12 w-12 round_pill_reviews rounded-full bg-review-avatar flex items-center justify-center text-dark-section-foreground font-bold text-lg">
                    {r.initial}
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-review-name">
                      {r.name}
                    </h3>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-star text-star" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-5 text-[15px] text-foreground/80 leading-relaxed flex-1">
                  {r.text}
                </p>
                <div className="flex items-center gap-2 mt-6 pt-2 google_review_logo">
                  {/* <GoogleG /> */}
                  <Image src={google_review} alt="Google" className="h-5 w-5" />
                  <span className="text-[15px] text-foreground/80">
                    Google Review
                  </span>
                </div>
              </article>
            ))}
          </div>
          <button
            aria-label="Next"
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-card border border-border shadow-md items-center justify-center"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
