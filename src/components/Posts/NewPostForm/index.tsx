import { darkModeState } from '@/atoms/darkmodeAtom';
import { Post } from '@/atoms/postsAtom';
import { firestore, storage } from '@/firebase/clientApp';
import useSelectFile from '@/hooks/useSelectFile';
import { Alert, AlertIcon, Flex, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	serverTimestamp,
	Timestamp,
	updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { IconType } from 'react-icons';
import { BiPoll } from 'react-icons/bi';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { useRecoilValue } from 'recoil';
import TextInputs from '../PostForm';
import TabItem from '../TabItem';
import ImageUpload from '@/components/Posts/ImageUpload';

export type TFormTabs = {
	title: 'Post' | 'Images & Videos' | 'Link' | 'Poll' | 'Talk';
	icon: IconType;
};

const formTabs: TFormTabs[] = [
	{
		title: 'Post',
		icon: IoDocumentText,
	},
	{
		title: 'Images & Videos',
		icon: IoImageOutline,
	},
	{
		title: 'Link',
		icon: BsLink45Deg,
	},
	{
		title: 'Poll',
		icon: BiPoll,
	},
	{
		title: 'Talk',
		icon: BsMic,
	},
];

type TNewPostForm = {
	user: User;
	communityImageURL?: string;
};

const NewPostForm: React.FC<TNewPostForm> = ({ user, communityImageURL }) => {
	const router = useRouter();
	const { darkMode } = useRecoilValue(darkModeState);
	const [selectedForm, setSelectedForm] = useState(formTabs[0].title);
	const [textInputs, setTextInputs] = useState({
		title: '',
		body: '',
	});
	const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const handleCreatePost = async () => {
		const { communityId } = router.query;
		const newPost: Post = {
			communityId: communityId as string,
			communityImageURL: communityImageURL || '',
			creatorId: user!.uid,
			creatorDisplayName: user.email!.split('@')[0],
			title: textInputs.title,
			body: textInputs.body,
			upvotes: 0,
			imageURL: selectedFile || '',
			createdAt: serverTimestamp() as Timestamp,
			numberOfComments: 0,
		};

		setLoading(true);
		try {
			const communityDocRef = doc(
				firestore,
				'communities',
				communityId as string
			);
			const communityDoc = await getDoc(communityDocRef);
			const postDocRef = await addDoc(collection(firestore, 'posts'), {
				...newPost,
				privacyType: communityDoc.data()!.privacyType,
			} as Post);

			if (selectedFile) {
				const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
				await uploadString(imageRef, selectedFile, 'data_url');
				const downloadURL = await getDownloadURL(imageRef);

				await updateDoc(postDocRef, {
					image: downloadURL,
				});
			}
			router.back();
		} catch (e: any) {
			console.log('handleCreatePost error: ', e);
			setError(e.message);
		}
		setLoading(false);
	};

	//const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
	return (
		<Flex
			direction={'column'}
			bg={darkMode ? 'dark_posts' : 'white'}
			{...(darkMode && {
				border: '1px solid',
				borderColor: 'dark_border_hover',
			})}
			borderRadius={4}
			mt={2}
		>
			<Flex width={'100%'}>
				{formTabs.map((item) => (
					<TabItem
						key={item.title}
						item={item}
						selected={selectedForm === item.title}
						setSelectedForm={setSelectedForm}
						darkMode={darkMode}
					/>
				))}
			</Flex>
			<Flex p={4}>
				{selectedForm === 'Post' && (
					<TextInputs
						textInputs={textInputs}
						setTextInputs={setTextInputs}
						handleCreatePost={handleCreatePost}
						loading={loading}
						darkMode={darkMode}
					/>
				)}
				{selectedForm === 'Images & Videos' && (
					<ImageUpload
						onSelectImage={onSelectFile}
						selectedFile={selectedFile}
						setSelectedForm={setSelectedForm}
						setSelectedFile={setSelectedFile}
						caller={'post'}
						darkMode={darkMode}
					/>
				)}
			</Flex>
			{error && (
				<Alert status="error">
					<AlertIcon />
					<Text mr={2}>Error creating post</Text>
				</Alert>
			)}
		</Flex>
	);
};
export default NewPostForm;
