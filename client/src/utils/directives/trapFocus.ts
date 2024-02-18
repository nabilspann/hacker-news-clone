import { Accessor, onCleanup } from "solid-js";

const trapFocus = (el: HTMLElement) => {
  let isShifting = false;

  const onKeyDown = (e: KeyboardEvent) => {
    const focusable = el.querySelectorAll(
      `a, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`
    );

    const firstEle = focusable[0] as HTMLElement;
    const lastEle = focusable[focusable.length - 1] as HTMLElement;

    if (e.key === "Shift") isShifting = true;
    if (e.target === lastEle && e.key === "Tab" && !isShifting) {
      e.preventDefault();
      firstEle.focus();
    }
    if (e.target === firstEle && e.key === "Tab" && isShifting) {
      e.preventDefault();
      lastEle.focus();
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Shift") isShifting = false;
  };

  document.body.addEventListener("keydown", onKeyDown);
  document.body.addEventListener("keyup", onKeyUp);
  onCleanup(() => {
    document.body.removeEventListener("keydown", onKeyDown);
    document.body.removeEventListener("keyup", onKeyUp);
  });
};

export default trapFocus;
