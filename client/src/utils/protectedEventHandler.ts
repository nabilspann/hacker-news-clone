import authStore from "./createAuthStore";

const protectedEventHandler = (e: Event, handleEvent: (e: Event) => void = () => {}) => {
    e.preventDefault();
    const { isAuthorized, mutateSignInModal } = authStore;
    if (!isAuthorized()) {
      mutateSignInModal(true);
    } else {
      handleEvent(e);
    }
};

export default protectedEventHandler;
