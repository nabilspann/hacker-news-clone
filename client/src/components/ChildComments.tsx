import { For, JSX, Show, createSignal, mergeProps } from "solid-js";
import type {
  Comment as CommentType,
  ErrorType
} from "../utils/interfaces";
import { destructure } from "@solid-primitives/destructure";
import { formatErrorUrl } from "../utils/utilFunctions";

interface ErrorObj {
  type: "" | "deletion" | "submission" | "reply_button" | "pagination";
  errorMessage: string;
  display: boolean;
};

interface Settings {
  isExpanded: boolean;
  isLoading: boolean;
  error: {
    type: "" | "deletion" | "submission" | "reply_button" | "pagination";
    errorMessage: string;
    display: boolean;
  };
}

interface ChildCommentsProps {
  comments: CommentType[];
  children: JSX.Element;
  handleCommentsPagination: () => Promise<void>;
  isTopLevelComment: boolean;
  numOfChildren: number;
  displayVerticalLine?: boolean;
  handleExpand: () => Promise<void>;
  settings: Settings;
};

const ChildComments = (props: ChildCommentsProps) => {
    const mergedProps = mergeProps({ displayVerticalLine: true }, props);
    const { comments, isTopLevelComment, numOfChildren, displayVerticalLine, settings } = destructure(mergedProps);

    return (
      <>
        <Show when={settings().isExpanded || isTopLevelComment()}>
          <div class="flex">
            <Show when={displayVerticalLine()}>
              <div class="w-4 cursor-pointer" onClick={props.handleExpand}>
                <i class="w-1/2 h-full block border-r-2 border-zinc-300"></i>
              </div>
            </Show>
            <div>{props.children}</div>
          </div>
          <Show
            when={comments().length < numOfChildren() && !settings().isLoading}
          >
            <div class="ml-5">
              <button onClick={props.handleCommentsPagination}>
                Load more comments
              </button>
            </div>
          </Show>
          <Show when={settings().isLoading}>
            <div>Loading...</div>
          </Show>
          <Show
            when={
              settings().error.display && settings().error.type === "pagination"
            }
          >
            <div class="text-red-600">{settings().error.errorMessage}</div>
          </Show>
        </Show>
      </>
    );
};

export default ChildComments;
