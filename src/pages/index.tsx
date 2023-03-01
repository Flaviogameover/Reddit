import { darkModeState } from '@/atoms/darkmodeAtom';
import { Post, PostVote } from '@/atoms/postsAtom';
import CreatePostLink from '@/components/Comunity/CreatePostLink';
import PersonalHome from '@/components/Comunity/PersonalHome';
import Premium from '@/components/Comunity/Premium';
import Recommendations from '@/components/Comunity/Recommendations';
import PageContent from '@/components/Layout/PageContent';
import PostItem from '@/components/Posts/PostItem';
import PostLoader from '@/components/Posts/PostLoader';
import { auth, firestore } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import usePosts from '@/hooks/usePosts';
import { Button, Stack, Text } from '@chakra-ui/react';
import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';

const Home: NextPage = () => {
	const { darkMode } = useRecoilValue(darkModeState);
	const [user, loadingUser] = useAuthState(auth);
	const [loading, setLoading] = useState<boolean>(false);
	const { communityStateValue } = useCommunityData();
	const [loadMore, setLoadMore] = useState<boolean>(false);
	const {
		postStateValue,
		setPostStateValue,
		onVote,
		onDeletePost,
		onSelectPost,
	} = usePosts();
	const [page, setPage] = useState<number>(1);

	const buildUserHomeFeed = async () => {
		setLoading(true);

		try {
			if (communityStateValue.mySnippets.length) {
				const myCommunityIds = communityStateValue.mySnippets.map(
					(snippet) => snippet.communityId
				);
				const postQuery = query(
					collection(firestore, 'posts'),
					where('communityId', 'in', myCommunityIds),
					orderBy('createdAt', 'desc'),
					limit(5)
				);

				const postDocs = await getDocs(postQuery);
				const posts = postDocs.docs.map(
					(doc) =>
						({
							id: doc.id,
							...doc.data(),
						} as Post)
				);

				setPostStateValue((prev) => ({
					...prev,
					posts: posts as Post[],
				}));
			} else {
				buildNoUserHomeFeed();
			}
		} catch (e: any) {
			console.log('buildUserHomeFeed error: ', e.message);
		}
		setLoading(false);
	};

	const buildNoUserHomeFeed = async () => {
		setLoading(true);
		try {
			const postQuery = query(
				collection(firestore, 'posts'),
				where('privacyType', '==', 'public'),
				orderBy('upvotes', 'desc'),
				limit(10)
			);
			// filter posts only public
			// add pagination on scroll

			const postDocs = await getDocs(postQuery);
			const posts = postDocs.docs.map(
				(doc) =>
					({
						id: doc.id,
						...doc.data(),
					} as Post)
			);

			setPostStateValue((prev) => ({
				...prev,
				posts: posts as Post[],
			}));
		} catch (e: any) {
			console.log('buildNoUserHomeFeed error: ', e.message);
		}
		setLoading(false);
	};

	const getUserPostVotes = async () => {
		try {
			const postIds = postStateValue.posts.map((post) => post.id);
			const postVotesQuery = query(
				collection(firestore, `users/${user?.uid}/postVotes`),
				where('postId', 'in', postIds)
			);

			const postVotesDocs = await getDocs(postVotesQuery);
			const postVotes = postVotesDocs.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setPostStateValue((prev) => ({
				...prev,
				postVotes: postVotes as PostVote[],
			}));
		} catch (e: any) {
			console.log('getUserPostVotes error: ', e.message);
		}
	};

	const loadMorePosts = async () => {
		setLoadMore(true);
		try {
			if (communityStateValue.mySnippets.length) {
				const tilimt = 5 * (page + 1);
				const myCommunityIds = communityStateValue.mySnippets.map(
					(snippet) => snippet.communityId
				);
				const postQuery = query(
					collection(firestore, 'posts'),
					where('communityId', 'in', myCommunityIds),
					orderBy('createdAt', 'desc'),
					limit(tilimt)
				);
				const postDocs = await getDocs(postQuery);
				const posts = postDocs.docs.map(
					(doc) =>
						({
							id: doc.id,
							...doc.data(),
						} as Post)
				);

				setPostStateValue((prev) => ({
					...prev,
					posts: posts as Post[],
				}));
			} else {
				buildNoUserHomeFeed();
			}
		} catch (e: any) {
			console.log('buildUserHomeFeed error: ', e.message);
		}
		setPage(page + 1);
		setLoadMore(false);
	};

	useEffect(() => {
		if (communityStateValue.snippetsFetched) buildUserHomeFeed();
		return () => {
			setPostStateValue((prev) => ({
				...prev,
				posts: [],
			}));
		};
	}, [communityStateValue.snippetsFetched]);

	useEffect(() => {
		if (!user && !loadingUser) buildNoUserHomeFeed();

		return () => {
			setPostStateValue((prev) => ({
				...prev,
				posts: [],
			}));
		};
	}, [user, loadingUser]);

	useEffect(() => {
		if (user && postStateValue.posts.length) getUserPostVotes();

		// clean up function
		return () => {
			setPostStateValue((prev) => ({
				...prev,
				postVotes: [],
			}));
		};
	}, [user, postStateValue.posts]);

	return (
		<PageContent>
			<>
				<CreatePostLink darkMode={darkMode} />
				{loading ? (
					<PostLoader darkMode={darkMode} />
				) : !postStateValue.posts.length ? (
					<Text
						fontSize={'xl'}
						align="center"
						fontWeight={700}
						color={darkMode ? 'dark_text' : 'gray.500'}
					>
						No posts yet
					</Text>
				) : (
					<Stack>
						<>
							{postStateValue.posts.map((post, index) => (
								<PostItem
									key={`${post.id}-${index}`}
									post={post}
									onSelectPost={onSelectPost}
									onDeletePost={onDeletePost}
									onVote={onVote}
									userVoteValue={
										postStateValue.postVotes.find(
											(vote) => vote.postId === post.id
										)?.voteValue
									}
									userIsCreator={post.creatorId === user?.uid}
									homePage
									darkMode={darkMode}
								/>
							))}
							<Button
								variant={darkMode ? 'dark' : 'outline'}
								onClick={loadMorePosts}
								isLoading={loadMore}
							>
								Load More
							</Button>
						</>
					</Stack>
				)}
			</>
			<Stack spacing={5}>
				<Recommendations darkMode={darkMode} />
				<Premium darkMode={darkMode} />
				<PersonalHome darkMode={darkMode} />
			</Stack>
		</PageContent>
	);
};

export default Home;
