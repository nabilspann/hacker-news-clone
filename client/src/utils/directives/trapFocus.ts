import { Accessor, onCleanup } from "solid-js";

const trapFocus = (
  el: HTMLElement,
  accessor: Accessor<
    () => {
      firstEle: HTMLElement | undefined;
      lastEle: HTMLElement | undefined;
    }
  >
) => {
  let isShifting = false;
  const onKeyDown = (e: KeyboardEvent) => {
    if(e.key === "Shift") isShifting = true
    const { firstEle, lastEle } = accessor()?.();
    if (e.target === lastEle && e.key === "Tab" && !isShifting) {
      e.preventDefault();
      firstEle?.focus();
    }
    if (e.target === firstEle && e.key === "Tab" && isShifting) {
      e.preventDefault();
      lastEle?.focus();
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Shift") isShifting = false;
  };

  document.body.addEventListener("keydown", onKeyDown);
  document.body.addEventListener("keyup", onKeyUp);
  onCleanup(() => { 
    document.body.removeEventListener("keydown", onKeyDown)
    document.body.removeEventListener("keyup", onKeyUp);
  });
};

export default trapFocus;
