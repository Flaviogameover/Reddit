import { Post } from "@/atoms/postsAtom";
import {
    Alert,
    AlertIcon,
    Flex,
    Icon,
    Image,
    Link,
    Skeleton,
    Spinner,
    Stack,
    Text,
} from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import {
    IoArrowDownCircleOutline,
    IoArrowDownCircleSharp,
    IoArrowRedoOutline,
    IoArrowUpCircleOutline,
    IoArrowUpCircleSharp,
} from "react-icons/io5";

type TPostItem = {
    post: Post;
    userIsCreator: boolean;
    userVoteValue?: number;
    onVote: (
        e: React.MouseEvent<SVGElement, MouseEvent>,
        post: Post,
        vote: number,
        communityId: string
    ) => void;
    // javascript async functions can only return Promise values
    onDeletePost: (post: Post) => Promise<boolean>;
    onSelectPost?: (post: Post) => void;
    homePage?: boolean;
    darkMode: boolean;
};

const PostItem: React.FC<TPostItem> = ({
    post,
    userIsCreator,
    userVoteValue,
    onVote,
    onDeletePost,
    onSelectPost,
    homePage,
    darkMode,
}) => {
    const [loadingImage, setLoadingImage] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const singlePostPage = !onSelectPost;
    const router = useRouter();
    const handleDelete = async (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.stopPropagation();
        setLoadingDelete(true);
        try {
            const success = await onDeletePost(post);

            if (!success) throw new Error("Failed to delete post");
            if (singlePostPage) {
                router.push(`/r/${post.communityId}`);
            }
        } catch (e: any) {
            setError(e.message);
        }
        setLoadingDelete(false);
    };

    return (
        <Flex
            bg={darkMode ? "dark_posts" : "white"}
            border={"1px solid"}
            borderColor={
                darkMode
                    ? "dark_border"
                    : singlePostPage
                    ? "gray.200"
                    : "gray.300"
            }
            borderRadius={singlePostPage ? "4px 4px 0 0" : "4px"}
            _hover={{
                borderColor: singlePostPage
                    ? "none"
                    : darkMode
                    ? "dark_border_hover"
                    : "gray.500",
            }}
            cursor={singlePostPage ? "unset" : "pointer"}
            onClick={() => onSelectPost && onSelectPost(post)}
        >
            <Flex
                direction={"column"}
                align={"center"}
                bg={
                    darkMode
                        ? "dark_posts_dark"
                        : singlePostPage
                        ? "none"
                        : "gray.100"
                }
                p={2}
                width={"40px"}
                borderRadius={singlePostPage ? "0" : "3px 0 0 3px"}
            >
                <Icon
                    as={
                        userVoteValue === 1
                            ? IoArrowUpCircleSharp
                            : IoArrowUpCircleOutline
                    }
                    color={userVoteValue === 1 ? "brand.100" : "gray.400"}
                    fontSize={22}
                    onClick={(e) => onVote(e, post, 1, post.communityId)}
                    cursor={"pointer"}
                />
                <Text
                    {...(darkMode && { color: "dark_text" })}
                    fontSize={"9pt"}
                >
                    {post.upvotes}
                </Text>
                <Icon
                    as={
                        userVoteValue === -1
                            ? IoArrowDownCircleSharp
                            : IoArrowDownCircleOutline
                    }
                    color={userVoteValue === -1 ? "#4379ff" : "gray.400"}
                    fontSize={22}
                    onClick={(e) => onVote(e, post, -1, post.communityId)}
                    cursor={"pointer"}
                />
            </Flex>
            <Flex direction={"column"} width={"100%"}>
                {error && (
                    <Alert status="error">
                        <AlertIcon />
                        <Text mr={2}>{error}</Text>
                    </Alert>
                )}
                <Stack spacing={1} p={"10px"}>
                    <Stack
                        direction={"row"}
                        spacing={0.6}
                        align={"center"}
                        fontSize={"9pt"}
                    >
                        {homePage && (
                            <>
                                {post.communityImageURL ? (
                                    <Image
                                        src={post.communityImageURL}
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
                                        bg={"white"}
                                        borderRadius={"full"}
                                        color={
                                            darkMode ? "brand.100" : "blue.500"
                                        }
                                    />
                                )}
                                <Link href={`/r/${post.communityId}`}>
                                    <Text
                                        fontWeight={700}
                                        {...(darkMode && {
                                            color: "dark_text",
                                        })}
                                        _hover={{ textDecoration: "underline" }}
                                        onClick={(e) => e.stopPropagation()}
                                    >{`r/${post.communityId}`}</Text>
                                </Link>
                                <Icon
                                    as={BsDot}
                                    color={"gray.500"}
                                    fontSize={8}
                                />
                            </>
                        )}
                        <Text {...(darkMode && { color: "dark_text" })}>
                            Posted by u/{post.creatorDisplayName}{" "}
                            {moment(
                                new Date(post.createdAt?.seconds * 1000)
                            ).fromNow()}
                        </Text>
                    </Stack>
                    <Text
                        {...(darkMode && { color: "dark_text" })}
                        fontSize={"12pt"}
                        fontWeight={600}
                    >
                        {post.title}
                    </Text>
                    <Text
                        {...(darkMode && { color: "dark_text" })}
                        fontSize={"10pt"}
                    >
                        {post.body}
                    </Text>
                    {post.imageURL && (
                        <Flex justify={"center"} align={"center"} p={2}>
                            {loadingImage && (
                                <Skeleton
                                    height={"200px"}
                                    width={"100%"}
                                    borderRadius={4}
                                />
                            )}
                            <Image
                                src={post.imageURL}
                                maxHeight={"460px"}
                                alt={"Post Image"}
                                display={loadingImage ? "none" : "unset"}
                                onLoad={() => setLoadingImage(false)}
                            />
                        </Flex>
                    )}
                </Stack>
                <Flex ml={1} mb={0.5} color={"gray.500"} fontWeight={600}>
                    <Flex
                        align={"center"}
                        p={"8px 10px"}
                        borderRadius={4}
                        _hover={{ bg: darkMode ? "dark_border" : "gray.200" }}
                        {...(darkMode && { color: "dark_text" })}
                        cursor={"pointer"}
                    >
                        <Icon
                            {...(darkMode && { color: "dark_text" })}
                            as={BsChat}
                            mr={2}
                        />
                        <Text
                            {...(darkMode && { color: "dark_text" })}
                            fontSize={"9pt"}
                        >
                            {post.numberOfComments}
                        </Text>
                    </Flex>
                    <Flex
                        align={"center"}
                        p={"8px 10px"}
                        borderRadius={4}
                        _hover={{ bg: darkMode ? "dark_border" : "gray.200" }}
                        {...(darkMode && { color: "dark_text" })}
                        cursor={"pointer"}
                    >
                        <Icon
                            {...(darkMode && { color: "dark_text" })}
                            as={IoArrowRedoOutline}
                            mr={2}
                        />
                        <Text
                            {...(darkMode && { color: "dark_text" })}
                            fontSize={"9pt"}
                        >
                            Share
                        </Text>
                    </Flex>
                    <Flex
                        align={"center"}
                        p={"8px 10px"}
                        borderRadius={4}
                        _hover={{ bg: darkMode ? "dark_border" : "gray.200" }}
                        {...(darkMode && { color: "dark_text" })}
                        cursor={"pointer"}
                    >
                        <Icon as={BsChat} mr={2} />
                        <Text fontSize={"9pt"}>Save</Text>
                    </Flex>
                    {userIsCreator && (
                        <Flex
                            align={"center"}
                            p={"8px 10px"}
                            borderRadius={4}
                            _hover={{
                                bg: darkMode ? "dark_border" : "gray.200",
                            }}
                            {...(darkMode && { color: "dark_text" })}
                            cursor={"pointer"}
                            onClick={handleDelete}
                        >
                            {loadingDelete ? (
                                <Spinner size={"sm"} />
                            ) : (
                                <>
                                    <Icon
                                        {...(darkMode && {
                                            color: "dark_text",
                                        })}
                                        as={AiOutlineDelete}
                                        mr={2}
                                    />
                                    <Text
                                        {...(darkMode && {
                                            color: "dark_text",
                                        })}
                                        fontSize={"9pt"}
                                    >
                                        Delete
                                    </Text>
                                </>
                            )}
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};
export default PostItem;
