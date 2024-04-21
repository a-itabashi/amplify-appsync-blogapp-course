// "use client";
// import { generateClient } from "aws-amplify/api";
import { serverClient } from "@/utils/serverUtils";
import "@aws-amplify/ui-react/styles.css";
import { notFound } from "next/navigation";
import { getPost } from "@/graphql/queries";
import ReactMarkdown from "react-markdown";
// import { withAuthenticator } from "@aws-amplify/ui-react";
import { getProperties } from "aws-amplify/storage";
import { getUrl } from "aws-amplify/storage/server";
import { runWithAmplifyServerContext } from "@/utils/amplifyServerUtils";
import { cookies } from "next/headers";
import Image from "next/image";

type Props = {
  params: {
    id: string;
  };
};

export const revalidate = 60;

export default async function Post({ params }: Props) {
  const { id } = params;

  const postData = await serverClient.graphql({
    query: getPost,
    variables: { id },
  });

  const post = postData.data.getPost;

  let coverImage = null;
  if (post?.coverImage) {
    // coverImage = await getProperties({ key: post?.coverImage });
    // coverImage = await getUrl({
    //   key: post?.coverImage,
    //   options: {
    //     validateObjectExistence: true, // defaults to false
    //   },
    // });

    // 参考URL: https://docs.amplify.aws/javascript/build-a-backend/server-side-rendering/nextjs/
    const result = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec: any) =>
        getUrl(contextSpec, {
          key: post.coverImage ?? "",
        }),
    });
    coverImage = result.url.toString();
  }

  if (!post) {
    return notFound();
  }

  return (
    <div>
      <h2>{post.title}</h2>
      {coverImage && (
        <Image
          src={coverImage}
          alt={post?.coverImage ?? ""}
          width={500}
          height={500}
        />
      )}
      <p className="text-sm font-light my-4">By {post.username}</p>
      <div className="mt-8">
        <ReactMarkdown>{post.content}</ReactMarkdown>
        {/* <ReactMarkdown className="prose" children={post.content} /> */}
      </div>
    </div>
  );
}

// export async function generateStaticParams() {
//   const client = generateClient();
//   const postData = await client.graphql({
//     query: listPosts,
//   });
//   const paths = postData.data.listPosts.items.map((post) => {
//     params: {
//       id: post.id;
//     }
//   });
//   return {
//     paths,
//     fallback: true,
//   };
// }

// export async function getStaticPaths() {
//   const client = generateClient();
//   const postData = await client.graphql({
//     query: listPosts,
//   });
//   const paths = postData.data.listPosts.items.map((post) => {
//     params: {
//       id: post.id;
//     }
//   });
//   return {
//     paths,
//     fallback: true,
//   };
// }

// export async function getStaticProps({ params }: { params: Params }) {
//   const client = generateClient();
//   const { id } = params;
//   const postData = await client.graphql({
//     query: getPost,
//     variables: { id },
//   });
//   return {
//     props: {
//       post: postData.data.getPost,
//     },
//   };
// }

// export default withAuthenticator(Post);
