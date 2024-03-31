import { cookies } from "next/headers";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/api";

import config from "@/amplifyconfiguration.json";

export const serverClient = generateServerClientUsingCookies({
  config,
  cookies,
});
