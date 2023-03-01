import { communityState } from '@/atoms/communitiesAtom';
import { communityModalState } from '@/atoms/communityModalAtom';
import CreateCommunityModal from '@/components/Modal/CreateCommunityModal';
import MenuListItem from '@navbar/Directory/MenuListItem';
import { Box, Flex, Icon, MenuItem, Text } from '@chakra-ui/react';
import React from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
import { FaReddit } from 'react-icons/fa';
import { useRecoilValue, useSetRecoilState } from 'recoil';

type TCommunities = {
	darkMode: boolean;
};

const Communities: React.FC<TCommunities> = ({ darkMode }) => {
	const setCommunityModal = useSetRecoilState(communityModalState);
	const mySnippets = useRecoilValue(communityState).mySnippets;

	return (
		<>
			<CreateCommunityModal darkMode={darkMode} />
			<Box mt={3} mb={4}>
				<Text
					pl={3}
					mb={1}
					fontSize={'7pt'}
					fontWeight={500}
					color={darkMode ? 'dark_text' : 'gray.500'}
				>
					MODERATING
				</Text>
				{mySnippets
					.filter((snippet) => snippet.isModerator)
					.map((snippet) => (
						<MenuListItem
							key={snippet.communityId}
							icon={FaReddit}
							displayText={`r/${snippet.communityId}`}
							link={`/r/${snippet.communityId}`}
							iconColor={'brand.100'}
							imageURL={snippet.imageURL}
						/>
					))}
			</Box>
			<Box mt={3} mb={4}>
				<Text
					pl={3}
					mb={1}
					fontSize={'7pt'}
					fontWeight={500}
					color={darkMode ? 'dark_text' : 'gray.500'}
				>
					MY COMMUNITIES
				</Text>
				<MenuItem
					width={'100%'}
					fontSize={'10pt'}
					{...(darkMode && {
						bg: 'dark_posts',
					})}
					_hover={{ bg: darkMode ? 'dark_border' : 'gray.100' }}
					onClick={() =>
						setCommunityModal({
							open: true,
						})
					}
				>
					<Flex
						{...(darkMode && {
							color: 'dark_text',
						})}
						align={'center'}
					>
						<Icon as={AiFillPlusCircle} fontSize={20} mr={2} />
						Create Community
					</Flex>
				</MenuItem>
				{mySnippets.map((snippet) => (
					<MenuListItem
						key={snippet.communityId}
						icon={FaReddit}
						displayText={`r/${snippet.communityId}`}
						link={`/r/${snippet.communityId}`}
						iconColor={'blue.500'}
						imageURL={snippet.imageURL}
					/>
				))}
			</Box>
		</>
	);
};
export default Communities;
