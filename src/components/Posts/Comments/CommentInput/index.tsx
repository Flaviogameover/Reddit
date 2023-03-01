import { Button, Flex, Text, Textarea } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React from 'react';
import AuthButtons from '@/components/Navbar/RightContent/AuthButton/index';

type TCommentInput = {
	commentText: string;
	setCommentText: (value: string) => void;
	user: User;
	createLoading: boolean;
	onCreateComment: (commentText: string) => void;
	darkMode: boolean;
};

const CommentInput: React.FC<TCommentInput> = ({
	commentText,
	setCommentText,
	user,
	createLoading,
	onCreateComment,
	darkMode,
}) => {
	return (
		<Flex direction={'column'} position={'relative'}>
			{user ? (
				<>
					<Text
						mb={1}
						{...(darkMode && {
							color: 'dark_text',
						})}
					>
						Comment as{' '}
						<span style={{ color: '#3182ce', fontWeight: 700 }}>
							{user?.email?.split('@')[0]}
						</span>
					</Text>
					<Textarea
						value={commentText}
						onChange={(e) => setCommentText(e.target.value)}
						placeholder={'Write a comment...'}
						fontSize={'10pt'}
						borderRadius={4}
						minHeight={'160px'}
						pb={10}
						_placeholder={{ color: 'gray.300' }}
						{...(darkMode && {
							color: 'dark_text',
						})}
						_focus={{
							outline: 'none',
							bg: darkMode ? 'dark_posts_bright' : 'white',
							border: '1px solid black',
						}}
					/>
					<Flex
						position={'absolute'}
						left={'1px'}
						right={0.1}
						bottom={'1px'}
						justify={'flex-end'}
						bg={darkMode ? 'dark_border' : 'gray.100'}
						p={'6px 8px'}
						borderRadius={'0 0 4px 4px'}
						zIndex={1}
					>
						<Button
							height={'26px'}
							disabled={!commentText.length}
							isLoading={createLoading}
							onClick={() => onCreateComment(commentText)}
						>
							Comment
						</Button>
					</Flex>
				</>
			) : (
				<Flex
					align={'center'}
					justify={'space-between'}
					borderRadius={2}
					border={'1px solid'}
					borderColor={'gray.100'}
					p={4}
				>
					<Text
						fontWeight={600}
						{...(darkMode && {
							color: 'dark_text',
						})}
					>
						Log in or sign up to leave a comment
					</Text>
					<AuthButtons />
				</Flex>
			)}
		</Flex>
	);
};
export default CommentInput;
