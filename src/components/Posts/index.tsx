import { Community } from "@/atoms/communitiesAtom";
import { Post } from "@/atoms/postsAtom";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { Button, Stack, Text } from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";

type TPosts = {
    communityData: Community;
    darkMode: boolean;
};

const Posts: React.FC<TPosts> = ({ communityData, darkMode }) => {
    const [user] = useAuthState(auth);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadMore, setLoadMore] = useState<boolean>(false);
    const {
        postStateValue,
        setPostStateValue,
        onDeletePost,
        onSelectPost,
        onVote,
    } = usePosts();

    const getPosts = async () => {
        setLoading(true);
        try {
            const postsQuery = query(
                collection(firestore, "posts"),
                where("communityId", "==", communityData.id),
                orderBy("createdAt", "desc"),
                startAfter(communityData.createdAt),
                limit(5),
            );

            const postDocs = await getDocs(postsQuery);
            const posts = postDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPostStateValue((prev) => ({
                ...prev,
                posts: posts as Post[],
            }));

        } catch (e: any) {
            console.log("GetPosts Error: ", e.message);
        }
        setLoading(false);
    };

    const loadMorePosts = async () => {
        setLoadMore(true);
        try {
            const postsQuery = query(
                collection(firestore, "posts"),
                where("communityId", "==", communityData.id),
                orderBy("createdAt", "desc"),
                startAfter(communityData.createdAt),
                limit(5 * (page + 1)),
            );

            const postDocs = await getDocs(postsQuery);
            const posts = postDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPostStateValue((prev) => ({
                ...prev,
                posts: posts as Post[],
            }));

        } catch (e: any) {
            console.log("GetPosts Error: ", e.message);
        }
        setPage(page + 1);
        setLoadMore(false);
    };

    useEffect(() => {
        getPosts();
    }, [communityData]);

    return (
        <>
            {loading ? (
                <PostLoader darkMode={darkMode}/>
            ) : !postStateValue.posts.length ? (
                <Text fontSize={"xl"} fontWeight={700} color={"gray.500"}>
                    No posts yet
                </Text>
            ) : (
                <Stack>
                    <>
                    {postStateValue.posts.map((post) => (
                        <PostItem
                            key={post.id}
                            post={post}
                            userIsCreator={user?.uid === post.creatorId}
                            userVoteValue={
                                postStateValue.postVotes.find(
                                    (vote) => vote.postId === post.id
                                )?.voteValue
                            }
                            onVote={onVote}
                            onDeletePost={onDeletePost}
                            onSelectPost={onSelectPost}
                            darkMode={darkMode}
                        />
                    ))}
                    <Button variant={darkMode ? "dark" : "outline"} onClick={loadMorePosts} isLoading={loadMore}>Load More</Button>
                    </>
                </Stack>
            )}
        </>
    );
};
export default Posts;
