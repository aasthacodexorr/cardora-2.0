import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getFeaturedImage,
  getComments,
  getPostAuthor,
  getPostBySlug,
  getPostCategories,
  normalizeWordPressContent,
  stripHtml,
} from "@/lib/wordpress";
import { ArrowLeft } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "long" }).format(new Date(date));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };

  const title = stripHtml(post.title.rendered);
  const description = stripHtml(post.excerpt.rendered) || `Read ${title} from Cardora.`;
  const image = getFeaturedImage(post);
  const canonicalUrl = `https://www.cardora.ca/blogs/${post.slug}`;

  return {
    title,
    description,
    metadataBase: new URL("https://www.cardora.ca"),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: image ? [{ url: image.source_url, alt: image.alt_text || title }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const image = getFeaturedImage(post);
  const categories = getPostCategories(post);
  const title = stripHtml(post?.title?.rendered);
  const description = stripHtml(post?.excerpt?.rendered) || `Read ${title} from Cardora.`;
  const author = getPostAuthor(post);
  const comments = await getComments(post?.id);
  const canonicalUrl = `https://www.cardora.ca/blogs/${post?.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    ...(image ? { image: [image.source_url] } : {}),
    datePublished: post?.date,
    dateModified: post?.modified,
    author: { "@type": "Person", name: author },
    publisher: { "@type": "Organization", name: "Cardora", url: "https://www.cardora.ca" },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  return (
    <main className="min-h-screen bg-white pb-20 pt-16 lg:pt-44">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-12">
        <article>
          <Link href="/blogs" className="text-lg text-brand-green hover:underline flex items-center gap-1"><ArrowLeft />  Back to blogs</Link>
          <header className="mt-2 border-b border-border-light pb-8">
            <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight text-neutral-charcoal sm:text-4xl">{title}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-medium-gray">
              <span className="text-gray-500 text-lg">by {author}</span><span>|</span><span className="text-brand-green text-lg">{formatDate(post.date)}</span><span>|</span>
              <span className="text-gray-500 text-lg">{categories.map((category) => category.name).join(", ") || "Uncategorized"}</span><span>|</span><span className="text-brand-green text-lg">{comments.length} comments</span>
            </div>
          </header>
          {image && (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-neutral-light-gray">
              <Image
                src={image.source_url}
                alt={image.alt_text || title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          )}
          <div
            className="wp-content mt-10 max-w-none text-lg leading-8 text-neutral-medium-dark-gray [&_a]:font-bold [&_a]:text-brand-green [&_a]:underline [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-green [&_blockquote]:pl-6 [&_blockquote]:italic [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-neutral-charcoal [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:leading-tight [&_h3]:text-neutral-charcoal [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_li]:ml-6 [&_li]:list-disc [&_ol]:my-5 [&_p]:my-5 [&_strong]:font-bold [&_table]:my-8 [&_table]:w-full [&_td]:border [&_td]:border-border-light [&_td]:p-3 [&_th]:border [&_th]:border-border-light [&_th]:bg-neutral-off-white [&_th]:p-3 [&_ul]:my-5"
            dangerouslySetInnerHTML={{ __html: normalizeWordPressContent(post.content.rendered) }}
          />
        </article>
        <aside className="lg:pt-9">
          <h2 className="text-3xl font-normal text-neutral-charcoal">Recent Comments</h2>
          {comments.length === 0 ? (
            <p className="mt-4 text-base text-neutral-medium-dark-gray">No comments to show.</p>
          ) : (
            <ul className="mt-5 space-y-5">
              {comments.map((comment) => (
                <li key={comment.id} className="border-b border-border-light pb-4">
                  <p className="text-sm font-bold text-neutral-charcoal">{comment.author_name}</p>
                  <div className="mt-1 text-sm leading-6 text-neutral-medium-dark-gray" dangerouslySetInnerHTML={{ __html: normalizeWordPressContent(comment.content.rendered) }} />
                  <time className="mt-2 block text-xs text-neutral-medium-gray" dateTime={comment.date}>{formatDate(comment.date)}</time>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}