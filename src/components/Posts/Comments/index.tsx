import { Post, postState } from "@/atoms/postsAtom";
import { firestore } from "@/firebase/clientApp";
import {
    Box,
    Flex,
    SkeletonCircle,
    SkeletonText,
    Stack,
    Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
    collection,
    doc,
    getDocs,
    increment,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    where,
    writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import CommentInput from "./CommentInput";
import CommentItem, { TComment } from "./CommentItem";

type TComments = {
    user: User;
    selectedPost: Post | null;
    communityId: string;
    darkMode: boolean;
};

const Comments: React.FC<TComments> = ({
    user,
    selectedPost,
    communityId,
    darkMode,
}) => {
    const [commentText, setCommentText] = useState<string>("");
    const [comments, setComments] = useState<TComment[]>([]);
    const [fetchLoading, setFetchLoading] = useState<boolean>(true);
    const [createLoading, setCreateLoading] = useState<boolean>(false);
    const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
    const setPostState = useSetRecoilState(postState);

    const onCreateComment = async () => {
        setCreateLoading(true);
        try {
            const batch = writeBatch(firestore);

            const commentDocRef = doc(collection(firestore, "comments"));

            const newComment: TComment = {
                id: commentDocRef.id,
                creatorId: user.uid,
                creatorDisplayText: user.email!.split("@")[0],
                communityId,
                postId: selectedPost?.id!,
                postTitle: selectedPost?.title!,
                text: commentText,
                createdAt: serverTimestamp() as Timestamp,
            };

            batch.set(commentDocRef, newComment);

            newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

            const postDocRef = doc(firestore, "posts", selectedPost?.id!);
            batch.update(postDocRef, {
                numberOfComments: increment(1),
            });

            await batch.commit();

            setCommentText("");
            setComments((prev) => [newComment, ...prev]);
            setPostState((prev) => ({
                ...prev,
                selectedPost: {
                    ...prev.selectedPost,
                    numberOfComments: prev.selectedPost?.numberOfComments! + 1,
                } as Post,
            }));
        } catch (e: any) {
            console.log("onCreateCommentError: ", e.message);
        }
        setCreateLoading(false);
    };

    const onDeleteComment = async (comment: TComment) => {
        setLoadingDeleteId(comment.id);
        try {
            const batch = writeBatch(firestore);

            // delete comment document
            const commentDocRef = doc(firestore, "comments", comment.id);
            batch.delete(commentDocRef);

            // update post numberOfComments -1
            const postDocRef = doc(firestore, "posts", selectedPost?.id!);
            batch.update(postDocRef, {
                numberOfComments: increment(-1),
            });

            await batch.commit();

            // update client recoil state
            setPostState((prev) => ({
                ...prev,
                selectedPost: {
                    ...prev.selectedPost,
                    numberOfComments: prev.selectedPost?.numberOfComments! - 1,
                } as Post,
            }));

            setComments((prev) => prev.filter((c) => c.id !== comment.id));
        } catch (e: any) {
            console.log("onDeleteCommentError: ", e.message);
        }
        setLoadingDeleteId(null);
    };

    const getPostComments = async () => {
        try {
            const commentQuery = query(
                collection(firestore, "comments"),
                where("postId", "==", selectedPost?.id),
                orderBy("createdAt", "desc")
            );
            const commentDocs = await getDocs(commentQuery);
            const comments = commentDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setComments(comments as TComment[]);
        } catch (e: any) {
            console.log("getPostCommentsError: ", e.message);
        }
        setFetchLoading(false);
    };

    useEffect(() => {
        if (!selectedPost) return;
        getPostComments();
    }, [selectedPost]);
    return (
        <Box
            bg={darkMode ? "dark_posts_dark" : "white"}
            borderRadius={"0 0 4px 4px"}
            p={2}
        >
            <Flex
                direction={"column"}
                pl={10}
                pr={4}
                mb={6}
                fontSize={"10pt"}
                width={"100%"}
            >
                <CommentInput
                    commentText={commentText}
                    setCommentText={setCommentText}
                    user={user}
                    createLoading={createLoading}
                    onCreateComment={onCreateComment}
                    darkMode={darkMode}
                />
            </Flex>
            <Stack spacing={6} p={2}>
                {fetchLoading ? (
                    <>
                        {[0, 1, 2].map((i) => (
                            <Box
                                key={i}
                                padding={"6px"}
                                bg={darkMode ? "dark_posts_dark" : "white"}
                            >
                                <SkeletonCircle size={"10"} />
                                <SkeletonText
                                    mt={4}
                                    noOfLines={2}
                                    spacing={4}
                                />
                            </Box>
                        ))}
                    </>
                ) : (
                    <>
                        {comments.length === 0 ? (
                            <Flex
                                direction={"column"}
                                justify={"center"}
                                align={"center"}
                                borderTop={"1px solid"}
                                borderColor={"gray.100"}
                                p={20}
                            >
                                <Text
                                    {...(darkMode && { color: "dark_text" })}
                                    fontWeight={700}
                                    opacity={0.3}
                                >
                                    No comments yet
                                </Text>
                            </Flex>
                        ) : (
                            <>
                                {comments.map((comment) => (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        onDeleteComment={onDeleteComment}
                                        loadingDelete={
                                            loadingDeleteId === comment.id
                                        }
                                        userId={user.uid}
                                        darkMode={darkMode}
                                    />
                                ))}
                            </>
                        )}
                    </>
                )}
            </Stack>
        </Box>
    );
};
export default Comments;
