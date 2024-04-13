import { useState, useEffect, useCallback } from "react";
// APIはもう使われない
// import { API } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { listPosts } from "@/graphql/queries";
import { Post } from "@/API";
import { serverClient } from "@/utils/serverUtils";
import { notFound } from "next/navigation";
import Link from "next/link";

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

  const postData = await serverClient.graphql({
    query: listPosts,
  });
  const posts = postData.data.listPosts.items;
  if (!posts) {
    return notFound();
  }

  return (
    <>
      <h1 className="text-xl font-semibold">Home Post</h1>
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`}>
          <div className="border-b border-gray-300 mt-8 pb-4">
            <h2>{post.title}</h2>
            <p className="text-gray-500 mt-2">Author: {post.username}</p>
          </div>
        </Link>
      ))}
    </>
  );
}
