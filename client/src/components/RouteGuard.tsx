import { Outlet, useNavigate } from "@solidjs/router";
import { Show, createEffect, onMount } from "solid-js";
import authStore from "../utils/createAuthStore";

const RouteGuardSignedIn = () => {
    const navigate = useNavigate();
    const { isAuthorized } = authStore;

    createEffect(() => {
      console.log("Signed in?")
      if (!isAuthorized()) {
        navigate("/signin", { replace: true });
      }
    });

    return (
      <>
        <Show when={isAuthorized()}>
          <Outlet />
        </Show>
      </>
    );
};

export default RouteGuardSignedIn;
