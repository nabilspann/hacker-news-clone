import { destructure } from "@solid-primitives/destructure";
import { Show, mergeProps } from "solid-js";
import SubmitInput from "./SubmitInput";

interface ReplyCommentFieldProps {
  handleSubmit: (e: Event) => void;
  username: string | null;
  replyText: string;
  handleInput: (e: InputEvent) => void;
  handleCancel: () => void;
  displayCancelButton?: boolean;
}

const ReplyCommentField = (props: ReplyCommentFieldProps) => {
  const mergedProps = mergeProps({ displayCancelButton: true }, props);
  const { displayCancelButton, replyText, username } = destructure(mergedProps);
  return (
    <form onSubmit={props.handleSubmit} class="flex flex-col mt-3">
      <label class="text-sm text-gray-200 my-1">
        {username()
          ? `Replying to ${username()}`
          : "Responding to a deleted comment"}
      </label>
      <textarea
        rows={"4"}
        cols={"50"}
        class="bg-neutral-800 border-zinc-300 border-2 w-full p-2"
        value={replyText()}
        onInput={props.handleInput}
        placeholder="Share your thoughts here!"
      />
      <div class="items-end">
        <Show when={displayCancelButton()}>
          <button
            class="px-3 py-1 hover:bg-zinc-800 rounded-2xl mr-1 font-bold"
            onClick={props.handleCancel}
          >
            Cancel
          </button>
        </Show>
        <SubmitInput />
      </div>
    </form>
  );
};

export default ReplyCommentField;
