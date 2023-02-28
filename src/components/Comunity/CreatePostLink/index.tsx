import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import useDirectory from "@/hooks/useDirectory";
import { Flex, Icon, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsLink45Deg } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";
import { useSetRecoilState } from "recoil";

type TCreatePostLink = {
    darkMode: boolean;
};

const CreatePostLink: React.FC<TCreatePostLink> = ({ darkMode }) => {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const setAuthModalState = useSetRecoilState(authModalState);
    const { toggleMenuOpen } = useDirectory();
    const onClick = () => {
        if (!user) {
            setAuthModalState({
                open: true,
                type: "login",
            });
            return;
        }

        const { communityId } = router.query;
        if (communityId) {
            router.push(`/r/${communityId}/submit`);
            return;
        }
        toggleMenuOpen();
    };

    return (
        <Flex
            justify={"space-evenly"}
            align={"center"}
            bg={darkMode ? "dark_posts" : "white"}
            height={"56px"}
            borderRadius={4}
            border={"1px solid"}
            {...(darkMode && {
                borderColor: "dark_border_hover",
            })}
            p={2}
            mb={4}
        >
            <Icon as={FaReddit} fontSize={36} color={"gray.300"} mr={4} />
            <Input
                placeholder={"Create Post"}
                fontSize={"10pt"}
                _placeholder={{
                    color: darkMode ? "dark_text" : "gray.500",
                }}
                bg={darkMode ? "dark_posts_bright" : "gray.50"}
                color={darkMode ? "dark_text" : "gray.500"}
                border={"1px solid"}
                borderColor={darkMode ? "dark_border" : "gray.200"}
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
                height={"36px"}
                borderRadius={4}
                mr={4}
                onClick={onClick}
            />
            <Icon
                as={IoImageOutline}
                fontSize={24}
                mr={4}
                color={"gray.400"}
                cursor={"pointer"}
            />
            <Icon
                as={BsLink45Deg}
                fontSize={24}
                color={"gray.400"}
                cursor={"pointer"}
            />
        </Flex>
    );
};
export default CreatePostLink;
