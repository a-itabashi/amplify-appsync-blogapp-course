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
import { DeleteButton } from "@/components/posts/buttons/DeleteButton";
// import { withAuthenticator } from "@aws-amplify/ui-react";
// import { deletePost as deletePostMutation } from "@/graphql/mutations";

export const revalidate = 60;

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

  // 通常onClickはClient Componentでしか使用できない。
  // const handleDeletePost = async (id) => {
  // const handleDeletePost = async (data: FormData) => {
  //   "use server";
  //   // const itemId = data.get("itemId") as string;
  //   const id = data.get("postId");
  //   if (typeof id !== "string") {
  //     return;
  //   }

  //   await serverClient.graphql({
  //     query: deletePostMutation,
  //     variables: {
  //       input: {
  //         id,
  //       },
  //     },
  //     authMode: "userPool",
  //   });
  // };

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-wide mb-5">My Post</h1>
      {posts.map((post) => (
        <div
          key={post.id}
          className="py-8 px-8 max-w-xxl mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-1 sm:flex
        sm:items-center sm:space-y-0 sm:space-x-6 mb-2"
        >
          {/* {post.coverImage && (
            <img
              className="w-36 h-36 bg-contain bg-center rounded-full sm:mx-0 sm:shrink-0"
              src={post.coverImage}
            />
          )} */}
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
                <Link href={`/edit-post/${post.id}`}>Edit Post</Link>
              </p>

              <p
                className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200
  hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none
  focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              >
                <Link href={`/posts/${post.id}`}>View Post</Link>
              </p>
              {/* <form action={handleDeletePost}>
                <input
                  name="postId"
                  className="hidden"
                  value={post.id}
                  readOnly
                />
                <button className="text-sm mr-4 text-red-500" type="submit">
                  Delete Post
                </button>
              </form> */}
              <DeleteButton id={post.id} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
