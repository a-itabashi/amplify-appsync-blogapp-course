// "use client";
// import { generateClient } from "aws-amplify/api";
import { serverClient } from "@/utils/serverUtils";
import "@aws-amplify/ui-react/styles.css";
import { notFound } from "next/navigation";
import { getPost, postsByUsername } from "@/graphql/queries";
import ReactMarkdown from "react-markdown";
import { getCurrentUser } from "aws-amplify/auth";
import { GetServerSideProps } from "next/types";
import {
  AuthGetCurrentUserServer,
  runWithAmplifyServerContext,
  serverGraphQLClient,
} from "@/utils/amplifyServerUtils";
import Link from "next/link";
// import { withAuthenticator } from "@aws-amplify/ui-react";

type Props = {
  params: {
    id: string;
  };
};

// export const revalidate = 60;

export default async function Posts() {
  const user = await AuthGetCurrentUserServer();

  if (!user) {
    return notFound();
  }

  const username = `${user.userId}::${user.username}`;
  const postData = await serverClient.graphql({
    query: postsByUsername,
    variables: { username },
  });
  const posts = postData.data.postsByUsername.items;

  if (!posts) {
    return notFound();
  }

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-wide">My Post</h1>
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
