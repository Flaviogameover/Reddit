import { atom } from "recoil";

export interface AuthModalState {
    open: boolean;
    type: "login" | "signup" | "reset";
};

const defaultModalState: AuthModalState = {
    open: false,
    type: "login",
};

export const authModalState = atom<AuthModalState>({
    key: "authModal",
    default: defaultModalState,
});