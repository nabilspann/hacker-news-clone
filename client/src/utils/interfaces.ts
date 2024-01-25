import { RouterOutputs } from "./api";

export type Comment = RouterOutputs["messages"]["getPostAndComments"]["comments"][0];
export type Post = RouterOutputs["messages"]["getPostAndComments"]["post"];
export type PostAndComments = RouterOutputs["messages"]["getPostAndComments"];
export type GetUser = RouterOutputs["auth"]["getUser"];
export type GetProtectedUserData = RouterOutputs["auth"]["getProtectedUserData"];
export type PathArray = number | "comments";

export interface ErrorType {
  message: string;
  data: {
    httpStatus: number;
    inputValidationError: {
      fieldErrors: {
        [key: string]: string[];
      };
    } | null;
  };
}

export interface LogoProps {
  size: number;
};
