// NOTE: this file can be auto-generated/updated later

import { router } from "../trpc"

import getUser from './getUser';
import updateUser from './updateUser';
import passwordlessLogin from './passwordlessLogin'
import refreshSession from './refreshSession'
import isAuthTokenValid from "./isAuthTokenValid";
import authCookie from "./authCookie";
import deleteCookie from "./deleteCookie";
import createCookie from "./createCookie";
import getOAuthLoginLink from "./getOAuthLoginLink";
import getProtectedUserData from "./getProtectedUserData";

export default router({
  getUser,
  updateUser,
  passwordlessLogin,
  refreshSession,
  isAuthTokenValid,
  authCookie,
  deleteCookie,
  createCookie,
  getOAuthLoginLink,
  getProtectedUserData,
})
