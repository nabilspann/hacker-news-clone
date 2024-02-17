import { Outlet, useNavigate } from "@solidjs/router";
import { Show, createEffect, onMount } from "solid-js";
import authStore from "../utils/createAuthStore";

const RouteGuardSignedIn = () => {
  const navigate = useNavigate();
  const { isAuthorized, mutateSignInModal } = authStore;

  createEffect(() => {
    if (!isAuthorized()) {
      navigate("/", { replace: true });
      mutateSignInModal(true);
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
