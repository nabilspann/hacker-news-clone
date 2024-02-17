import { A } from "@solidjs/router";
import { JSX } from "solid-js";
import { destructure } from "@solid-primitives/destructure";
import authStore from "../utils/createAuthStore";

interface ProtectedLinkProps {
    children: JSX.Element
};

const ProtectedLink = (props: ProtectedLinkProps) => {
    const { isAuthorized, mutateSignInModal } = authStore;
    const { children } = destructure(props);

    return (
      <>
        {isAuthorized() ? (
          <A href="/create-post">
            {children()}
          </A>
        ) : (
          <button onClick={() => mutateSignInModal()}>{children()}</button>
        )}
      </>
    );
};

export default ProtectedLink;
