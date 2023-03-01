import { Button, Flex, Image, Stack } from '@chakra-ui/react';
import React, { useRef } from 'react';

type TImageUpload = {
	selectedFile?: string;
	onSelectImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
	setSelectedForm?: (
		value: 'Post' | 'Images & Videos' | 'Link' | 'Poll' | 'Talk'
	) => void;
	setSelectedFile: (value: string) => void;
	caller: 'post' | 'community';
	darkMode: boolean;
};

const ImageUpload: React.FC<TImageUpload> = ({
	selectedFile,
	onSelectImage,
	setSelectedForm,
	setSelectedFile,
	caller,
	darkMode,
}) => {
	const selectedFileRef = useRef<HTMLInputElement>(null);
	return (
		<Flex
			direction={'column'}
			justify={'center'}
			align={'center'}
			width={'100%'}
		>
			{selectedFile ? (
				<>
					<Image
						alt={'selected file'}
						src={selectedFile}
						width={'100%'}
						height={caller === 'post' ? 'auto' : '150px'}
						{...(caller === 'community' && { objectFit: 'cover' })}
					/>
					<Stack direction={'row'} mt={4}>
						{caller === 'post' ? (
							<>
								<Button
									height={'28px'}
									onClick={() => setSelectedForm!('Post')}
									{...(darkMode && {
										variant: 'dark_selected',
									})}
								>
									Back to Post
								</Button>
								<Button
									height={'28px'}
									variant={darkMode ? 'dark' : 'outline'}
									onClick={() => setSelectedFile('')}
								>
									Remove
								</Button>
							</>
						) : (
							<Button
								height={'28px'}
								variant={darkMode ? 'dark' : 'outline'}
								onClick={() => setSelectedFile('')}
							>
								Remove
							</Button>
						)}
					</Stack>
				</>
			) : (
				<Flex
					justify={'center'}
					align={'center'}
					p={caller === 'post' ? 20 : 5}
					border={'1px dashed'}
					{...(darkMode && {
						borderColor: 'dark_border_hover',
					})}
					width={'100%'}
					borderRadius={4}
				>
					<Button
						variant={darkMode ? 'dark' : 'outline'}
						height={'28px'}
						onClick={() => selectedFileRef.current?.click()}
					>
						Upload
					</Button>
					<input
						ref={selectedFileRef}
						type={'file'}
						hidden
						onChange={onSelectImage}
					/>
				</Flex>
			)}
		</Flex>
	);
};
export default ImageUpload;
