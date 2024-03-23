import { Amplify } from "aws-amplify";
import config from "@/aws-exports";
// AmplifyがSSRに対応しため、一応追加
Amplify.configure(config, { ssr: true });
