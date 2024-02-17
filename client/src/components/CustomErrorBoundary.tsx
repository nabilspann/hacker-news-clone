import { destructure } from "@solid-primitives/destructure";
import { Navigate } from "@solidjs/router";
import { ErrorBoundary, JSX } from "solid-js";
import { formatErrorUrl } from "../utils/utilFunctions";
import { ErrorType } from "../utils/interfaces";
import authStore from "../utils/createAuthStore";

interface CustomErrorBoundaryProps {
  children: JSX.Element;
  error: ErrorType;
}
const CustomErrorBoundary = (props: CustomErrorBoundaryProps) => {
  const { mutateSignInModal } = authStore;
  const { children, error } = destructure(props);
  return (
    <ErrorBoundary
      fallback={() => {
        const { errorMessage, statusCode } = formatErrorUrl(error());
        if (statusCode === 401) {
          mutateSignInModal(true);
          return <Navigate href="/" />;
        }
        return (
          <div class="flex flex-col justify-center items-center">
            <div class="text-2xl">{statusCode}</div>
            <div>{errorMessage}</div>
          </div>
        );
      }}
    >
      {children()}
    </ErrorBoundary>
  );
};

export default CustomErrorBoundary;
