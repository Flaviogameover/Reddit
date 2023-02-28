import { Text, Flex, Button, Input } from "@chakra-ui/react";
import { authModalState } from "@/atoms/authModalAtom";
import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { darkModeState } from "@/atoms/darkmodeAtom";

type TLogin = {
    email: string;
    password: string;
    password_confirmation: string;
};

const SignUp: React.FC = () => {
    const { darkMode } = useRecoilValue(darkModeState);
    const setAuthModalState = useSetRecoilState(authModalState);
    const [error, setError] = useState<string | null>(null);
    const [signUpForm, setSignUpForm] = useState<TLogin>({
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [createUserWithEmailAndPassword, userCred, loading, userError] =
        useCreateUserWithEmailAndPassword(auth);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (error) setError(null);
        if (signUpForm.password !== signUpForm.password_confirmation) {
            setError("Passwords do not match");
            return;
        }
        createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
    };

    const createUserDocument = async (user: User) => {
        const userDocRef = doc(firestore, "users", user.uid);
        await setDoc(
            userDocRef,
            JSON.parse(
                JSON.stringify({
                    ...user,
                    darkMode,
                })
            )
        );
    };

    useEffect(() => {
        if (userCred) createUserDocument(userCred.user);
    }, [userCred]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignUpForm({
            ...signUpForm,
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
            <Input
                required
                placeholder="confirm password"
                type="password"
                name="password_confirmation"
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
            <Text color="red" textAlign="center" fontSize="10pt">
                {error ||
                    FIREBASE_ERRORS[
                        userError?.message as keyof typeof FIREBASE_ERRORS
                    ]}
            </Text>
            <Button
                width={"100%"}
                height={"36px"}
                mt={2}
                mb={2}
                type="submit"
                isLoading={loading}
                {...(darkMode && {
                    variant: "dark_selected",
                })}
            >
                Sign Up
            </Button>
            <Flex fontSize="9pt" justifyContent={"center"}>
                <Text color={darkMode ? "dark_text" : "gray.500"} mr={1}>
                    Already a Redditor?
                </Text>
                <Text
                    color={darkMode ? "dark_text" : "blue.500"}
                    fontWeight={700}
                    cursor="pointer"
                    onClick={() =>
                        setAuthModalState((prev) => ({
                            ...prev,
                            type: "login",
                        }))
                    }
                >
                    Log In
                </Text>
            </Flex>
        </form>
    );
};
export default SignUp;
