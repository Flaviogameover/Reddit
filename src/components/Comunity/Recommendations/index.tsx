import { Community } from '@/atoms/communitiesAtom';
import { auth, firestore } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import {
	Box,
	Button,
	Flex,
	Icon,
	Image,
	Skeleton,
	SkeletonCircle,
	Stack,
	Text,
} from '@chakra-ui/react';
import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaReddit } from 'react-icons/fa';

type TRecommendations = {
	darkMode: boolean;
};

const Recommendations: React.FC<TRecommendations> = ({ darkMode }) => {
	const [user] = useAuthState(auth);
	const [communities, setCommunities] = useState<Community[]>([]);
	const [loadingCommunities, setLoading] = useState<boolean>(false);
	const { communityStateValue, onJoinLeaveCommunity, loading } =
		useCommunityData();
	const router = useRouter();

	const getCommunityRecommendations = async () => {
		setLoading(true);
		try {
			const communityQuery = user
				? query(
						query(
							collection(firestore, 'communities'),
							orderBy('numberOfMembers', 'desc'),
							limit(5)
						)
				  )
				: query(
						collection(firestore, 'communities'),
						where('privacyType', '==', 'public'),
						orderBy('numberOfMembers', 'desc'),
						limit(5)
				  );
			const communityDocs = await getDocs(communityQuery);
			const communities = communityDocs.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setCommunities(communities as Community[]);
		} catch (e: any) {
			console.log('getCommunityRecommendations error: ', e.message);
		}

		setLoading(false);
	};
	// div on click type

	const handleJoinLeaveCommunity = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		item: Community,
		isJoined: boolean
	) => {
		e.stopPropagation();
		onJoinLeaveCommunity(item, isJoined);
	};

	useEffect(() => {
		getCommunityRecommendations();
	}, [user]);

	return (
		<Flex
			direction={'column'}
			bg={darkMode ? 'dark_posts' : 'white'}
			borderRadius={4}
			border={'1px solid'}
			borderColor={darkMode ? 'dark_border' : 'gray.300'}
		>
			<Flex
				align={'flex-end'}
				color={'white'}
				p={'6px 10px'}
				height={'70px'}
				borderRadius={'4px 4px 0 0'}
				fontWeight={700}
				bgImage={'url(/images/recCommsArt.png)'}
				backgroundSize={'cover'}
				bgGradient={
					'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.75)), url(/images/recCommsArt.png)'
				}
			>
				Top Communities
			</Flex>
			<Flex direction={'column'}>
				{loadingCommunities ? (
					<Stack mt={2} p={3}>
						<Flex justify={'space-between'} align={'center'}>
							<SkeletonCircle size={'10'} />
							<Skeleton height={'10px'} width={'70%'} />
						</Flex>
						<Flex justify={'space-between'} align={'center'}>
							<SkeletonCircle size={'10'} />
							<Skeleton height={'10px'} width={'70%'} />
						</Flex>
						<Flex justify={'space-between'} align={'center'}>
							<SkeletonCircle size={'10'} />
							<Skeleton height={'10px'} width={'70%'} />
						</Flex>
					</Stack>
				) : (
					<>
						{communities.map((item, index) => {
							const isJoined =
								!!communityStateValue.mySnippets.find(
									(snippet) => snippet.communityId === item.id
								);

							return (
								<div
									onClick={() => router.push(`/r/${item.id}`)}
									key={item.id}
									style={{
										cursor: 'pointer',
									}}
								>
									<Flex
										position="relative"
										align="center"
										fontSize="10pt"
										borderBottom="1px solid"
										borderColor="gray.200"
										p="10px 12px"
										fontWeight={600}
									>
										<Flex width="80%" align="center">
											<Flex width="15%">
												<Text
													{...(darkMode && {
														color: 'dark_text',
													})}
													mr={2}
												>
													{index + 1}
												</Text>
											</Flex>
											<Flex
												align="center"
												width="80%"
												{...(darkMode && {
													color: 'dark_text',
												})}
											>
												{item.imageURL ? (
													<Image
														borderRadius="full"
														boxSize="28px"
														src={item.imageURL}
														mr={2}
													/>
												) : (
													<Icon
														as={FaReddit}
														fontSize={30}
														color="brand.100"
														bg={'white'}
														borderRadius={'full'}
														mr={2}
													/>
												)}
												<span
													style={{
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow:
															'ellipsis',
													}}
												>{`r/${item.id}`}</span>
											</Flex>
										</Flex>
										<Box position="absolute" right="10px">
											<Button
												height="22px"
												fontSize="8pt"
												onClick={(
													e: React.MouseEvent<
														HTMLButtonElement,
														MouseEvent
													>
												) =>
													handleJoinLeaveCommunity(
														e,
														item,
														isJoined
													)
												}
												variant={
													isJoined
														? darkMode
															? 'dark'
															: 'outline'
														: darkMode
														? 'dark_selected'
														: 'solid'
												}
												isLoading={loading}
											>
												{isJoined ? 'Joined' : 'Join'}
											</Button>
										</Box>
									</Flex>
								</div>
							);
						})}
						<Box p="10px 20px">
							<Button
								height={'30px'}
								width={'100%'}
								{...(darkMode && {
									variant: 'dark_selected',
								})}
							>
								View all
							</Button>
						</Box>
					</>
				)}
			</Flex>
		</Flex>
	);
};
export default Recommendations;
