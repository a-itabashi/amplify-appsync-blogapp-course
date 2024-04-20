"use client";
import { withAuthenticator, Button } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { useRef, useState } from "react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";
import { createPost } from "@/graphql/mutations";
import { uploadData } from "aws-amplify/storage";
import Image from "next/image";
// import SimpleMDE from "react-simplemde-editor";
// import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
// import "@aws-amplify/ui-react/styles.css";

type ImageType = {
  name: string;
};

function CreatePost() {
  const [post, setPost] = useState({
    id: "",
    title: "",
    content: "",
    coverImage: "",
  });
  // const [post, setPost] = useState({ title: "", content: "" });
  const [image, setImage] = useState<File | null>(null);
  const imageFileInput = useRef<HTMLInputElement>(null);
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

  const handleUploadImage = async () => {
    if (!imageFileInput.current) {
      return;
    }

    imageFileInput.current.click();
  };

  const handleChangeFileUpload = (event: {
    target: { files: FileList | null };
  }) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) {
      return;
    }
    setImage(file);
  };

  const createNewPost = async () => {
    if (!title || !content) {
      return;
    }
    const id = uuid();
    post.id = id;

    if (image) {
      const filename = `${image.name}_${id}`;
      post.coverImage = filename;
      // uploadData({ key: filename, data: image });

      const uploadTask = uploadData({ key: filename, data: image });
      // * //...
      // * uploadTask.pause();
      // * //...
      // * uploadTask.resume();
      // * //...
      await uploadTask.result;
    }

    const createdPost = await client.graphql({
      query: createPost,
      variables: { input: post },
      authMode: "userPool",
    });
    router.push(`/posts/${createdPost.data.createPost.id}`);
    router.refresh();
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

      <div className="mb-2">
        <input
          type="file"
          ref={imageFileInput}
          className="absolute w-0 h-0"
          onChange={handleChangeFileUpload}
        />
        <Button variation="primary" onClick={handleUploadImage}>
          Upload Cover Image
        </Button>
      </div>

      {/* {image && <img src={URL.createObjectURL(image)} className="mb-2" />} */}
      {image && (
        <Image
          src={URL.createObjectURL(image)}
          alt=""
          className="mb-2"
          width={500}
          height={500}
        />
      )}

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
