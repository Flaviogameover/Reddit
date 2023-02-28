import { authModalState } from "@/atoms/authModalAtom";
import { darkModeState } from "@/atoms/darkmodeAtom";
import { auth } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useRecoilValue, useSetRecoilState } from "recoil";

type TLogin = {
    email: string;
    password: string;
};

const Login: React.FC = () => {
    const { darkMode } = useRecoilValue(darkModeState);
    const setAuthModalState = useSetRecoilState(authModalState);
    const [loginForm, setLoginForm] = useState<TLogin>({
        email: "",
        password: "",
    });
    const [signInWithEmailAndPassword, userCred, loading, error] =
        useSignInWithEmailAndPassword(auth);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        signInWithEmailAndPassword(loginForm.email, loginForm.password);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm({
            ...loginForm,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input
                required
                placeholder="email"
                type="email"
                name="email"
                mb={2}
                onChange={handleChange}
                fontSize={"10pt"}
                _placeholder={{
                    color: darkMode ? "dark_text" : "gray.500",
                }}
                bg={darkMode ? "dark_posts_bright" : "gray.50"}
                color={darkMode ? "dark_text" : "gray.500"}
                border={"1px solid"}
                borderColor={darkMode ? "dark_border" : "gray.300"}
                _hover={{
                    border: "1px solid",
                    borderColor: darkMode ? "dark_border_hover" : "blue.500",
                }}
                _focus={{
                    border: "1px solid",
                    borderColor: darkMode ? "dark_text" : "blue.500",
                }}
                _focusVisible={{
                    border: "1px solid",
                    borderColor: darkMode ? "dark_text" : "blue.500",
                }}
            />
            <Input
                required
                placeholder="password"
                type="password"
                name="password"
                mb={2}
                onChange={handleChange}
                fontSize={"10pt"}
                _placeholder={{
                    color: darkMode ? "dark_text" : "gray.500",
                }}
                bg={darkMode ? "dark_posts_bright" : "gray.50"}
                color={darkMode ? "dark_text" : "gray.500"}
                border={"1px solid"}
                borderColor={darkMode ? "dark_border" : "gray.300"}
                _hover={{
                    border: "1px solid",
                    borderColor: darkMode ? "dark_border_hover" : "blue.500",
                }}
                _focus={{
                    border: "1px solid",
                    borderColor: darkMode ? "dark_text" : "blue.500",
                }}
                _focusVisible={{
                    border: "1px solid",
                    borderColor: darkMode ? "dark_text" : "blue.500",
                }}
            />
            <Text color={"red"} fontSize={"10pt"} textAlign={"center"}>
                {
                    FIREBASE_ERRORS[
                        error?.message as keyof typeof FIREBASE_ERRORS
                    ]
                }
            </Text>
            <Button
                width={"100%"}
                height={"36px"}
                mt={2}
                mb={2}
                isLoading={loading}
                {...(darkMode && {
                    variant: "dark_selected",
                })}
                type="submit"
            >
                Log in
            </Button>
            <Flex justifyContent={"center"} mb={2}>
                <Text
                    color={darkMode ? "dark_text" : "gray.500"}
                    fontSize={"9pt"}
                    mr={1}
                >
                    Forgot your password?
                </Text>
                <Text
                    fontSize={"9pt"}
                    fontWeight={700}
                    cursor={"pointer"}
                    color={darkMode ? "dark_text" : "blue.500"}
                    onClick={() =>
                        setAuthModalState((prev) => ({
                            ...prev,
                            type: "reset",
                        }))
                    }
                >
                    Reset
                </Text>
            </Flex>
            <Flex fontSize="9pt" justifyContent={"center"}>
                <Text color={darkMode ? "dark_text" : "gray.500"} mr={1}>
                    New Here?
                </Text>
                <Text
                    color={darkMode ? "dark_text" : "blue.500"}
                    fontWeight={700}
                    cursor="pointer"
                    onClick={() =>
                        setAuthModalState((prev) => ({
                            ...prev,
                            type: "signup",
                        }))
                    }
                >
                    Sign Up
                </Text>
            </Flex>
        </form>
    );
};
export default Login;
