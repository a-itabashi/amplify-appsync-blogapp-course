"use client";
import { withAuthenticator, Button } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/api";
import {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { GetPostQuery, Post } from "@/API";
import { getUrl, uploadData } from "aws-amplify/storage";
import Image from "next/image";
import { remove } from "aws-amplify/storage";
// import "@aws-amplify/ui-react/styles.css";

type paramsType = {
  id: string;
};

function EditPost() {
  //   const [post, setPost] = useState({ id: "", title: "", content: "" });
  const [post, setPost] = useState<Post | null | undefined>(null);
  const [coverImage, setCoverImage] = useState("");
  const [localImage, setLocalImage] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  // const { title, content } = post;
  const router = useRouter();
  const client = useMemo(() => generateClient(), []);
  const params: paramsType = useParams();
  const { id } = params;

  const updateCoverImage = async (coverImage: string) => {
    // const imageKey = await Storage.get(coverImage);
    const result = await getUrl({
      key: coverImage,
      options: {
        validateObjectExistence: true,
      },
    });
    coverImage = result.url.href;
    setCoverImage(coverImage);
  };

  const fetchPost = useCallback(async () => {
    const postData = await client.graphql({
      query: getPost,
      variables: { id },
      authMode: "userPool",
    });
    const post = postData.data.getPost;
    setPost(post);

    const coverImage = post?.coverImage;
    if (!coverImage) {
      return;
    }

    updateCoverImage(coverImage);
  }, [id, client]);

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
    const inputVariables = { id, content, title, coverImage };
    // if (coverImage && localImage) {
    //   // 既存の画像を削除
    //   if (post.coverImage) {
    //     await remove({ key: post.coverImage });
    //   }

    //   // 新規画像をアップロード
    //   const fileName = `${localImage.name}_${id}`;
    //   inputVariables.coverImage = fileName;
    //   // await Storage.put(fileName, localImage);
    //   uploadData({ key: fileName, data: localImage });
    // } else if (!coverImage && localImage) {
    //   // 新規画像をアップロード
    //   const fileName = `${localImage.name}_${id}`;
    //   inputVariables.coverImage = fileName;
    //   // await Storage.put(fileName, localImage);
    //   uploadData({ key: fileName, data: localImage });
    // }

    if (coverImage && localImage) {
      // 既存の画像を削除
      if (post.coverImage) {
        await remove({ key: post.coverImage });
      }
    }

    if (localImage) {
      // 新規画像をアップロード
      const fileName = `${localImage.name}_${id}`;
      inputVariables.coverImage = fileName;
      // await Storage.put(fileName, localImage);
      uploadData({ key: fileName, data: localImage });
    }

    if (!localImage && coverImage && post.coverImage) {
      inputVariables.coverImage = post.coverImage;
    }

    const updatedPost = await client.graphql({
      query: updatePost,
      variables: { input: inputVariables },
      authMode: "userPool",
    });

    router.push("/posts");
    // router.push(`/posts/${updatedPost.data.updatePost.id}`);
    router.refresh();
  };

  const handleChange = (event: { target: { files: FileList | null } }) => {
    const fileUpload = event.target.files ? event.target.files[0] : null;

    if (!fileUpload) return;
    // setCoverImage(fileUpload);
    // setLocalImage(URL.createObjectURL(fileUpload));
    setLocalImage(fileUpload);
  };

  const uploadImage = async () => {
    if (!fileInput.current) {
      return;
    }

    fileInput.current.click();
  };

  if (!post) {
    return;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Edit Post</h1>
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
          ref={fileInput}
          className="absolute w-0 h-0"
          onChange={handleChange}
        />
        <Button variation="primary" onClick={uploadImage}>
          Upload Cover Image
        </Button>
      </div>

      {(localImage || coverImage) && (
        <Image
          src={localImage ? URL.createObjectURL(localImage) : coverImage}
          alt=""
          className="mb-2"
          width={500}
          height={500}
        />
      )}
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
