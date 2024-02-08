import { Show, createSignal } from "solid-js";
import { submitPost } from "../apiCalls/CommentSectionCalls";
import { useNavigate } from "@solidjs/router";
import { formatErrorUrl } from "../utils/utilFunctions";
import { ErrorType } from "../utils/interfaces";

const Sending = () => {
  return <div>
    Sending...
  </div>
};

const CreatePost = () => {
    const navigate = useNavigate();
    const [inputs, setInputs] = createSignal({
        title: "",
        description: "",
    });
    const [settings, setSettings] = createSignal({
      isSending: false,
      error: {
        display: false,
        errorMessage: ""
      }
    });

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        if(!inputs().title){
          setSettings((prev) => ({
            ...prev,
            error: {
              display: true,
              errorMessage: "Please enter a title!",
            },
          }));
          return;
        }
        setSettings((prev) => ({
          ...prev,
          isSending: true,
        }));
        try{
            const postRes = await submitPost(inputs().title, inputs().description);
            console.log("postRes", postRes);
            navigate(`/posts/${postRes.post_id}`);
        }catch(err){
            console.log("err", err);
            const formattedError = formatErrorUrl(err as ErrorType);
            setSettings(prev => ({...prev, error: { display: true, errorMessage: formattedError.errorMessage }}));
        }finally{
          setSettings((prev) => ({
            ...prev,
            isSending: false,
          }));
        }
    };

    return (
      <div class="p-5">
        <div class="mx-auto  max-w-4xl">
          <div class="p-5 text-lg font-semibold">Create a post</div>
          <form
            class="flex flex-col justify-center items-end p-5"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Title"
              class="w-full mb-2 px-2 py-1 bg-neutral-800 rounded"
              value={inputs().title}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
            <textarea
              placeholder="Text (optional)"
              class="w-full px-2 py-1 h-32  bg-neutral-800 rounded"
              onInput={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            <div class="flex w-full">
              <div class="w-full p-2 text-red-600">
                <Show when={settings().error.display}>
                  {settings().error.errorMessage}
                </Show>
              </div>
              <Show when={!settings().isSending} fallback={Sending()}>
                <input
                  type="submit"
                  value="Post"
                  class="px-3 py-1 cursor-pointer bg-sky-500 mt-1 rounded-xl font-bold"
                />
              </Show>
            </div>
          </form>
        </div>
      </div>
    );
};

export default CreatePost;
