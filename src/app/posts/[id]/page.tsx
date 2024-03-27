// "use client";
import { generateClient } from "aws-amplify/api";
import "@aws-amplify/ui-react/styles.css";
import { notFound, useRouter } from "next/navigation";
import { getPost } from "@/graphql/queries";
import { withAuthenticator } from "@aws-amplify/ui-react";

type Props = {
  params: {
    id: string;
  };
};

async function Post({ params }: Props) {
  const client = generateClient();
  const router = useRouter();

  const { id } = params;
  const postData = await client.graphql({
    query: getPost,
    variables: { id },
  });

  const post = postData.data.getPost;

  if (!post) {
    return notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide">Profile</h1>
      {post.title}
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

export default withAuthenticator(Post);
