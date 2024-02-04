import { DEV, createRoot, createSignal } from "solid-js";
import { Location } from "@solidjs/router";
import { storeTokenFromUrl } from "./utilFunctions";
import { deleteCookie, refreshSession } from "../apiCalls/AuthCalls";
import { prodDomain } from "./constants";

const authStore = () => {
  const [isAuthorized, setIsAuthorized] = createSignal<boolean>();

  const mutateToken = async (location: Location<unknown>) => {
    const accessToken = await storeTokenFromUrl(location);
    if(accessToken){
      setIsAuthorized(true);
    }
  };

  const signOut = async () => {
    try{
      await deleteCookie(
        DEV ? "localhost" : prodDomain
      );
      setIsAuthorized(false);
    }catch(err){
      console.log("delete cookie error", err);
    }
  };

  const refreshTokenState = async () => {
    try {
      const sessionData = await refreshSession();
      if(sessionData.session){
        setIsAuthorized(true);
      }
    } catch (err) {
      console.log("refresh token error", err);
      return { authToken: "" };
    }
  };


  return { mutateToken, signOut, refreshTokenState, isAuthorized, setIsAuthorized };
};

export default createRoot(authStore);
