import { Outlet, useLocation, useNavigate } from "@solidjs/router";
import { Show, createEffect, onMount } from "solid-js";
import authStore from "../utils/createAuthStore";

const RouteGuardSignedIn = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthorized } = authStore;

    createEffect(() => {
      if (!isAuthorized()) {
        let messageQuery = "";
        if(location.pathname === "/create-post"){
          messageQuery = btoa("Please login first before creating a post!")
        }
        
        navigate(`/signin${messageQuery ? "?message=" + messageQuery : ""}`, { replace: true });
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
