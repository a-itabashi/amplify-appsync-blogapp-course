"use client";
import {
  createComment,
  deletePost as deletePostMutation,
} from "@/graphql/mutations";
import { generateClient } from "aws-amplify/api";
import { useRouter } from "next/navigation";
import { Key, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "@/store/authState";
import dynamic from "next/dynamic";
import { v4 as uuid } from "uuid";
import { Post } from "@/API";
import { initialize } from "next/dist/server/lib/render-server";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
import "easymde/dist/easymde.min.css";
import { onCreateComment } from "@/graphql/subscriptions";
import { Subscription } from "rxjs";

type Props = {
  post: any;
};

const Comments = ({ post }: Props) => {
  const intialState = { id: "", message: "", postID: "" };
  const [comment, setComment] = useState(intialState);
  const [showMe, setShowMe] = useState(false);
  const isAuthenticated = useRecoilValue(authState);
  const { message } = comment;
  const client = generateClient();
  const router = useRouter();
  const [comments, setComments] = useState(post.comments.items);

  const handleToggle = () => {
    setShowMe(!showMe);
  };

  const createTheComment = async () => {
    if (!message) {
      return;
    }

    const id = uuid();
    comment.id = id;
    console.log(comment);
    try {
      await client.graphql({
        query: createComment,
        variables: { input: comment },
        authMode: "userPool",
      });
      router.refresh();
      setComment(intialState);
    } catch (error) {
      console.log(error);
    }
  };

  let subOncreate: Subscription;

  // setCommentの修正が必要
  function setUpSubscriptions() {
    subOncreate = client.graphql({ query: onCreateComment }).subscribe({
      next: (commentData) => {
        console.log(commentData);
        const newComment = commentData.data.onCreateComment.message;
        setComments((prevComments: string[]) => [...prevComments, newComment]);
      },
    });
  }

  useEffect(() => {
    setUpSubscriptions();
    return () => {
      subOncreate.unsubscribe();
    };
  }, []);

  return (
    <>
      {comments.length > 0 &&
        comments.map((comment: any, index: Key) => (
          <div
            key={index}
            className="py-8 px-8 max-w-xl bg-white rounded-xl
                    shadow-lg space-y-2 sm:py-1 sm:flex
                    my-6
                    mx-12
                    sm:items-center sm:space-y-0 sm:space-x-6 mb-2"
          >
            <div>
              <p className="text-gray-500 mt-2">{comment?.message}</p>
              <p className="text-gray-200 mt-1">{comment?.createdBy}</p>
              <p className="text-gray-500 mt-1">{comment?.createdAt}</p>
            </div>
          </div>
        ))}
      {isAuthenticated && (
        <button
          type="button"
          className="mb-4 bg-green-600
    text-white font-semibold px-8 py-2 rounded-lg"
          onClick={handleToggle}
        >
          Write a Comment
        </button>
      )}
      {
        <div style={{ display: showMe ? "block" : "none" }}>
          <SimpleMDE
            value={comment.message}
            onChange={(value) =>
              setComment({ ...comment, message: value, postID: post.id })
            }
          />
          <button
            onClick={createTheComment}
            type="button"
            className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      }
    </>
  );
};

export { Comments };
