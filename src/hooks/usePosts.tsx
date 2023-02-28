import { Post, postState, PostVote } from "@/atoms/postsAtom";
import { auth, firestore, storage } from "@/firebase/clientApp";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect } from "react";
import { communityState } from "@/atoms/communitiesAtom";
import { authModalState } from "@/atoms/authModalAtom";
import { useRouter } from "next/router";

const usePosts = () => {
    const [postStateValue, setPostStateValue] = useRecoilState(postState);
    const [user] = useAuthState(auth);
    const { currentCommunity } = useRecoilValue(communityState);
    const setAuthModalState = useSetRecoilState(authModalState);
    const router = useRouter();
    // const currentCommunity = useRecoilValue(communityState).currentCommunity;

    const onVote = async (e:React.MouseEvent<SVGElement,MouseEvent>,post: Post, vote: number, communityId: string) => {
        e.stopPropagation();
        //  check if user is logged in
        if (!user?.uid) {
            setAuthModalState({
                open: true,
                type: "login",
            });
            return;
        }
        try {
            const { upvotes } = post;
            const existingVote = postStateValue.postVotes.find(
                (vote) => vote.postId === post.id
            );
            const batch = writeBatch(firestore);
            const updatedPost = { ...post };
            const updatedPosts = [...postStateValue.posts];
            let updatedPostVotes = [...postStateValue.postVotes];
            let voteChange = vote;

            // new vote
            if (!existingVote) {
                // create a new post vote document
                const postVoteRef = doc(
                    collection(firestore, "users", `${user?.uid}/postVotes`)
                );

                const newVote: PostVote = {
                    id: postVoteRef.id,
                    postId: post.id!,
                    communityId,
                    voteValue: vote, // 1 or -1
                };

                batch.set(postVoteRef, newVote);

                // add/subtract vote from post

                updatedPost.upvotes = upvotes + vote;
                updatedPostVotes = [...updatedPostVotes, newVote];
            } else {
                const postVoteRef = doc(
                    firestore,
                    "users",
                    `${user?.uid}/postVotes/${existingVote.id}`
                );
                console.log("bug aqui");
                if (existingVote.voteValue === vote) {
                    updatedPost.upvotes = upvotes - vote;
                    updatedPostVotes = updatedPostVotes.filter(
                        (vote) => vote.postId !== post.id
                    );

                    batch.delete(postVoteRef);
                    voteChange *= -vote;
                } else {
                    updatedPost.upvotes = upvotes + 2 * vote;
                    const voteIdx = updatedPostVotes.findIndex(
                        (vote) => vote.id === existingVote.id
                    );
                    updatedPostVotes[voteIdx] = {
                        ...existingVote,
                        voteValue: vote,
                    };

                    batch.update(postVoteRef, {
                        voteValue: vote,
                    });

                    voteChange = 2 * vote;
                }
            }

            const postIdx = postStateValue.posts.findIndex(
                (item) => item.id === post.id
            );
            updatedPosts[postIdx] = updatedPost;
            setPostStateValue((prev) => ({
                ...prev,
                posts: updatedPosts,
                postVotes: updatedPostVotes,
            }));

            if(postStateValue.selectedPost){
                setPostStateValue((prev) => ({
                    ...prev,
                    selectedPost: updatedPost,
                }));
            }

            const postRef = doc(firestore, "posts", post.id!);
            batch.update(postRef, {
                upvotes: upvotes + voteChange,
            });

            await batch.commit();
        } catch (e: any) {
            console.log("onVote error: ", e.message);
        }
    };

    const onSelectPost = (post:Post) => {
        setPostStateValue((prev) => ({
            ...prev,
            selectedPost: post,
        }));

        router.push(`/r/${post.communityId}/comments/${post.id}`);
    };

    const onDeletePost = async (post: Post): Promise<boolean> => {
        try {
            // check if image exists and delete it
            if (post.imageURL) {
                const imageRef = ref(storage, `posts/${post.id}/image`);
                await deleteObject(imageRef);
            }
            // delete post document from firestore
            const postDocRef = doc(firestore, "posts", post.id!);
            await deleteDoc(postDocRef);

            // update recoil state
            setPostStateValue((prev) => ({
                ...prev,
                posts: prev.posts.filter((item) => item.id !== post.id),
            }));
            return true;
        } catch (e: any) {
            return false;
        }
    };

    const getCommunityPostVotes = async (communityId: string) => {
        const postVotesQuery = query(
            collection(firestore, "users", `${user?.uid}/postVotes`),
            where("communityId", "==", communityId)
        );

        const postVoteDocs = await getDocs(postVotesQuery);
        const postVotes = postVoteDocs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setPostStateValue((prev) => ({
            ...prev,
            postVotes: postVotes as PostVote[],
        }));
    };

    useEffect(() => {
        if (!currentCommunity) return;
        if (!user) return;
        getCommunityPostVotes(currentCommunity!.id);
    }, [user, currentCommunity]);

    useEffect(() => {
        if(!user){
            setPostStateValue(prev=>({
                ...prev,
                postVotes: [],
            }));
        }
    }, [user]);

    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost,
    };
};
export default usePosts;
