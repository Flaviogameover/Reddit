import { Timestamp } from 'firebase/firestore';
import { atom } from 'recoil';

export type Post = {
	id?: string;
	creatorId: string;
	communityId: string;
	creatorDisplayName: string;
	title: string;
	body: string;
	upvotes: number;
	imageURL?: string;
	createdAt: Timestamp;
	numberOfComments: number;
	communityImageURL?: string;
	privacyType?: 'public' | 'private' | 'restricted';
};

export type PostVote = {
	id: string;
	postId: string;
	communityId: string;
	voteValue: number;
};

interface PostState {
	selectedPost: Post | null;
	posts: Post[];
	postVotes: PostVote[];
}

const defaultPostState: PostState = {
	selectedPost: null,
	posts: [],
	postVotes: [],
};

export const postState = atom<PostState>({
	key: 'postState',
	default: defaultPostState,
});
