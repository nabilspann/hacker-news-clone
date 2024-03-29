import { trpc } from "../utils/api";

export const getPostAndComments = async (
  post_id: string,
  // limitChildRowNum: number
) => {
  const response = await trpc.messages.getPostAndComments.query({
    post_id,
    limitChildRowNum: 4,
    limitLevel: 1
  });

  return response;
};

export const getPost = async (post_id: string) => {
    const response = await trpc.messages.getPost.query({
      post_id,
    });
    return response;
};

export const submitComment = async (post_id: string, level: number, body: string, parent_id: string | null = null) => {
  return await trpc.messages.createComment.mutate({
    post_id,
    level,
    body,
    parent_id,
  });
};

export const deleteComment = async (comment_id: string) => {
  return await trpc.messages.deleteComment.mutate({ comment_id });
};

export const getAdditionalComments = async (
  post_id: string,
  parent_id: string | null,
  begin_comment_num: number,
  query_num_limit: number,
  start_level: number,
  query_depth: number | null = null
) => {
  return await trpc.messages.getRepliedComments.query({
    post_id,
    parent_id,
    begin_comment_num,
    query_num_limit,
    start_level,
    query_depth,
  });
};

export const getAllPosts = async () => {
  return await trpc.messages.getAllPosts.query();
};

export const submitPost = async (title: string, description: string) => {
  return await trpc.messages.createPost.mutate({title, description});
};
