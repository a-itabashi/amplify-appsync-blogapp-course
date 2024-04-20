"use client";
import { withAuthenticator, Button } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import { useCallback, useEffect, useState } from "react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter, useParams, notFound } from "next/navigation";
import { updatePost } from "@/graphql/mutations";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import { getPost } from "@/graphql/queries";
import { serialize } from "v8";
import { Post } from "@/API";
// import "@aws-amplify/ui-react/styles.css";

type paramsType = {
  id: string;
};

function EditPost() {
  //   const [post, setPost] = useState({ id: "", title: "", content: "" });
  const [post, setPost] = useState<Post | null | undefined>(null);
  // const { title, content } = post;
  const router = useRouter();
  const client = generateClient();
  const params: paramsType = useParams();
  const { id } = params;

  const fetchPost = useCallback(async () => {
    const postData = await client.graphql({
      query: getPost,
      variables: { id },
      authMode: "userPool",
    });
    const post = postData.data.getPost;
    setPost(post);
  }, [client, id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (!id) {
    return notFound();
  }

  const handleOnChange = (event: {
    target: { name: string; value: string };
  }) => {
    if (!post) {
      return;
    }

    setPost((prevPost) => {
      if (prevPost == null) {
        // prevPostがnullまたはundefinedの場合、適切なデフォルト値を返す
        return null;
      }
      // 安全にスプレッド演算子を使用してprevPostを更新
      return {
        ...prevPost,
        [event.target.name]: event.target.value,
      };
    });

    // setPost(() => ({
    //   ...post,
    //   // event.target.name: event.target.value としていますが、
    //   // ここで event.target.name は変数（実際にはイベントオブジェクトのプロパティですが）です。
    //   // そのため、これをオブジェクトリテラルのプロパティ名としてそのまま使用することはできません。
    //   // 正しくは、この変数名をブラケット [ ] で囲む必要があります。
    //   [event.target.name]: event.target.value,
    // }));
  };

  const updateCurrentPost = async () => {
    if (!post) {
      return;
    }

    const { id, content, title } = post;
    const inputVariables = { id, content, title };
    const updatedPost = await client.graphql({
      query: updatePost,
      variables: { input: inputVariables },
      authMode: "userPool",
    });

    router.push("/posts");
    // router.push(`/posts/${updatedPost.data.updatePost.id}`);
    router.refresh();
  };

  if (!post) {
    return;
  }

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
        // onChange={(value) => setPost({ ...post, content: value })}
        onChange={(value) =>
          setPost((prevPost) => {
            if (prevPost == null) {
              // prevPostがnullまたはundefinedの場合、適切なデフォルト値を返す
              return null;
            }
            // 安全にスプレッド演算子を使用してprevPostを更新
            return {
              ...prevPost,
              content: value,
            };
          })
        }
      />
      <Button variation="primary" onClick={updateCurrentPost}>
        update Post
      </Button>
    </div>
  );
}

export default withAuthenticator(EditPost);
