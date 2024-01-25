import { Show, createEffect, createResource, createSignal } from "solid-js";
import { getProtectedUserData, getUser, updateUser } from "../apiCalls/AuthCalls";
import { formatErrorUrl } from "../utils/utilFunctions";
import { type GetUser, type ErrorType, GetProtectedUserData } from "../utils/interfaces";
import CurrentlySending from "../components/CurrentlySending";
import DisplayUserInfo from "../components/DisplayUserInfo";
import CustomErrorBoundary from "../components/CustomErrorBoundary";

const userNameNotFound = () => {
    return(
        <div>Username not found!</div>
    )
};

const usernameLoading = () => {
    return <div>Username loading...</div>;
}

const emailNotFound = () => {
  return <div>Email not found!</div>;
};

const emailLoading = () => {
  return <div>Email loading...</div>;
};

const Account = () => {
    const [user, {mutate}] = createResource<GetUser>(getUser);
    const [protectedUserData] = createResource<GetProtectedUserData>(getProtectedUserData);
    const [usernameInput, setUsernameInput] = createSignal("");
    const [settings, setSettings] = createSignal({
      errorMessage: "",
      successMessage: "",
      isSending: false,
    });

    const submit = async (e: Event) => {
        e.preventDefault();

        setSettings((currentSettings) => ({
          ...currentSettings,
          isSending: true,
        }));
        try{
            const response = await updateUser(usernameInput());

            const prevUser = user()?.[0] || { user_id: "", created_at: "", is_edited: true, is_sign_up: false };
            mutate([{
                ...prevUser,
                username: response.username
            }]);
            setSettings((currentSettings) => ({
                ...currentSettings,
                errorMessage: "",
                successMessage: "Username changed!",
                isSending: false,
            }));
            setUsernameInput("");
        }catch(err){
            const formattedError = formatErrorUrl(err as ErrorType);
            setSettings((currentSettings) => ({
                ...currentSettings,
                errorMessage: formattedError.errorMessage,
                successMessage: "",
                isSending: false,
            }));
        }
    };

    createEffect(async () => {
      console.log(
        "on mount account",
        user()
      );
      if(user() && user()!.length !== 0 && user()?.[0].is_sign_up) {
        await updateUser(user()![0].username);
      }
    });

    return (
      <div class="flex flex-col justify-center items-center overflow-hidden h-fullScreen">
        <div class="w-80">
          <Show when={user() && user()?.[0].is_sign_up}>
            <div class="text-cyan-400 max-w-xl text-center py-4">
              Welcome to Vercona! We have automatically generated an username
              for you. If you would like to change your username now, you can do
              so. You can always change it later as well.
            </div>
          </Show>
          <div class="flex flex-col justify-start">
            <Show when={!protectedUserData.loading} fallback={emailLoading()}>
              <CustomErrorBoundary error={protectedUserData.error}>
                <Show
                  when={
                    protectedUserData() && protectedUserData()?.data.user?.email
                  }
                  fallback={emailNotFound()}
                >
                  <DisplayUserInfo
                    key="Email:"
                    value={protectedUserData()!.data.user!.email!}
                  />
                </Show>
              </CustomErrorBoundary>
            </Show>
            <Show when={!user.loading} fallback={usernameLoading()}>
              <CustomErrorBoundary error={user.error}>
                <Show
                  when={user() && user()?.[0].username}
                  fallback={userNameNotFound()}
                >
                  <DisplayUserInfo
                    key="Username:"
                    value={user()![0].username}
                  />
                </Show>
              </CustomErrorBoundary>
            </Show>
          </div>
          <form
            class="flex flex-col justify-center items-center my-10"
            onSubmit={submit}
          >
            <input
              type="text"
              class="text-black text-center p-2"
              value={usernameInput()}
              placeholder="Change username"
              onChange={(e) => setUsernameInput(e.target.value)}
            />
            <Show when={!settings().isSending} fallback={CurrentlySending()}>
              <input
                type="submit"
                class="btn btn-primary mt-2"
                value="Submit"
              />
            </Show>
          </form>
          <Show when={settings().errorMessage}>
            <div class="text-red-600 m-auto w-fit">
              {settings().errorMessage}
            </div>
          </Show>
          <Show when={settings().successMessage}>
            <div class="text-emerald-400 m-auto w-fit">
              {settings().successMessage}
            </div>
          </Show>
        </div>
      </div>
    );
};

export default Account;
