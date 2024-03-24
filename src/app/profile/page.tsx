"use client";
import { withAuthenticator } from "@aws-amplify/ui-react";
import {
  AuthUser,
  FetchUserAttributesOutput,
  fetchUserAttributes,
  getCurrentUser,
  signOut,
} from "aws-amplify/auth";
import { useState, useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";

function Profile() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [userAttributes, setUserAttributes] =
    useState<FetchUserAttributesOutput | null>(null);

  const checkUser = async () => {
    try {
      const user = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      setAuthUser(user);
      setUserAttributes(userAttributes);
    } catch (error) {
      setAuthUser(null);
      setUserAttributes(null);
      await signOut();
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  if (!authUser || !userAttributes) {
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Profile</h1>
      <h1 className="font-medium text-gray-500 my-2">{authUser.username}</h1>
      <p className="text-sm text-gray-500 mb-6">{userAttributes.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}

export default withAuthenticator(Profile);
