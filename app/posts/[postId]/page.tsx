import { getPostData, getSortedPosts } from "@/lib/posts";
import { notFound } from "next/navigation";

import getFormattedDate from "@/lib/getFormattedDate";
import Link from "next/link";

export const generateStaticParams = () => {
  const posts = getSortedPosts();

  return posts.map((post) => ({
    postId: post.id,
  }));
};

export const generateMetadata = ({
  params,
}: {
  params: { postId: string };
}) => {
  const posts = getSortedPosts(); // deduped!
  const { postId } = params;

  const post = posts.find((post) => post.id === postId);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post?.title,
  };
};

const Post = async ({ params }: { params: { postId: string } }) => {
  const posts = getSortedPosts(); // deduped!
  const { postId } = params;

  if (!posts.find((post) => post.id === postId)) notFound();

  const { title, date, contentHtml } = await getPostData(postId);
  const pubDate = getFormattedDate(date);

  return (
    <main className="px-6 prose prose-xl prose-slate dark:prose-invert mx-auto">
      <h1 className="text-3xl mt-4 mb-0">{title}</h1>
      <p className="mt-0">{pubDate}</p>
      <article>
        <section dangerouslySetInnerHTML={{ __html: contentHtml }} />
        <p>
          <Link href="/">Back to Home</Link>
        </p>
      </article>
    </main>
  );
};

export default Post;
