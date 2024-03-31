"use client";
import { useSetRecoilState } from "recoil";
import { authState } from "@/store/authState";
import { useEffect } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

const useAuthHook = () => {
  const setAuth = useSetRecoilState(authState);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // ページがロードまたはリロードされたとき、アプリは現在の認証状態を確認する。
        await getCurrentUser();
        setAuth(true);
      } catch (error) {
        setAuth(false);
      }
    };

    checkAuthState();

    const unsubscribe = Hub.listen(
      "auth",
      (data: { payload: { event: string } }) => {
        // アプリのライフサイクル中(ログイン、ログアウト等)に、ユーザーの認証状態の変更を検知する。
        switch (data.payload.event) {
          case "signIn":
            setAuth(true);
            break;
          case "signOut":
            setAuth(false);
            break;
        }
      }
    );

    // useEffectのクリーンアップ関数
    return () => unsubscribe();
  }, [setAuth]);
};

export { useAuthHook };
