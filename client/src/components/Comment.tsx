import { For, Show, createSignal } from "solid-js";
import { destructure } from "@solid-primitives/destructure";
import {
  calcTimeDifference,
  formatErrorUrl,
  getSentTimeMessage,
} from "../utils/utilFunctions";
import { deleteComment, submitComment } from "../apiCalls/CommentSectionCalls";
import type {
  Comment as CommentType,
  ErrorType,
  GetUser,
  PathArray,
} from "../utils/interfaces";
import ReplyCommentField from "./ReplyCommentField";
import ChildComments from "./ChildComments";
import ReplyIcon from "./svgs/ReplyIcon";
import protectedEventHandler from "../utils/protectedEventHandler";

interface CommentProps {
  comment: CommentType;
  post_id: string;
  pathArr: PathArray[];
  addCommentToStore: (
    path: PathArray[],
    value: any,
    type: "submission" | "pagination",
    numOfChildren: number
  ) => void;
  deleteCommentFromStore: (pathArr: PathArray[], index: number) => void;
  index: number;
  handleCommentsPagination: (
    commentId: string,
    latestCommentNum: number,
    queryNumLimit: number,
    queryDepth: number,
    pathArr: PathArray[]
  ) => void;
  user: GetUser;
}

interface Settings {
  isExpanded: boolean;
  displayForm: boolean;
  isLoading: boolean;
  error: {
    type: "" | "deletion" | "submission" | "reply_button" | "pagination";
    errorMessage: string;
    errorClass: string;
    display: boolean;
  };
}

