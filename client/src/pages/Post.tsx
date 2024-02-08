// Solid Imports
import { Show, createResource, ErrorBoundary, For, Signal, createSignal, onMount } from "solid-js";
import type {
  ResourceSource,
  ResourceFetcher,
  Resource,
} from "solid-js";
import { Navigate, useParams } from "@solidjs/router";
import { createStore, reconcile, unwrap } from "solid-js/store";
import type { SetStoreFunction } from "solid-js/store";

// API Imports
import { getAdditionalComments, getPostAndComments, submitComment } from "../apiCalls/CommentSectionCalls";
import { getUser } from "../apiCalls/AuthCalls";

// Local Imports
import Comment from "../components/Comment";
// import { errorPageUrl } from "../../../server/utils/constants";
import { calcTimeDifference, formatErrorUrl, getSentTimeMessage } from "../utils/utilFunctions";
import { Comment as CommentType, PostAndComments, PathArray, ErrorType, Post as PostType, GetUser } from "../utils/interfaces";
import ReplyCommentField from "../components/ReplyCommentField";
import ChildComments from "../components/ChildComments";
import { errorPageUrl } from "../utils/constants";
import authStore from "../utils/createAuthStore";

function resourceStore<T, S>(watcher:ResourceSource<S>, fetcher:ResourceFetcher<S, T, unknown>, options={}) {
  const [store, setStore] = createStore<T[]>([]);

  function toSignal<T>(v: T) { 
    return ([
      () => store[0],
      (update: T) => (
        setStore(0, reconcile(typeof update === "function" ? update(unwrap(store[0])) : v))
      )
    ] as unknown as Signal<T>)
  }

  const [ status, { refetch } ] = createResource<T, S>(
    watcher,
    fetcher,
    { ...options, storage: toSignal }
  )

  return [status, { mutate: setStore, refetch }] as [Resource<T>, {mutate:  SetStoreFunction<T[]>, refetch: typeof refetch}]
}

