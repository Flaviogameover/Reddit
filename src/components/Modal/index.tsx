import { authModalState } from '@/atoms/authModalAtom';
import { darkModeState } from '@/atoms/darkmodeAtom';
import {
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
} from '@chakra-ui/react';
import { auth } from '@firebaseComponent/clientApp';
import OAuthInputs from '@/components/Modal/OAuthInputs';
import OAuthButtons from '@/components/Modal/OAuthInputs/OAuthButtons';
import ResetPassword from '@/components/Modal/OAuthInputs/ResetPassword';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue } from 'recoil';
import useDarkMode from '@/hooks/useDarkMode';

const OAuthModal: React.FC = () => {
	const [modalState, setModalState] = useRecoilState(authModalState);
	const [user, loading, error] = useAuthState(auth);
	const { darkMode } = useRecoilValue(darkModeState);
	const { loadDarkMode } = useDarkMode();

	const handleClose = () => {
		setModalState((prev) => ({
			...prev,
			open: false,
		}));
	};

	useEffect(() => {
		if (!user) return;
		handleClose();
		loadDarkMode();
	}, [user]);

	const handleData = () => {
		switch (modalState.type) {
			case 'login':
				return 'Log In';
			case 'signup':
				return 'Sign Up';
			case 'reset':
				return 'Reset password';
			default:
				return 'Log In';
		}
	};

	return (
		<>
			<Modal isOpen={modalState.open} onClose={handleClose}>
				<ModalOverlay />
				<ModalContent
					{...(darkMode && {
						bg: 'dark_posts',
						border: '1px solid',
						borderColor: 'dark_border',
					})}
				>
					<ModalHeader
						textAlign={'center'}
						{...(darkMode && {
							color: 'dark_text',
						})}
					>
						{handleData()}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display={'flex'}
						flexDirection={'column'}
						alignItems={'center'}
						justifyContent={'center'}
						pb={6}
					>
						<Flex
							width={'70%'}
							direction={'column'}
							align={'center'}
							justify={'center'}
						>
							{modalState.type === 'reset' ? (
								<ResetPassword />
							) : (
								<>
									<OAuthButtons darkmode={darkMode} />
									<Text
										color={
											darkMode ? 'dark_text' : 'gray.500'
										}
										fontWeight={700}
									>
										OR
									</Text>
									<OAuthInputs />
								</>
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
export default OAuthModal;
