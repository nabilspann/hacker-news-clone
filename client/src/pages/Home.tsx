import { For, createResource, createSignal, onMount } from "solid-js";
import { getAllPosts, getTest } from "../apiCalls/CommentSectionCalls";
import PostHeadline from "../components/PostHeadline";
import { A } from "@solidjs/router";

const Home = () => {
  const [posts] = createResource(getAllPosts);
  const [test, setTest] = createSignal("");

  onMount(async () => {
    const testRes = await getTest();
    setTest(testRes);
  });

  return (
    <div class="flex flex-col justify-center items-center">
      <div>{test()}</div>
      <A href="/create-post" class="p-3 m-2 bg-sky-500 rounded-lg">
        + Create a new post
      </A>
      <For each={posts()}>
        {(post) => (
          <PostHeadline
            title={post.title}
            post_id={post.post_id}
            username={post.username}
          />
        )}
      </For>
    </div>
  );
};

export default Home;
