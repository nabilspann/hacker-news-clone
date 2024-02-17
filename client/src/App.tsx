import { type Component, onMount, createSignal, Show } from "solid-js";
import { Routes, Route, useLocation } from "@solidjs/router";

import Home from "./pages/Home";
import Post from "./pages/Post";
import ErrorPage from "./components/ErrorPage";
import MainHeader from "./pages/MainHeader";
import Account from "./pages/Account";
import RouteGuardSignedIn from "./components/RouteGuard";
import checkAuthHook from "./utils/checkAuthHook";
import { errorPageUrl } from "./utils/constants";
import CreatePost from "./pages/CreatePost";

const App: Component = () => {
  const location = useLocation();
  const [isLoaded, setIsLoaded] = createSignal(false);

  onMount(async () => {
    await checkAuthHook(location);
    setIsLoaded(true);
  });

  return (
    <>
      <Show when={!isLoaded()}>Page Loading...</Show>
      <Show when={isLoaded()}>
        <MainHeader />
        <Routes>
          <Route path="/" component={Home} />
          <Route path="/" component={RouteGuardSignedIn}>
            <Route path="/account" component={Account} />
            <Route path="/create-post" component={CreatePost} />
          </Route>
          <Route path="/posts/:postId" component={Post} />
          <Route path={`/${errorPageUrl}`} component={ErrorPage} />
        </Routes>
      </Show>
    </>
  );
};

export default App;
