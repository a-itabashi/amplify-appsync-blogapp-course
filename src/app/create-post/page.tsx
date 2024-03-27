"use client";
import { withAuthenticator, Button } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { useState } from "react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
// import { v4 as uuid } from "uuid";
import { createPost } from "@/graphql/mutations";
import SimpleMDE from "react-simplemde-editor";
// import dynamic from "next/dynamic";
// const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
//   ssr: false,
// });

import "easymde/dist/easymde.min.css";
// import "@aws-amplify/ui-react/styles.css";

function CreatePost() {
  //   const [post, setPost] = useState({ id: "", title: "", content: "" });
  const [post, setPost] = useState({ title: "", content: "" });
  const { title, content } = post;
  const router = useRouter();
  const client = generateClient();

  const handleOnChange = (event: {
    target: { name: string; value: string };
  }) => {
    setPost(() => ({
      ...post,
      [event.target.name]: event.target.value,
    }));
  };

  const createNewPost = async () => {
    if (!title || !content) {
      return;
    }
    // const id = uuid();
    // post.id = id;

    const createdPost = await client.graphql({
      query: createPost,
      variables: { input: post },
      authMode: "userPool",
    });
    router.push(`/posts/${createdPost.data.createPost.id}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">
        Create new Post
      </h1>
      <input
        onChange={handleOnChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="border-b p-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500"
      />
      <SimpleMDE
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />
      <Button variation="primary" onClick={createNewPost}>
        Create Post
      </Button>
    </div>
  );
}

export default withAuthenticator(CreatePost);
