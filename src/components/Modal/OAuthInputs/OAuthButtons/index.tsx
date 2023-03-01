import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { auth, firestore } from '@firebaseComponent/clientApp';
import { FIREBASE_ERRORS } from '@firebaseComponent/errors';
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import {
	useSignInWithGithub,
	useSignInWithGoogle,
} from 'react-firebase-hooks/auth';

type TOauthButtons = {
	darkmode: boolean;
};

const OAuthButtons: React.FC<TOauthButtons> = ({ darkmode }) => {
	const [signInWithGoogle, googleUser, googleLoading, googleError] =
		useSignInWithGoogle(auth);
	const [signInWithGithub, gitUser, gitLoading, gitError] =
		useSignInWithGithub(auth);

	const createUserDocument = async (user: User) => {
		const userDocRef = doc(firestore, 'users', user.uid);
		await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
	};

	useEffect(() => {
		if (googleUser) createUserDocument(googleUser.user);
		else if (gitUser) createUserDocument(gitUser.user);
	}, [googleUser, gitUser]);

	return (
		<Flex direction={'column'} width={'100%'} mb={4}>
			<Button
				variant={darkmode ? 'dark' : 'oauth'}
				{...(darkmode && {
					border: '1px solid',
					borderColor: 'dark_border',
				})}
				mb={2}
				isLoading={googleLoading}
				onClick={() => signInWithGoogle()}
			>
				<Image
					src="/images/googlelogo.png"
					alt="google logo"
					height={'20px'}
					mr={4}
				/>
				Continue with Google
			</Button>
			<Button
				variant={darkmode ? 'dark' : 'oauth'}
				{...(darkmode && {
					border: '1px solid',
					borderColor: 'dark_border',
				})}
				mb={2}
				isLoading={gitLoading}
				onClick={() => signInWithGithub()}
			>
				<Image
					src={`/images/github-mark${darkmode ? '-white' : ''}.png`}
					alt="github logo"
					height={'20px'}
					mr={4}
				/>
				Continue with Github
			</Button>
			<Text>
				{
					FIREBASE_ERRORS[
						(googleError?.message ||
							gitError?.message) as keyof typeof FIREBASE_ERRORS
					]
				}
			</Text>
		</Flex>
	);
};
export default OAuthButtons;
