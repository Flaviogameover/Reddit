import { communityState } from '@/atoms/communitiesAtom';
import {
	defaultMenuItem,
	directoryMenuState,
	TDirectoryMenu,
} from '@/atoms/directoryMenuAtom';
import { auth } from '@/firebase/clientApp';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaReddit } from 'react-icons/fa';
import { useRecoilState, useRecoilValue } from 'recoil';

const useDirectory = () => {
	const [user] = useAuthState(auth);
	const [directoryState, setDirectoryState] =
		useRecoilState(directoryMenuState);
	const communityStateValue = useRecoilValue(communityState);
	const router = useRouter();

	const onSelectMenuItem = (menuItem: TDirectoryMenu) => {
		setDirectoryState((prev) => ({
			...prev,
			selectedMenuItem: menuItem,
		}));
		router?.push(menuItem.link);
		if (directoryState.isOpen) toggleMenuOpen();
	};

	const toggleMenuOpen = () => {
		setDirectoryState((prev) => ({
			...prev,
			isOpen: !directoryState.isOpen,
		}));
	};

	useEffect(() => {
		const { community } = router.query;

		// const existingCommunity =
		//   communityStateValue.visitedCommunities[community as string];

		const existingCommunity = communityStateValue.currentCommunity;

		if (existingCommunity?.id) {
			setDirectoryState((prev) => ({
				...prev,
				selectedMenuItem: {
					displayText: `r/${existingCommunity.id}`,
					link: `r/${existingCommunity.id}`,
					icon: FaReddit,
					iconColor: 'blue.500',
					imageURL: existingCommunity.imageURL,
				},
			}));
			return;
		}
		setDirectoryState((prev) => ({
			...prev,
			selectedMenuItem: defaultMenuItem,
		}));
	}, [communityStateValue.currentCommunity, user]);
	//                              ^ used to be communityStateValue.vistedCommunities

	return { directoryState, onSelectMenuItem, toggleMenuOpen };
};

export default useDirectory;
