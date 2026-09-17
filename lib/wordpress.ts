import sanitizeHtml from "sanitize-html";

const WORDPRESS_API_URL = "https://blog.cardora.ca/wp-json/wp/v2";
export const WORDPRESS_SITE_URL = "https://blog.cardora.ca";

export interface WordPressRenderedField {
  rendered: string;
}

export interface WordPressMediaDetails {
  width: number;
  height: number;
}

export interface WordPressMedia {
  source_url: string;
  alt_text: string;
  media_details?: WordPressMediaDetails;
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WordPressAuthor {
  id: number;
  name: string;
  link?: string;
}

export interface WordPressPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  link: string;
  title: WordPressRenderedField;
  content: WordPressRenderedField;
  excerpt: WordPressRenderedField;
  author: number;
  featured_media: number;
  categories: number[];
  _embedded?: {
    author?: WordPressAuthor[];
    "wp:featuredmedia"?: WordPressMedia[];
    "wp:term"?: WordPressCategory[][];
  };
}

export interface WordPressPostsResult {
  posts: WordPressPost[];
  totalPages: number;
  totalPosts: number;
  error?: string;
}

async function wordpressFetch<T>(path: string): Promise<Response> {
  return fetch(`${WORDPRESS_API_URL}${path}`, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json" },
  });
}

export async function getPosts(page = 1, perPage = 9): Promise<WordPressPostsResult> {
  try {
    const response = await wordpressFetch(`/posts?page=${page}&per_page=${perPage}&_embed`);
    if (!response.ok) {
      return { posts: [], totalPages: 0, totalPosts: 0, error: "The blog service is unavailable." };
    }

    const posts = (await response.json()) as WordPressPost[];
    return {
      posts,
      totalPages: Number(response.headers.get("X-WP-TotalPages") ?? 1),
      totalPosts: Number(response.headers.get("X-WP-Total") ?? posts.length),
    };
  } catch {
    return { posts: [], totalPages: 0, totalPosts: 0, error: "The blog service is unavailable." };
  }
}

export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await wordpressFetch(`/posts?slug=${encodeURIComponent(slug)}&_embed`);
    if (!response.ok) return null;

    const posts = (await response.json()) as WordPressPost[];
    return posts[0] ?? null;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<WordPressCategory[]> {
  try {
    const response = await wordpressFetch("/categories?per_page=100");
    if (!response.ok) return [];
    return (await response.json()) as WordPressCategory[];
  } catch {
    return [];
  }
}

export function getFeaturedImage(post: WordPressPost): WordPressMedia | null {
  return post._embedded?.["wp:featuredmedia"]?.[0] ?? null;
}

export function getPostCategories(post: WordPressPost): WordPressCategory[] {
  return post._embedded?.["wp:term"]?.[0] ?? [];
}

export function getPostAuthor(post: WordPressPost): string {
  return post._embedded?.author?.[0]?.name ?? "Cardora";
}

export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").replace(/&hellip;/g, "...").trim();
}

export function normalizeWordPressContent(html: string): string {
  const safeHtml = sanitizeHtml(html, {
    allowedTags: [
      "a", "blockquote", "br", "caption", "code", "em", "figcaption", "figure",
      "h1", "h2", "h3", "h4", "h5", "h6", "hr", "img", "li", "ol", "p", "pre",
      "strong", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "ul", "iframe",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "srcset", "alt", "width", "height", "loading"],
      iframe: ["src", "title", "width", "height", "allow", "allowfullscreen", "loading", "referrerpolicy"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedIframeHostnames: ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com", "player.vimeo.com"],
  });

  return safeHtml.replace(
    /(<a\b[^>]*\bhref=["'])https?:\/\/blog\.cardora\.ca\/([^"']+)(["'][^>]*>)/gi,
    (match, prefix: string, path: string, suffix: string) => {
      const cleanPath = path.replace(/^\/+|\/+$/g, "");
      const isPostPath = cleanPath && !/^(category|author|tag|feed|wp-admin|wp-json)(\/|$)/i.test(cleanPath);
      return isPostPath ? `${prefix}/blogs/${cleanPath}${suffix}` : match;
    },
  );
}

export interface WordPressComment {
  id: number;
  date: string;
  author_name: string;
  content: WordPressRenderedField;
  link?: string;
}

export async function getComments(postId: number, perPage = 10): Promise<WordPressComment[]> {
  try {
    const response = await wordpressFetch(`/comments?post=${postId}&per_page=${perPage}`);
    if (!response.ok) return [];
    return (await response.json()) as WordPressComment[];
  } catch {
    return [];
  }
}