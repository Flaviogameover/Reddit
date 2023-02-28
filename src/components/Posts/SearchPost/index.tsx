import { Flex, Stack, Text, Image, Icon, Link, Button } from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { FaReddit } from "react-icons/fa";
import { Post } from "@/atoms/postsAtom";
import { useRouter } from "next/router";

type TSearchItem = {
    searchResult: Post;
    darkMode: boolean;
};

const SearchPost: React.FC<TSearchItem> = ({ searchResult, darkMode }) => {
    const router = useRouter();

    const handleClickPost = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        router.push(
            `/r/${searchResult.communityId}/comments/${searchResult.id}`
        );
    };

    const handleClickCommunity = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        router.push(`/r/${searchResult.communityId}`);
    };
    return (
        <Flex
            p={1}
            pr={3}
            bg={darkMode ? "dark_posts" : "white"}
            width={"100%"}
            border={"1px"}
            borderStyle={"solid"}
            borderColor={darkMode ? "dark_border" : "gray.300"}
            cursor={"pointer"}
            _hover={{
                borderColor: darkMode ? "dark_border_hover" : "gray.500",
            }}
            align={"center"}
            justify={"space-between"}
            onClick={handleClickPost}
        >
            <Stack spacing={1} p={"10px"}>
                <Flex direction={"column"} justify={"space-between"}>
                    <Stack spacing={4} direction={"row"} align="center">
                        <Stack spacing={1} direction={"row"} align={"center"}>
                            {" "}
                            {/*href={`/r/lisnks`} */}
                            {false ? (
                                <Image
                                    // src={post.communityImageURL}
                                    alt={"Community Image"}
                                    borderRadius={"full"}
                                    boxSize={"20px"}
                                    mr={1}
                                />
                            ) : (
                                <Icon
                                    as={FaReddit}
                                    fontSize={"18pt"}
                                    mr={1}
                                    bg={"white"} borderRadius={"full"}
                                    color={
                                        darkMode
                                            ? "brand.100"
                                            : "blue.500"
                                    }
                                />
                            )}
                            <Text
                                fontWeight={400}
                                fontSize={"9pt"}
                                color={darkMode ? "dark_text" : "gray.500"}
                                _hover={{
                                    textDecoration: "underline",
                                    color: "gray.700",
                                }}
                                onClick={handleClickCommunity}
                            >
                                {`r/${searchResult.communityId}`}
                                {" - "}
                            </Text>
                            <Text
                                fontWeight={400}
                                fontSize={"9pt"}
                                color={darkMode ? "dark_text" : "gray.500"}
                            >
                                {`Posted by u/${searchResult.creatorDisplayName}`}
                                {" - "}
                                {moment(
                                    new Date(
                                        searchResult.createdAt?.seconds * 1000
                                    )
                                ).fromNow()}
                            </Text>
                        </Stack>
                    </Stack>
                    <Text
                        pt={1}
                        fontWeight={700}
                        fontSize={"11pt"}
                        color={darkMode ? "dark_text" : "gray.500"}
                    >
                        {searchResult.title}
                    </Text>
                </Flex>
                <Stack
                    direction={"row"}
                    fontSize={"9pt"}
                    color={darkMode ? "dark_text" : "gray.500"}
                >
                    <Text>{searchResult.upvotes} upvotes</Text>
                    <Text>{searchResult.numberOfComments} comments</Text>
                </Stack>
            </Stack>
            {searchResult.imageURL && (
                <Image
                    src={searchResult.imageURL}
                    alt={"Post Image"}
                    borderRadius={4}
                    boxSize={"80px"}
                />
            )}
        </Flex>
    );
};
export default SearchPost;
