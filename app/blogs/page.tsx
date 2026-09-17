import Image from "next/image";
import Link from "next/link";
import {
  getFeaturedImage,
  getComments,
  getPosts,
  getPostAuthor,
  getPostCategories,
  stripHtml,
} from "@/lib/wordpress";

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

const POSTS_PER_PAGE = 9;

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "long",
  }).format(new Date(date));
}

export default async function BlogsPage({ searchParams }: BlogPageProps) {
  const { page: pageParam } = await searchParams;
  const requestedPage = Number.parseInt(pageParam ?? "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const result = await getPosts(page, POSTS_PER_PAGE);


  console.log("BlogsPage result:", result); // Log the result for debugging

  return (
    <main className="min-h-screen bg-white pb-20 pt-16 lg:pt-44">
      <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-brand-green">Cardora Journal</p>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-charcoal sm:text-5xl">Insights for the road ahead</h1>
          <p className="mt-2 text-lg leading-8 text-neutral-medium-dark-gray">Helpful perspectives on buying, financing, leasing, and enjoying your next vehicle.</p>
        </div>

        {result?.error ? (
          <div className="border border-border-light bg-neutral-off-white px-6 py-10 text-center text-neutral-medium-dark-gray">
            We could not load the latest articles right now. Please check back soon.
          </div>    
        ) : result?.posts?.length === 0 ? (
          <div className="border border-border-light bg-neutral-off-white px-6 py-10 text-center text-neutral-medium-dark-gray">
            No articles are available yet.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(await Promise.all(result?.posts?.map(async (post) => ({ post, comments: await getComments(post?.id, 1) })))).map(({ post, comments }) => {
              const image = getFeaturedImage(post);
              const categories = getPostCategories(post);
              return (
                <article key={post.id} className="flex flex-col overflow-hidden  rounded-xl border border-border-light bg-white shadow-sm transition-shadow hover:shadow-lg">
                  <Link href={`/blogs/${post.slug}`} className="relative block aspect-[16/9] bg-neutral-light-gray">
                    {image ? (
                      <Image
                        src={image.source_url}
                        alt={image.alt_text || stripHtml(post.title.rendered)}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-neutral-medium-gray">Cardora</div>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-2xl font-bold leading-tight text-neutral-charcoal">
                      <Link href={`/blogs/${post.slug}`} className="transition-colors hover:text-brand-green">
                        {stripHtml(post.title.rendered)}
                      </Link>
                    </h2>
                    <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-md text-neutral-medium-gray">
                      <span className="text-brand">{formatDate(post.date)}</span>
                      <span>|</span>
                      <span className="text-gray-500">{categories?.map((category) => category.name).join(", ") || "Uncategorized"}</span>
                    </div>
                    {/* <p className="mt-2 text-sm text-neutral-medium-gray">By {getPostAuthor(post)} <span className="mx-1">|</span> {comments.length} comments</p> */}
                    <p className="mt-4 line-clamp-4 text-base leading-7 text-neutral-medium-dark-gray">{stripHtml(post.excerpt.rendered) || "Read the latest from Cardora."}</p>
                    <Link href={`/blogs/${post.slug}`} className="mt-6 inline-flex font-semibold text-neutral-charcoal hover:text-brand-green">Read More</Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {result.totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-4" aria-label="Blog pagination">
            {page > 1 && <Link href={`/blogs?page=${page - 1}`} className="border border-border-light px-5 py-3 font-bold text-neutral-charcoal hover:border-brand-green hover:text-brand-green">Previous</Link>}
            <span className="text-sm text-neutral-medium-gray">Page {page} of {result.totalPages}</span>
            {page < result.totalPages && <Link href={`/blogs?page=${page + 1}`} className="border border-border-light px-5 py-3 font-bold text-neutral-charcoal hover:border-brand-green hover:text-brand-green">Next</Link>}
          </nav>
        )}
      </section>
    </main>
  );
}