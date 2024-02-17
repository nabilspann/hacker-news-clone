import { Show } from "solid-js";
import App from "./App";
import SignIn from "./pages/SignIn";
import authStore from "./utils/createAuthStore";

const Layout = () => {
    const { displaySignInModal } = authStore;
    return (
      <div class="layout max-h-screen h-screen">
        <div class="overlay overflow-scroll h-full bg-black">
          <App />
        </div>
        <Show when={displaySignInModal()}>
          <div class="flex justify-center items-center overlay bg-slate-900/50 h-full">
            <SignIn />
          </div>
        </Show>
      </div>
    );
};

export default Layout;
