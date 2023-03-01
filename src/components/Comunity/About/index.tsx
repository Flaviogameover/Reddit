import { Community, communityState } from '@/atoms/communitiesAtom';
import { darkModeState } from '@/atoms/darkmodeAtom';
import { directoryMenuState } from '@/atoms/directoryMenuAtom';
import { auth, firestore, storage } from '@/firebase/clientApp';
import useSelectFile from '@/hooks/useSelectFile';
import {
	Box,
	Button,
	Divider,
	Flex,
	Icon,
	Image,
	Spinner,
	Stack,
	Text,
} from '@chakra-ui/react';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import moment from 'moment';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaReddit } from 'react-icons/fa';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { RiCakeLine } from 'react-icons/ri';
import { useRecoilValue, useSetRecoilState } from 'recoil';

type TAbout = {
	communityData: Community;
};

const About: React.FC<TAbout> = ({ communityData }) => {
	const { darkMode } = useRecoilValue(darkModeState);
	const [user] = useAuthState(auth);
	const selectedFileRef = useRef<HTMLInputElement>(null);
	const selectedBannerRef = useRef<HTMLInputElement>(null);
	const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
	const [uploadingImage, setUploadingImage] = useState(false);
	const setCommunityStateValue = useSetRecoilState(communityState);
	const setDirectoryState = useSetRecoilState(directoryMenuState);
	const [lastChangeImage, setLastChangeImage] = useState<
		'icon' | 'banner' | null
	>(null);

	const onUpdateImage = async () => {
		if (!selectedFile) return;
		setUploadingImage(true);
		try {
			const imageRef = ref(
				storage,
				`communities/${communityData.id}/${
					lastChangeImage === 'banner' ? 'banner' : 'image'
				}`
			);
			await uploadString(imageRef, selectedFile, 'data_url');
			const downloadURL = await getDownloadURL(imageRef);
			await updateDoc(doc(firestore, 'communities', communityData.id), {
				...(lastChangeImage === 'banner'
					? {
							banner: downloadURL,
					  }
					: {
							imageURL: downloadURL,
					  }),
			});

			setCommunityStateValue((prev) => ({
				...prev,
				currentCommunity: {
					...prev.currentCommunity,
					...(lastChangeImage === 'banner'
						? {
								banner: downloadURL,
						  }
						: {
								imageURL: downloadURL,
						  }),
				} as Community,
			}));
			setDirectoryState((prev) => ({
				...prev,
				selectedMenuItem: {
					...prev.selectedMenuItem,
					...(lastChangeImage === 'banner'
						? {
								banner: downloadURL,
						  }
						: {
								imageURL: downloadURL,
						  }),
				},
			}));
		} catch (e: any) {
			console.log('onUpdateImage', e.message);
		}
		setUploadingImage(false);
	};

	const handleChangeImage = (
		e: React.ChangeEvent<HTMLInputElement>,
		lastChange: 'icon' | 'banner'
	) => {
		onSelectFile(e);
		setLastChangeImage(lastChange);
	};

	return (
		<Box position={'sticky'} top={'14px'}>
			<Flex
				justify={'space-between'}
				align={'center'}
				bg={darkMode ? 'dark_border' : 'blue.400'}
				color={'white'}
				p={3}
				borderRadius={'4px 4px 0 0'}
			>
				<Text fontSize={'10pt'} fontWeight={700}>
					About Community
				</Text>
				<Icon as={HiOutlineDotsHorizontal} />
			</Flex>
			<Flex
				direction={'column'}
				p={3}
				bg={darkMode ? 'dark_posts_dark' : 'white'}
				borderRadius={'0 0 4px 4px'}
			>
				<Stack>
					<Flex
						width={'100%'}
						p={2}
						fontSize={'10pt'}
						fontWeight={700}
					>
						<Flex direction={'column'} flexGrow={1}>
							<Text {...(darkMode && { color: 'dark_text' })}>
								{communityData.numberOfMembers.toLocaleString()}
							</Text>
							<Text {...(darkMode && { color: 'dark_text' })}>
								Members
							</Text>
						</Flex>
						<Flex direction={'column'} flexGrow={1}>
							<Text {...(darkMode && { color: 'dark_text' })}>
								1
							</Text>
							<Text {...(darkMode && { color: 'dark_text' })}>
								Online
							</Text>
						</Flex>
					</Flex>
					<Divider />
					<Flex
						align={'center'}
						width={'100%'}
						p={1}
						fontWeight={500}
						fontSize={'10pt'}
					>
						<Icon
							{...(darkMode && { color: 'dark_text' })}
							as={RiCakeLine}
							fontSize={18}
							mr={2}
						/>
						{communityData.createdAt && (
							<Text {...(darkMode && { color: 'dark_text' })}>
								Created{' '}
								{moment(
									new Date(
										communityData.createdAt.seconds * 1000
									)
								).format('MMM DD, YYYY')}
							</Text>
						)}
					</Flex>
					<Link href={`/r/${communityData.id}/submit`}>
						<Button
							mr={3}
							height={'30px'}
							{...(darkMode && { variant: 'dark' })}
						>
							Create Post
						</Button>
					</Link>
					{user?.uid === communityData.creatorId && (
						<>
							<Stack spacing={1} fontSize={'10pt'}>
								<Text
									{...(darkMode && { color: 'dark_text' })}
									fontWeight={600}
								>
									Admin
								</Text>
								<Flex direction={'column'}>
									<Flex
										justify={'space-between'}
										align={'center'}
										p={2}
									>
										<Text
											fontWeight={700}
											color={
												darkMode
													? 'dark_text'
													: 'blue.500'
											}
											cursor={'pointer'}
											_hover={{
												textDecoration: 'underline',
											}}
											onClick={() =>
												selectedFileRef.current?.click()
											}
										>
											Change Image
										</Text>
										{communityData.imageURL ||
										lastChangeImage === 'icon' ? (
											<Image
												src={
													lastChangeImage === 'icon'
														? selectedFile
														: communityData.imageURL
												}
												borderRadius={'full'}
												boxSize={'40px'}
												alt={'Community Page'}
											/>
										) : (
											<Icon
												as={FaReddit}
												fontSize={40}
												color={'brand.100'}
											/>
										)}
									</Flex>

									<Flex
										justify={'space-between'}
										align={'center'}
										p={2}
									>
										<Text
											fontWeight={700}
											color={
												darkMode
													? 'dark_text'
													: 'blue.500'
											}
											cursor={'pointer'}
											_hover={{
												textDecoration: 'underline',
											}}
											onClick={() =>
												selectedBannerRef.current?.click()
											}
										>
											Change Banner
										</Text>
										{communityData.banner ||
										lastChangeImage === 'banner' ? (
											<Image
												src={
													lastChangeImage === 'banner'
														? selectedFile
														: communityData.banner
												}
												boxSize={'40px'}
												alt={'Community Page'}
											/>
										) : (
											<Icon
												as={FaReddit}
												fontSize={40}
												color={'brand.100'}
											/>
										)}
									</Flex>
								</Flex>
								{selectedFile &&
									(uploadingImage ? (
										<Spinner />
									) : (
										<Text
											cursor={'pointer'}
											{...(darkMode && {
												color: 'dark_text',
											})}
											onClick={onUpdateImage}
										>
											Save Changes
										</Text>
									))}
								<input
									id={'file-upload-icon'}
									type={'file'}
									hidden
									accept="image/x-png,image/gif,image/jpeg"
									ref={selectedFileRef}
									onChange={(e) =>
										handleChangeImage(e, 'icon')
									}
								/>
								<input
									id={'file-upload-banner'}
									type={'file'}
									hidden
									accept="image/x-png,image/gif,image/jpeg"
									ref={selectedBannerRef}
									onChange={(e) =>
										handleChangeImage(e, 'banner')
									}
								/>
							</Stack>
						</>
					)}
				</Stack>
			</Flex>
		</Box>
	);
};
export default About;
