"use client";
import { useState, useEffect, useCallback } from "react";
// APIはもう使われない
// import { API } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import { listPosts } from "@/graphql/queries";
import { Post } from "@/API";

export default function Home() {
  const client = generateClient();
  const [posts, setPosts] = useState<Post[]>([]);

  // // useCallbackフックを使用して関数をメモ化することができます。
  // // これにより、fetchPostsが依存している値が変更されない限り、同じ関数の参照が保持され続けます。
  const fetchPosts = useCallback(async () => {
    const postData = await client.graphql({
      query: listPosts,
    });
    setPosts(postData.data.listPosts.items);
  }, [client]); // useCallback の依存配列に fetchPosts が依存する外部の値を含める

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // const fetchPosts = async () => {
  //   const postData = await client.graphql({
  //     query: listPosts,
  //   });
  //   setPosts(postData.data.listPosts.items);
  // };

  // useEffect(() => {
  //   fetchPosts();
  // }, []);

  return (
    <div>
      {posts.map((post) => (
        <p key={post.id}>{post.title}</p>
      ))}
    </div>
  );
}
