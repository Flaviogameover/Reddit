import { authModalState } from '@/atoms/authModalAtom';
import { auth } from '@/firebase/clientApp';
import { Button, Flex, Icon, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { BsReddit } from 'react-icons/bs';
import { useSetRecoilState } from 'recoil';

const ResetPassword: React.FC = () => {
	const setAuthModalState = useSetRecoilState(authModalState);
	const [email, setEmail] = useState<string>('');
	const [success, setSuccess] = useState<boolean>(false);
	const [sendPasswordResetEmail, sending, error] =
		useSendPasswordResetEmail(auth);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await sendPasswordResetEmail(email);
		setSuccess(true);
	};
	return (
		<Flex direction={'column'} alignItems={'center'} width={'100%'}>
			<Icon as={BsReddit} color={'brand.100'} fontSize={40} mb={2} />
			<Text fontWeight={700} mb={2}>
				Reset your password
			</Text>
			{success ? (
				<Text mb={4}>Check your email {':)'} </Text>
			) : (
				<>
					<Text fontSize={'sm'} textAlign={'center'} mb={2}>
						Enter the email associated with your account and
						we&rsquo;ll send you a reset link.
					</Text>
					<form onSubmit={handleSubmit} style={{ width: '100%' }}>
						<Input
							type="email"
							mb={2}
							name="email"
							placeholder="email"
							onChange={(e) => setEmail(e.target.value)}
							fontSize={'10pt'}
							_placeholder={{ color: 'gray.500' }}
							_hover={{
								bg: 'white',
								border: '1px solid',
								borderColor: 'blue.500',
							}}
							_focus={{
								outline: 'none',
								bg: 'white',
								border: '1px solid',
								borderColor: 'blue.500',
							}}
							bg={'gray.50'}
						/>
						<Text
							textAlign={'center'}
							fontSize={'10pt'}
							color={'red'}
						>
							{error?.message}
						</Text>
						<Button
							width={'100%'}
							height={'36px'}
							mb={2}
							mt={2}
							type={'submit'}
							isLoading={sending}
						>
							Reset Password
						</Button>
					</form>
				</>
			)}
			<Flex
				alignItems={'center'}
				fontSize={'9pt'}
				color={'blue.500'}
				fontWeight={700}
				cursor={'pointer'}
			>
				<Text
					onClick={() =>
						setAuthModalState((prev) => ({
							...prev,
							type: 'signup',
						}))
					}
				>
					Sign Up
				</Text>
			</Flex>
		</Flex>
	);
};
export default ResetPassword;
