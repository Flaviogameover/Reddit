import { Button, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import React, { useState } from "react";

type TTextInputs = {
    textInputs: {
        title: string;
        body: string;
    };
    setTextInputs: (textInputs: { title: string; body: string }) => void;
    // onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleCreatePost: () => void;
    loading: boolean;
    darkMode: boolean;
};

const TextInputs: React.FC<TTextInputs> = ({
    textInputs,
    setTextInputs,
    loading,
    handleCreatePost,
    darkMode,
}) => {
    return (
        <Stack spacing={3} width={"100%"}>
            <Input
                name={"title"}
                value={textInputs.title}
                onChange={(e) => {
                    setTextInputs({
                        ...textInputs,
                        [e.target.name]: e.target.value,
                    });
                }}
                fontSize={"10pt"}
                borderRadius={4}
                placeholder={"Title"}
                {...(darkMode && {
                    color: "dark_text",
                })}
                _placeholder={{ color: darkMode ? "dark_text" : "gray.500" }}
                _focus={{
                    outline: "none",
                    bg: darkMode ? "dark_posts_bright" : "white",
                    border: "1px solid",
                    borderColor: darkMode ? "dark_border" : "black",
                }}
            />
            <Textarea
                name={"body"}
                fontSize={"10pt"}
                value={textInputs.body}
                {...(darkMode && {
                    color: "dark_text",
                })}
                onChange={(e) => {
                    setTextInputs({
                        ...textInputs,
                        [e.target.name]: e.target.value,
                    });
                }}
                borderRadius={4}
                height={"100px"}
                placeholder={"Text (optional)"}
                _placeholder={{ color: darkMode ? "dark_text" : "gray.500" }}
                _focus={{
                    outline: "none",
                    bg: darkMode ? "dark_posts_bright" : "white",
                    border: "1px solid",
                    borderColor: darkMode ? "dark_border" : "black",
                }}
            />
            <Flex justify={"flex-end"}>
                <Button
                    {...(darkMode && {
                        variant: "dark",
                    })}
                    height={"34px"}
                    padding={"0 30px"}
                    disabled={!textInputs.title}
                    isLoading={loading}
                    onClick={handleCreatePost}
                >
                    Post
                </Button>
            </Flex>
        </Stack>
    );
};

export default TextInputs;
