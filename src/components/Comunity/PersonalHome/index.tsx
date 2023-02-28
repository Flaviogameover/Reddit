import { communityModalState } from "@/atoms/communityModalAtom";
import { directoryMenuState } from "@/atoms/directoryMenuAtom";
import { Button, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { FaReddit } from "react-icons/fa";
import { useSetRecoilState } from "recoil";

type TPersonalHome = {darkMode: boolean;};

const PersonalHome: React.FC<TPersonalHome> = ({darkMode}) => {
    const setDirectoryState = useSetRecoilState(directoryMenuState);
    const setCommunityModal = useSetRecoilState(communityModalState);

    const handleClickPersonalPost = () => {
        scrollTo({
            top: 0,
            behavior: "smooth",
        });
        setDirectoryState((prev) => ({
            ...prev,
            isOpen: true,
        }));
    };

    return (
        <Flex
            direction="column"
            cursor="pointer"
            border="1px solid"
            position="sticky"
            bg={darkMode ? "dark_posts" : "white"}
            borderColor={darkMode ? "dark_border" : "gray.300"}
        >
            <Flex
                align="flex-end"
                color="white"
                p="6px 10px"
                bg="blue.500"
                height="34px"
                borderRadius="4px 4px 0px 0px"
                fontWeight={600}
                bgImage="url(/images/redditPersonalHome.png)"
                backgroundSize="cover"
            ></Flex>
            <Flex direction="column" p="12px">
                <Flex align="center" mb={2}>
                    <Icon
                        as={FaReddit}
                        fontSize={50}
                        color="brand.100"
                    bg={"white"} borderRadius={"full"}
                    mr={2}
                    />
                    <Text {...(darkMode && {
                            color: "dark_text",
                        })} fontWeight={600}>Home</Text>
                </Flex>
                <Stack spacing={3}>
                    <Text {...(darkMode && {
                            color: "dark_text",
                        })} fontSize="9pt">
                        Your personal Reddit frontpage, built for you.
                    </Text>
                    <Button onClick={handleClickPersonalPost} height="30px" {...(darkMode && {
                            variant: "dark_selected",
                        })}>
                        Create Post
                    </Button>
                    <Button
                        onClick={() =>
                            setCommunityModal({
                                open: true,
                            })
                        }
                        variant={darkMode ? "dark" : "outline"}
                        height="30px"
                    >
                        Create Community
                    </Button>
                </Stack>
            </Flex>
        </Flex>
    );
};
export default PersonalHome;
