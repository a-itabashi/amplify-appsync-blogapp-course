// 参考サイト
// https://zenn.dev/gentamura/scraps/2f5ab3d7c266a4
// https://docs.amplify.aws/gen2/build-a-backend/server-side-rendering/
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import config from "@/amplifyconfiguration.json";

export const { runWithAmplifyServerContext } = createServerRunner({
  config,
});
