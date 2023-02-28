import { Button } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import React from "react";
import { darkModeState } from "@/atoms/darkmodeAtom";

type TAuth = {};

const AuthButtons: React.FC = () => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const useDarkModeState = useRecoilValue(darkModeState);
    return (
        <>
            <Button
                variant={useDarkModeState.darkMode ? "dark" : "outline"}
                height="30px"
                display={{
                    base: "none",
                    sm: "flex",
                }}
                width={{
                    base: "70px",
                    md: "110px",
                }}
                mr={2}
                onClick={()=>setAuthModalState({open:true, type:"login"})}
            >
                Log in
            </Button>
            <Button
                height="30px"
                variant={useDarkModeState.darkMode ? "dark_selected" : "solid"}
                display={{
                    base: "none",
                    sm: "flex",
                }}
                width={{
                    base: "70px",
                    md: "110px",
                }}
                mr={2}
                onClick={()=>setAuthModalState({open:true, type:"signup"})}
                >Sign Up</Button>
        </>
    );
};
export default AuthButtons;