const Post = () => {
  const params = useParams();
  const { isAuthorized } = authStore;
  const [commentText, setCommentText] = createSignal("");
  const [settings, setSettings] = createSignal({
    displayForm: false,
    isLoading: false,
    error: {
      type: "",
      display: false,
      errorMessage: "",
    },
  });

  const [singlePost, { mutate }] = resourceStore<PostAndComments, string>(
    params.postId,
    getPostAndComments
  );

  const [user, setUser] = createSignal<GetUser>([]);

  onMount(async () => {
    if(isAuthorized()){
      try{
        const userData = await getUser();
        setUser(userData);
      }catch(err){

      }
    }
  });

  const addCommentToStore = (pathArr: PathArray[], value: CommentType[], type: "submission" | "pagination", numOfChildren: number) => {
    const singlePostValidation = singlePost() && singlePost()?.comments;
    if (singlePostValidation && type === "submission") {
      mutate(0, "comments", ...(pathArr as []), (existing: CommentType[]) => [
        ...value,
        ...existing,
      ]);
      if(pathArr.length >= 2){
        const formattedPathArr = pathArr.slice(0, -1);
        const pathIndex: number = formattedPathArr.pop() as number;

        mutate(0, "comments", ...(formattedPathArr as []), pathIndex, (existing: CommentType) => ({
          ...existing,
          num_of_children: existing.num_of_children + 1
        }));
      }else if (pathArr.length === 0) {
        mutate(0, "post", (existing: PostType) => ({
          ...existing,
          num_of_children: existing.num_of_children + 1,
        }));
      }
    }
    if (singlePostValidation && type === "pagination") {
      mutate(0, "comments", ...(pathArr as []), (existing: CommentType[]) => [
        ...existing,
        ...value,
      ]);
    }
  };

  // Soft Delete
  const deleteCommentFromStore = (pathArr: PathArray[], index: number) => {
    const pathToComment = pathArr.slice(0, -1);
    if (singlePost() && singlePost()?.comments) {
      mutate(0, "comments", ...(pathToComment as []), (existing) => ({
        ...existing,
        body: null,
        user: { user_id: null, username: null },
        is_deleted: true,
      }));
    }
  };

  const submitReply = async (e: Event) => {
    e.preventDefault();
    try {
      if(singlePost() && singlePost()?.post){
        const response = await submitComment(
          singlePost()!.post.post_id,
          0,
          commentText()
        );

        addCommentToStore([], response, "submission", singlePost()!.post.num_of_children);
        setSettings((currentSettings) => ({
          ...currentSettings,
          displayForm: false,
        }));
      }
    } catch (err) {
      const formattedError = formatErrorUrl(err as ErrorType);
      setSettings({
        ...settings(),
        error: { display: true, errorMessage: formattedError.errorMessage, type: "submission" },
      });
    }
  };

  const handleCommentInput = (textAreaValue: string) => {
    setCommentText(textAreaValue);
  };

  const handleCommentsPagination = async (
    parentId: string | null,
    latestCommentNum: number,
    queryNumLimit: number,
    queryDepth: number,
    pathArr: PathArray[]
  ) => {
    if (singlePost()?.post){
      const response = await getAdditionalComments(
        singlePost()!.post.post_id,
        parentId,
        latestCommentNum,
        queryNumLimit,
        queryDepth
      );
      addCommentToStore(
        pathArr,
        response,
        "pagination",
        singlePost()!.comments.length
      );
    }
  };

  return (
    <ErrorBoundary
      fallback={() => {
        const { errorMessage, statusCode } = formatErrorUrl(singlePost.error);
        return (
          <Navigate
            href={`/${errorPageUrl}?message=${btoa(
              errorMessage
            )}&statusCode=${statusCode}`}
          />
        );
      }}
    >
      <div class="flex flex-col items-center justify-center p-8">
        <div class="max-w-3xl w-full">
          <Show when={singlePost() && singlePost()?.post}>
            <div class="bg-zinc-800 p-5 rounded-xl">
              <div class="flex items-center">
                <div class="text-xl font-medium">
                  {singlePost()!.post.title}
                </div>
                <div class="ml-2 text-sm text-slate-300">
                  - Posted by {singlePost()!.post.user.username}{" "}
                  {getSentTimeMessage(
                    calcTimeDifference(
                      new Date(),
                      new Date(singlePost()!.post.created_at)
                    )
                  )}
                </div>
              </div>
              <div class="p-2">{singlePost()!.post.description}</div>
              <ReplyCommentField
                replyText={commentText()}
                username={singlePost()!.post.user.username}
                handleSubmit={submitReply}
                handleCancel={() =>
                  setSettings((currentSettings) => ({
                    ...currentSettings,
                    displayForm: false,
                  }))
                }
                handleInput={(e) =>
                  handleCommentInput((e.target as HTMLInputElement).value)
                }
                displayCancelButton={false}
              />
            </div>
          </Show>
          <Show
            when={
              settings().error.display && settings().error.type === "submission"
            }
          >
            <div class="text-red-600">{settings().error.errorMessage}</div>
          </Show>

          <Show
            when={singlePost() && singlePost()?.comments && singlePost()?.post}
          >
            <ChildComments
              comments={singlePost()!.comments}
              isTopLevelComment={true}
              numOfChildren={singlePost()!.post.num_of_children}
              displayVerticalLine={false}
              handleCommentsPagination={() => {
                let latestCommentNum;
                if (singlePost()!.comments.length !== 0) {
                  latestCommentNum =
                    singlePost()!.comments[singlePost()!.comments.length - 1]
                      .row_num;
                } else {
                  latestCommentNum = 0;
                }
                return handleCommentsPagination(
                  null,
                  latestCommentNum,
                  4,
                  0,
                  []
                );
              }}
            >
              <ul class="ml-5">
                <For each={singlePost()!.comments}>
                  {(comment, index) => (
                    <Comment
                      comment={comment}
                      post_id={singlePost()!.post.post_id}
                      pathArr={[index(), "comments"]}
                      addCommentToStore={addCommentToStore}
                      deleteCommentFromStore={deleteCommentFromStore}
                      index={index()}
                      handleCommentsPagination={handleCommentsPagination}
                      user={user()}
                    />
                  )}
                </For>
              </ul>
            </ChildComments>
          </Show>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Post;
