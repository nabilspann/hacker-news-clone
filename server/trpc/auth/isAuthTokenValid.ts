import { supabaseClient } from "../../db/supabase";

/***   Query   ***/
import { publicProcedure } from "../trpc";
export default publicProcedure.query(async ({ ctx }) => {
  const { authToken } = ctx;
  
  if(!authToken){
    return false;
  }
  const userData = await supabaseClient.auth.getUser(authToken);

  if(userData.data.user && userData.data.user.aud === "authenticated"){
    return true;
  }else{
    return false;
  }
});

/***   Demo   ***/
// npm run demo:trpc auth/isAuthTokenValid
import type { DemoClient } from "../routes";
export async function demo(trpc: DemoClient) {
  return await trpc.auth.isAuthTokenValid.query();
}
