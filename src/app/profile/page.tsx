"use client";
import {
  withAuthenticator,
  Button,
  Authenticator,
} from "@aws-amplify/ui-react";
import {
  AuthUser,
  FetchUserAttributesOutput,
  fetchUserAttributes,
  getCurrentUser,
  signIn,
} from "aws-amplify/auth";
import { useState, useEffect, useCallback } from "react";
import "@aws-amplify/ui-react/styles.css";

type Props = {
  signOut: () => void;
};

type FormDataType = {
  username: string;
  password: string;
};

// export default function Profile({ signOut }: Props) {
export default function Profile() {
  // const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [userAttributes, setUserAttributes] =
    useState<FetchUserAttributesOutput | null>(null);

  const checkUser = useCallback(async () => {
    try {
      // const user = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      // setAuthUser(user);
      setUserAttributes(userAttributes);
    } catch (error) {
      // setAuthUser(null);
      setUserAttributes(null);
      // signOut();
      console.log(error);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          <h1 className="text-3xl font-semibold tracking-wide mt-6">Profile</h1>
          <h1 className="font-medium text-gray-500 my-2">{user?.username}</h1>
          <p className="text-sm text-gray-500 mb-6">{userAttributes?.email}</p>
          <Button onClick={signOut}>Sign out</Button>
        </div>
      )}
    </Authenticator>
    // <div>
    //   <h1 className="text-3xl font-semibold tracking-wide mt-6">Profile</h1>
    //   <h1 className="font-medium text-gray-500 my-2">{authUser.username}</h1>
    //   <p className="text-sm text-gray-500 mb-6">{userAttributes.email}</p>
    //   <Button onClick={signOut}>Sign out</Button>
    // </div>
  );
}
//
// export default withAuthenticator(Profile);
