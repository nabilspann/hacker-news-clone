import authStore from "./createAuthStore";
import { Location, useNavigate } from "@solidjs/router";
import { redirectAfterLogin } from "./utilFunctions";
import { isAuthTokenValid } from "../apiCalls/AuthCalls";

const checkAuthHook = async (
  location: Location<unknown> | null = null,
) => {
  const navigate = useNavigate();
  const { refreshTokenState, mutateToken, setIsAuthorized } = authStore;

  const isAuthorized = await isAuthTokenValid();
  setIsAuthorized(isAuthorized);
  if (!location?.hash.includes("#access_token") && !isAuthorized) {
    await refreshTokenState();
  }

  if (location && location.hash.includes("#access_token")) {
    await mutateToken(location);
    await redirectAfterLogin(navigate);
  }
};

export default checkAuthHook;