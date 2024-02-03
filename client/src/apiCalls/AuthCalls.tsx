import { DEV } from "solid-js";
import { trpc } from "../utils/api";

type OAuthLinkProvider = "google" | "github";

export const magicEmailLinkLogin = async (email: string) => {
    return await trpc.auth.passwordlessLogin.query({ email });
};

export const getUser = async () => {
    return await trpc.auth.getUser.query();
};

export const updateUser = async (username: string) => {
    return await trpc.auth.updateUser.mutate({ username });
};

export const refreshSession = async () => {
  const domain = DEV ? "localhost" : "nabil-hacker-news-clone.netlify";
  return await trpc.auth.refreshSession.query({ domain });
};

export const isAuthTokenValid = async () => {
    try{
      return await trpc.auth.isAuthTokenValid.query();

    }catch(err){
      return false;
    }
};

export const createCookie = async (
  accessToken: string,
  //   accessTokenExpirationDate: Date,
  accessTokenExpirationDate: string,
  refreshToken: string,
  refreshTokenExpirationDate: string,
  domain: string
) => {
  return await trpc.auth.createCookie.query({
    domain,
    accessToken,
    accessTokenExpirationDate,
    refreshToken,
    refreshTokenExpirationDate,
  });
};

export const deleteCookie = async (domain: string) => {
  return await trpc.auth.deleteCookie.query({ domain });
};

export const oAuthLink = async (provider: OAuthLinkProvider) => {
  return await trpc.auth.getOAuthLoginLink.query({ provider });
};

export const getProtectedUserData = async () => {
  return await trpc.auth.getProtectedUserData.query();
};
