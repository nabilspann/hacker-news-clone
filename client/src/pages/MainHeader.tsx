import { Show } from "solid-js";
import { A } from "@solidjs/router";
import authStore from "../utils/createAuthStore";

const MainHeader = () => {
  const { signOut, isAuthorized, mutateSignInModal } = authStore;

  return (
    <div class="w-full flex flex-row bg-purple-900 h-12">
      <div class="w-1/2 flex items-center justify-start px-4">
        <A href="/">Home</A>
      </div>
      <div class="w-1/2 flex items-center justify-end px-4">
        <Show when={!isAuthorized()}>
          <button onClick={() => mutateSignInModal()}>Sign in</button>
        </Show>
        <Show when={isAuthorized()}>
          <A href="/account" class="px-2">
            Your Account
          </A>
          <button
            onClick={() => {
              signOut();
            }}
            class="px-2"
          >
            Sign Out
          </button>
        </Show>
      </div>
    </div>
  );
};

export default MainHeader;
