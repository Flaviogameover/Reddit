import { authModalState } from '@/atoms/authModalAtom';
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import Login from './Login';
import SignUp from './SignUp';

const OAuthInputs: React.FC = () => {
	const modalState = useRecoilValue(authModalState);
	return (
		<Flex direction={'column'} align={'center'} width={'100%'} mt={4}>
			{modalState.type === 'login' && <Login />}
			{modalState.type === 'signup' && <SignUp />}
		</Flex>
	);
};

export default OAuthInputs;
