import { Flex, Icon } from '@chakra-ui/react';
import React from 'react';
import { BsArrowUpCircle, BsChatDots } from 'react-icons/bs';
import {
	IoFilterCircleOutline,
	IoNotificationsOutline,
	IoVideocamOutline,
} from 'react-icons/io5';

type TIcons = {
	darkMode: boolean;
};

const Icons: React.FC<TIcons> = ({ darkMode }) => {
	return (
		<Flex>
			<Flex
				display={{ base: 'none', md: 'flex' }}
				align={'center'}
				borderRight={'1px solid'}
				borderColor={'gray.200'}
			>
				<Flex
					mr={1.5}
					ml={1.5}
					padding={1}
					cursor={'pointer'}
					borderRadius={4}
					color={darkMode ? 'dark_text' : 'gray.500'}
					_hover={{ bg: darkMode ? 'dark_border' : 'gray.200' }}
				>
					<Icon as={BsArrowUpCircle} fontSize={20} />
				</Flex>
				<Flex
					mr={1.5}
					ml={1.5}
					padding={1}
					cursor={'pointer'}
					borderRadius={4}
					color={darkMode ? 'dark_text' : 'gray.500'}
					_hover={{ bg: darkMode ? 'dark_border' : 'gray.200' }}
				>
					<Icon as={IoFilterCircleOutline} fontSize={22} />
				</Flex>
				<Flex
					mr={1.5}
					ml={1.5}
					padding={1}
					cursor={'pointer'}
					borderRadius={4}
					color={darkMode ? 'dark_text' : 'gray.500'}
					_hover={{ bg: darkMode ? 'dark_border' : 'gray.200' }}
				>
					<Icon as={IoVideocamOutline} fontSize={22} />
				</Flex>
			</Flex>
			<>
				<Flex
					mr={1.5}
					ml={1.5}
					padding={1}
					cursor={'pointer'}
					borderRadius={4}
					color={darkMode ? 'dark_text' : 'gray.500'}
					_hover={{ bg: darkMode ? 'dark_border' : 'gray.200' }}
				>
					<Icon as={BsChatDots} fontSize={20} />
				</Flex>
				<Flex
					mr={1.5}
					ml={1.5}
					padding={1}
					cursor={'pointer'}
					borderRadius={4}
					color={darkMode ? 'dark_text' : 'gray.500'}
					_hover={{ bg: darkMode ? 'dark_border' : 'gray.200' }}
				>
					<Icon as={IoNotificationsOutline} fontSize={20} />
				</Flex>
			</>
		</Flex>
	);
};
export default Icons;
