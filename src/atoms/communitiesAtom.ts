import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface Community {
    id: string;
    creatorId: string;
    numberOfMembers: number;
    privacyType: "public" | "private" | "restricted";
    createdAt?: Timestamp;
    imageURL?: string;
    banner?: string;
}
 
export interface CommunitySnippet{
    communityId: string;
    isModerator?: boolean;
    imageURL?: string;
}

export interface CommunityState{
    mySnippets: CommunitySnippet[];
    currentCommunity?: Community;
    snippetsFetched: boolean;
}

const defaultCommunityState: CommunityState = {
    mySnippets: [],
    snippetsFetched: false,
};

export const communityState = atom<CommunityState>({
    key: "communitiesState",
    default: defaultCommunityState,
});