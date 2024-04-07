"use client";
import { deletePost as deletePostMutation } from "@/graphql/mutations";
import { generateClient } from "aws-amplify/api";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
};

const DeleteButton = ({ id }: Props) => {
  const client = generateClient();
  const router = useRouter();

  const handleDeletePost = async (id: string) => {
    const isConfirmed = window.confirm("本当に削除しますか？");
    if (!isConfirmed) {
      return;
    }

    await client.graphql({
      query: deletePostMutation,
      variables: {
        input: {
          id,
        },
      },
      authMode: "userPool",
    });
    router.refresh();
  };

  return (
    <button
      className="text-sm mr-4 text-red-500"
      onClick={() => handleDeletePost(id)}
    >
      Delete Post
    </button>
  );
};

export { DeleteButton };
