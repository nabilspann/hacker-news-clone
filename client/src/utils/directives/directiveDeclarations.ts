import { autofocus } from "@solid-primitives/autofocus";
import clickOutside from "./clickOutside";
import trapFocus from "./trapFocus";

declare module "solid-js" {
  namespace JSX {
    interface DirectiveFunctions {
      trapFocus: typeof trapFocus;
      clickOutside: typeof clickOutside;
      autofocus: typeof autofocus;
    }
  }
}
