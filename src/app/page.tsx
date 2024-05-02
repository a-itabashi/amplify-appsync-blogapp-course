import { useState, useEffect, useCallback } from "react";
// APIはもう使われない
// import { API } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { listPosts } from "@/graphql/queries";
import { Post } from "@/API";
import { serverClient } from "@/utils/serverUtils";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { runWithAmplifyServerContext } from "@/utils/amplifyServerUtils";
import { cookies } from "next/headers";
import { getUrl } from "aws-amplify/storage/server";
import { DeleteButton } from "@/components/posts/buttons/DeleteButton";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function Home() {
  // const client = generateClient();
  // const [posts, setPosts] = useState<Post[]>([]);

  // // // useCallbackフックを使用して関数をメモ化することができます。
  // // // これにより、fetchPostsが依存している値が変更されない限り、同じ関数の参照が保持され続けます。
  // const fetchPosts = useCallback(async () => {
  //   const postData = await client.graphql({
  //     query: listPosts,
  //   });
  //   setPosts(postData.data.listPosts.items);
  // }, [client]); // useCallback の依存配列に fetchPosts が依存する外部の値を含める

  // useEffect(() => {
  //   fetchPosts();
  // }, [fetchPosts]);

  const fetchPosts = async () => {
    const postData = await serverClient.graphql({
      query: listPosts,
    });

    const { items } = postData.data.listPosts;

    const postsWithImages = await Promise.all(
      items.map(async (post) => {
        if (post.coverImage) {
          const result = await runWithAmplifyServerContext({
            nextServerContext: { cookies },
            operation: (contextSpec: any) =>
              getUrl(contextSpec, {
                key: post.coverImage ?? "",
              }),
          });
          post.coverImage = result.url.toString();
        }
        return post;
      })
    );

    return postsWithImages;
  };

  const posts = await fetchPosts();

  if (!posts) {
    return notFound();
  }

  // const postData = await serverClient.graphql({
  //   query: listPosts,
  // });

  // const posts: Post[] = postData.data.listPosts.items;
  // if (!posts) {
  //   return notFound();
  // }

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-wide mb-5">Home Post</h1>
      {posts.map((post) => (
        <div
          key={post.id}
          className="py-8 px-8 max-w-xxl mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-1 sm:flex
        sm:items-center sm:space-y-0 sm:space-x-6 mb-2"
        >
          {post.coverImage && (
            <Image
              className="w-36 h-36 bg-contain bg-center rounded-full sm:mx-0 sm:shrink-0"
              src={post.coverImage}
              alt={post?.coverImage ?? ""}
              width={500}
              height={500}
            />
          )}
          <div className="text-center space-y-2 sm:text-left">
            <div className="space-y-0.5">
              <p className="text-lg text-black font-semibold">{post.title}</p>
              <p className="text-slate-500 font-medium">
                {/* Created on: {Moment(post.createdAt).format("ddd, MMM hh:mm a")} */}
              </p>
            </div>
            <div
              className="sm:py-4 sm:flex
      sm:items-center sm:space-y-0 sm:space-x-1"
            >
              <p
                className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200
  hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none
  focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              >
                <Link href={`/posts/${post.id}`}>View Post</Link>
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
