import {
    Community,
    CommunitySnippet,
    CommunityState,
    communityState,
} from "@/atoms/communitiesAtom";
import { useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/clientApp";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    writeBatch,
} from "firebase/firestore";
import { authModalState } from "@/atoms/authModalAtom";
import { useRouter } from "next/router";

type TUserCommunity = {
    communityStateValue: CommunityState;
    onJoinLeaveCommunity: (
        communityData: Community,
        isJoined: boolean
    ) => void;
    loading: boolean;
    error: string;
};

const useCommunityData = (): TUserCommunity => {
    const [user] = useAuthState(auth);
    const [communityStateValue, setCommunityStateValue] =
        useRecoilState(communityState);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const setAuthModalState = useSetRecoilState(authModalState);
    const router = useRouter();

    const getMySnippets = async () => {
        setLoading(true);
        try {
            const snippetDocs = await getDocs(
                collection(firestore, `users/${user?.uid}/communitySnippets`)
            );
            const snippets = snippetDocs.docs.map((doc) => ({
                ...doc.data(),
            }));

            setCommunityStateValue((prev) => ({
                ...prev,
                mySnippets: snippets as CommunitySnippet[],
                snippetsFetched: true,
            }));

        } catch (error: any) {
            console.log("getMySnippets error", error);
            setError(error.message);
        }
        setLoading(false);
    };

    const onJoinLeaveCommunity = (
        communityData: Community,
        isJoined: boolean
    ) => {
        if (!user) {
            setAuthModalState({ open: true, type: "login" });
            return;
        }

        setLoading(true);
        if (isJoined) {
            leaveCommunity(communityData.id);
            return;
        }
        joinCommunity(communityData);
    };

    const joinCommunity = async (communityData: Community) => {
        try {
            // batch write
            const batch = writeBatch(firestore);

            // creating a new community snippet
            const newSnippet: CommunitySnippet = {
                communityId: communityData.id,
                imageURL: communityData.imageURL || "",
                isModerator: user?.uid === communityData.creatorId,
            };

            batch.set(
                doc(
                    firestore,
                    `users/${user?.uid}/communitySnippets`,
                    communityData.id
                ),
                newSnippet
            );

            batch.update(doc(firestore, "communities", communityData.id), {
                numberOfMembers: increment(1), // increment(-1)
            });

            await batch.commit();

            setCommunityStateValue((prev) => ({
                ...prev,
                mySnippets: [...prev.mySnippets, newSnippet],
            }));
        } catch (error: any) {
            console.log("joinCommunity error", error);
            setError(error.message);
        }
        setLoading(false);
    };
    const leaveCommunity = async (communityId: string) => {
        try {
            // batch write
            const batch = writeBatch(firestore);

            batch.delete(
                doc(
                    firestore,
                    `users/${user?.uid}/communitySnippets`,
                    communityId
                )
            );

            batch.update(doc(firestore, "communities", communityId), {
                numberOfMembers: increment(-1),
            });

            await batch.commit();

            setCommunityStateValue((prev) => ({
                ...prev,
                mySnippets: prev.mySnippets.filter(
                    (item) => item.communityId !== communityId
                ),
            }));
        } catch (error: any) {
            console.log("leaveCommunity error", error);
            setError(error.message);
        }
        setLoading(false);
    };

    const getCommunityData = async (communityId: string) => {
        try {
            const communityDocRef = doc(firestore, "communities", communityId);
            const communityDoc = await getDoc(communityDocRef);

            setCommunityStateValue((prev) => ({
                ...prev,
                currentCommunity: {
                    id: communityDoc.id,
                    ...communityDoc.data(),
                } as Community,
            }));
        } catch (e: any) {
            console.log("getCommunityData error", e);
            setError(e.message);
        }
    };

    useEffect(() => {
        const { communityId } = router.query;
        if (communityId && !communityStateValue.currentCommunity) {
            getCommunityData(communityId as string);
        }
    }, [communityStateValue.currentCommunity, router.query]);

    useEffect(() => {
        if (!user) {
            setCommunityStateValue((prev) => ({
                ...prev,
                mySnippets: [],
                snippetsFetched: false,
            }));
            return;
        }
        getMySnippets();
    }, [user]);

    return {
        communityStateValue,
        onJoinLeaveCommunity,
        loading,
        error,
    };
};
export default useCommunityData;
