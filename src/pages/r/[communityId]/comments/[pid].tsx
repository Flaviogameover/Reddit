import { Post } from "@/atoms/postsAtom";
import About from "@/components/Comunity/About";
import PageContent from "@/components/Layout/PageContent";
import Comments from "@/components/Posts/Comments";
import PostItem from "@/components/Posts/PostItem";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import useCommunityData from "@/hooks/useCommunityData";
import { NextPage } from "next/types";
import PostLoader from "@/components/Posts/PostLoader";
import { Stack, SkeletonText, Skeleton, Box } from "@chakra-ui/react";
import CommunityNotFound from "@/components/Comunity/NotFound";
import { useRecoilValue } from 'recoil';
import { darkModeState } from '@/atoms/darkmodeAtom';

const PostPage: NextPage = () => {
    const {darkMode} = useRecoilValue(darkModeState);
    const [user] = useAuthState(auth);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [notFound, setNotFound] = React.useState<boolean>(false);
    const { postStateValue, setPostStateValue, onDeletePost, onVote } =
        usePosts();
    const { communityStateValue } = useCommunityData();
    const router = useRouter();

    const fetchData = async (postId: string) => {
        setLoading(true);
        setNotFound(false);
        try {
            const postDocRef = doc(firestore, "posts", postId);
            const postDoc = await getDoc(postDocRef);
            console.log(
                "postDoc: ",
                postDoc,
                postStateValue.selectedPost?.id,
                postDoc.data()
            );
            if (!postDoc.exists()) {
                setNotFound(true);
                setLoading(false);
                return;
            }
            setPostStateValue((prev) => ({
                ...prev,
                selectedPost: {
                    ...postDoc.data(),
                    id: postId,
                } as Post,
            }));
        } catch (e: any) {
            console.log("fetchDataPidError: ", e.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        const { pid } = router.query;
        if (pid && !postStateValue.selectedPost) {
            fetchData(pid as string);
            console.log("aqui esta meu pid", router.query?.pid);
        }
    }, [router.query, postStateValue.selectedPost]);
    return (
        <PageContent>
            <>
                {loading ? (
                    <Stack
                    spacing={6}
                >
                    <Box
                        padding={"10px"} boxShadow={"lg"} bg={darkMode ? "dark_posts" : "white"} borderRadius={4}
                    >
                        <SkeletonText mt={"4"} noOfLines={1} width={"40%"} spacing={"4"}/>
                        <SkeletonText mt={"4"} noOfLines={4} spacing={"4"}/>
                        <Skeleton mt={"4"} height={"200px"}/>
                    </Box>
                </Stack>
                ) : notFound ? (
                    <CommunityNotFound darkMode={darkMode} />
                ) : (
                    <>
                        {postStateValue.selectedPost && (
                            <PostItem
                                post={postStateValue.selectedPost}
                                onVote={onVote}
                                onDeletePost={onDeletePost}
                                userVoteValue={
                                    postStateValue.postVotes.find(
                                        (item) =>
                                            item.postId ===
                                            postStateValue.selectedPost?.id
                                    )?.voteValue
                                }
                                userIsCreator={
                                    user?.uid ===
                                    postStateValue.selectedPost?.creatorId
                                }
                                darkMode={darkMode}
                            />
                        )}
                        <Comments
                            user={user as User}
                            selectedPost={postStateValue.selectedPost}
                            communityId={
                                postStateValue.selectedPost?.creatorId as string
                            }
                            darkMode={darkMode}
                        />
                    </>
                )}
            </>
            <>
                {communityStateValue.currentCommunity && (
                    <About
                        communityData={communityStateValue.currentCommunity}
                    />
                )}
            </>
        </PageContent>
    );
};
export default PostPage;
