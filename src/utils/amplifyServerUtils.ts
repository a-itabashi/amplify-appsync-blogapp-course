// 参考サイト
// https://zenn.dev/gentamura/scraps/2f5ab3d7c266a4
// https://docs.amplify.aws/gen2/build-a-backend/server-side-rendering/
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import config from "@/amplifyconfiguration.json";
import { fetchAuthSession } from "aws-amplify/auth/server";

export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});

type NextServerContext = Parameters<
  typeof runWithAmplifyServerContext
>[0]["nextServerContext"];

export const getAuthenticated = async (
  nextServerContext: NextServerContext
) => {
  return await runWithAmplifyServerContext({
    nextServerContext,
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return session.tokens !== undefined;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  });
};
