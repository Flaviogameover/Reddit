import { darkModeState } from '@/atoms/darkmodeAtom';
import AuthModal from '@modal/OAuthModal';
import AuthButton from '@navbar/RightContent/AuthButtons';
import Icons from '@navbar/RightContent/Icons';
import UserMenu from '@navbar/RightContent/UserMenu';
import { Flex, Icon } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React from 'react';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';
import { useRecoilState } from 'recoil';
import useDarkMode from '@/hooks/useDarkMode';

type TRContent = {
	user?: User | null;
};

const RightContent: React.FC<TRContent> = ({ user }) => {
	const [{ darkMode }, setDarkModeState] = useRecoilState(darkModeState);
	const { toggleDarkMode } = useDarkMode();

	const handleDarkMode = () => {
		setDarkModeState({ darkMode: !darkMode });
		toggleDarkMode(!darkMode);
	};

	return (
		<>
			<AuthModal />
			<Flex justify={'center'} align={'center'}>
				{user ? <Icons darkMode={darkMode} /> : <AuthButton />}
				<Flex
					mr={1.5}
					ml={1.5}
					padding={1}
					cursor={'pointer'}
					borderRadius={4}
					_hover={{ bg: darkMode ? 'dark_border' : 'gray.200' }}
					onClick={() => handleDarkMode()}
				>
					<Icon
						as={darkMode ? BsFillMoonFill : BsFillSunFill}
						color={darkMode ? 'dark_text' : 'black'}
						fontSize={20}
					/>
				</Flex>
				<UserMenu user={user} darkMode={darkMode} />
			</Flex>
		</>
	);
};
export default RightContent;