const Comment = (props: CommentProps) => {
  const { comment, post_id, pathArr, user } = destructure(props);

  const [commentText, setCommentText] = createSignal("");
  const [settings, setSettings] = createSignal<Settings>({
    isExpanded: comment().comments.length !== 0 ? true : false,
    displayForm: false,
    isLoading: false,
    error: {
      type: "",
      display: false,
      errorMessage: "",
      errorClass: "",
    },
  });

  const timeDifference = calcTimeDifference(
    new Date(),
    new Date(comment().created_at)
  );

  const submitReply = async (e: Event) => {
    e.preventDefault();
    if (!commentText()) {
      setSettings({
        ...settings(),
        error: {
          display: true,
          errorMessage: "Please enter a comment!",
          type: "submission",
          errorClass: "text-red-600",
        },
      });
      return;
    }

    try {
      const response = await submitComment(
        post_id(),
        comment().level + 1,
        commentText(),
        comment().comment_id
      );
      props.addCommentToStore(
        pathArr(),
        response,
        "submission",
        comment().num_of_children
      );
      setSettings((currentSettings) => ({
        ...currentSettings,
        displayForm: false,
      }));
    } catch (err) {
      const formattedError = formatErrorUrl(err as ErrorType);
      setSettings({
        ...settings(),
        error: {
          display: true,
          errorMessage: formattedError.errorMessage,
          type: "submission",
          errorClass: "text-red-600",
        },
      });
    }
  };

  const handleCommentInput = (textAreaValue: string) => {
    setCommentText(textAreaValue);
  };

  const handleDeleteComment = async () => {
    const index = pathArr()[pathArr().length - 2];
    try {
      if (typeof index === "number") {
        await deleteComment(comment().comment_id);
        props.deleteCommentFromStore(pathArr(), index);
      }
    } catch (err) {
      const formattedError = formatErrorUrl(err as ErrorType);
      setSettings({
        ...settings(),
        error: {
          display: true,
          errorMessage: formattedError.errorMessage,
          type: "deletion",
          errorClass: "text-red-600",
        },
      });
    }
  };

  const handleReplyButton = () => {
    if (user()) {
      setSettings((currentSettings) => ({
        ...currentSettings,
        displayForm: !currentSettings.displayForm,
      }));
    } else {
      setSettings((currentSettings) => ({
        ...currentSettings,
        error: {
          display: true,
          type: "reply_button",
          errorMessage: "Please login first before replying!",
          errorClass: "text-blue-600",
        },
      }));
    }
  };

  const handleCommentsPagination = async () => {
    let latestCommentNum;
    if (comment().comments.length !== 0) {
      latestCommentNum =
        comment().comments[comment().comments.length - 1].row_num;
    } else {
      latestCommentNum = 0;
    }
    await props.handleCommentsPagination(
      comment().comment_id,
      latestCommentNum,
      4,
      comment().level + 1,
      pathArr()
    );
  };

  const handleLoadMoreComments = async () => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      isLoading: true,
    }));
    try {
      await handleCommentsPagination();
      setSettings((currentSettings) => ({
        ...currentSettings,
        isLoading: false,
      }));
    } catch (err) {
      const formattedError = formatErrorUrl(err as ErrorType);
      setSettings((currentSettings) => ({
        ...currentSettings,
        isLoading: false,
        error: {
          type: "pagination",
          display: true,
          errorClass: "",
          errorMessage: formattedError.errorMessage,
        },
      }));
    }
  };

  const handleExpand = async () => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      isExpanded: !currentSettings.isExpanded,
    }));
    if (comment().comments.length === 0) {
      await handleLoadMoreComments();
    }
  };

  return (
    <li class="py-5">
      <div class="flex items-center">
        <div class="text-xl">
          {!comment().is_deleted ? comment().user.username : "Deleted"}
        </div>
        {!comment().is_deleted && (
          <div class="ml-2 text-sm text-slate-300">
            - Comment sent {getSentTimeMessage(timeDifference)}
          </div>
        )}
      </div>
      <div class="p-2">
        {!comment().is_deleted
          ? comment().body
          : "This comment has been deleted"}
      </div>
      <div class="flex">
        <Show when={comment().num_of_children}>
          <button class="p-1" onClick={handleExpand}>
            {settings().isExpanded ? "-" : "+"}
          </button>
        </Show>
        <button
          class="flex px-3 py-1 hover:bg-zinc-800 rounded-2xl font-bold"
          onClick={(e) => protectedEventHandler(e, handleReplyButton)}
        >
          <div class="mr-1">
            <ReplyIcon size={25} />
          </div>
          Reply
        </button>
        <Show
          when={
            !comment().is_deleted &&
            user()?.length !== 0 &&
            user()?.[0].user_id &&
            comment().user.user_id === user()?.[0].user_id
          }
        >
          <button
            onClick={handleDeleteComment}
            class="px-2 border-2 mx-2 border-rose-900"
          >
            Delete comment
          </button>
        </Show>
      </div>
      <Show when={settings().displayForm}>
        <ReplyCommentField
          handleSubmit={submitReply}
          replyText={commentText()}
          username={comment().user.username}
          handleInput={(e) =>
            handleCommentInput((e.target as HTMLInputElement).value)
          }
          handleCancel={() =>
            setSettings((currentSettings) => ({
              ...currentSettings,
              displayForm: false,
            }))
          }
        />
      </Show>
      <Show
        when={
          settings().error.display &&
          (settings().error.type === "submission" ||
            settings().error.type === "deletion" ||
            settings().error.type === "reply_button")
        }
      >
        <div class={settings().error.errorClass}>
          {settings().error.errorMessage}
        </div>
      </Show>
      <ChildComments
        comments={comment().comments}
        isTopLevelComment={false}
        numOfChildren={comment().num_of_children}
        handleCommentsPagination={handleLoadMoreComments}
        handleExpand={handleExpand}
        settings={settings()}
      >
        <ul class="ml-5">
          <For each={comment().comments}>
            {(comment, index) => (
              <Comment
                comment={comment}
                post_id={post_id()}
                pathArr={[...pathArr(), index(), "comments"]}
                addCommentToStore={props.addCommentToStore}
                deleteCommentFromStore={props.deleteCommentFromStore}
                index={index()}
                handleCommentsPagination={props.handleCommentsPagination}
                user={user()}
              />
            )}
          </For>
        </ul>
      </ChildComments>
    </li>
  );
};

export default Comment;
