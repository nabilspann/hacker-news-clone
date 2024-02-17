import { Show, createEffect, createResource, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { autofocus } from "@solid-primitives/autofocus";
import { magicEmailLinkLogin, oAuthLink } from "../apiCalls/AuthCalls";
import { formatErrorUrl } from "../utils/utilFunctions";
import type { ErrorType } from "../utils/interfaces";
import CurrentlySending from "../components/CurrentlySending";
import GoogleLogo from "../components/svgs/GoogkLogo";
import GitHubLogo from "../components/svgs/GithubLogo";
import authStore from "../utils/createAuthStore";
import clickOutside from "../utils/directives/clickOutside";
import trapFocus from "../utils/directives/trapFocus";

clickOutside;
trapFocus;
autofocus;

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const SignIn = () => {
  const navigate = useNavigate();
  const { isAuthorized, mutateSignInModal } = authStore;
  const [emailInput, setEmailInput] = createSignal("");
  const [settings, setSettings] = createSignal({
    emailLinkSignIn: {
      errorMessage: "",
      successMessage: "",
      isSending: false,
    },
  });
  const [googleOAuthLink] = createResource("google", oAuthLink);
  const [gitHubOAuthLink] = createResource("github", oAuthLink);
  const [firstEle, setFirstEle] = createSignal<HTMLElement>();
  const [lastEle, setLastEle] = createSignal<HTMLElement>();

  createEffect(() => {
    if (isAuthorized()) {
      navigate("/account", { replace: true });
    }
  });

  const submit = async (e: Event) => {
    e.preventDefault();
    const isEmailValid = emailInput().toLocaleLowerCase().match(emailRegex);

    setSettings((currentSettings) => ({
      ...currentSettings,
      emailLinkSignIn: {
        ...currentSettings.emailLinkSignIn,
        isSending: true,
      },
    }));
    if (isEmailValid) {
      try {
        await magicEmailLinkLogin(emailInput());
        setSettings((currentSettings) => ({
          ...currentSettings,
          emailLinkSignIn: {
            isSending: false,
            errorMessage: "",
            successMessage: "Email sent. Please check your inbox!",
          },
        }));
        setEmailInput("");
      } catch (err) {
        const formattedError = formatErrorUrl(err as ErrorType);
        setSettings((currentSettings) => ({
          ...currentSettings,
          emailLinkSignIn: {
            isSending: false,
            errorMessage: formattedError.errorMessage,
            successMessage: "",
          },
        }));
      }
    } else {
      setSettings((currentSettings) => ({
        ...currentSettings,
        emailLinkSignIn: {
          isSending: false,
          errorMessage: "Invalid Email",
          successMessage: "",
        },
      }));
    }
  };

  const getEleRefs = () => {
    return {
      firstEle: firstEle(),
      lastEle: lastEle(),
    };
  };

  return (
    <div
      class="flex flex-col justify-center items-center bg-zinc-900 p-5 rounded-lg sticky"
      use:clickOutside={() => mutateSignInModal(false)}
      use:trapFocus={() => getEleRefs()}
    >
      <div class="flex flex-col justify-center items-center w-80 text-gray-200">
        <button
          class="self-end -mt-5 -mr-3 text-xl cursor-pointer"
          onClick={() => mutateSignInModal(false)}
          ref={setFirstEle}
          use:autofocus
          autofocus
        >
          &#x2715;
        </button>
        <h2 class="text-3xl font-bold mb-10 text-zinc-300">
          Sign up or log in
        </h2>

        <Show when={googleOAuthLink()?.url}>
          <div class="my-2 text-xl">
            <a href={googleOAuthLink()!.url!} class="flex flex-row py-4 px-8">
              <div class="px-2">
                <GoogleLogo size={30} />
              </div>
              <div>Google</div>
            </a>
          </div>
        </Show>
        <Show when={gitHubOAuthLink()?.url}>
          <div class="my-2 text-xl">
            <a href={gitHubOAuthLink()!.url!} class="flex flex-row py-4 px-8">
              <div class="px-2">
                <GitHubLogo size={30} />
              </div>
              <div>Github</div>
            </a>
          </div>
        </Show>

        <div class="flex flex-row justify-center items-center w-full py-5">
          <hr class="w-28 h-1 mx-auto bg-white border-0 rounded" />
          <div class="flex w-10 justify-center">OR</div>
          <hr class="w-28 h-1 mx-auto bg-white border-0 rounded" />
        </div>
        <form
          onSubmit={submit}
          class="flex flex-col items-center justify-center"
        >
          <label class="pb-4 text-xl">Email</label>
          <input
            class="text-black w-52 p-3 text-center rounded-lg bg-slate-100"
            type="text"
            value={emailInput()}
            placeholder="example@email.com"
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <Show
            when={!settings().emailLinkSignIn.isSending}
            fallback={CurrentlySending()}
          >
            <input
              type="submit"
              class="btn btn-primary mt-2 cursor-pointer py-3 px-5 bg-purple-900 rounded-lg"
              value="Proceed with Email"
              ref={setLastEle}
            />
          </Show>
          <Show when={settings().emailLinkSignIn.errorMessage}>
            <div class="text-red-600">
              {settings().emailLinkSignIn.errorMessage}
            </div>
          </Show>
          <Show when={settings().emailLinkSignIn.successMessage}>
            <div class="text-emerald-400">
              {settings().emailLinkSignIn.successMessage}
            </div>
          </Show>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
