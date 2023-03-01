import { IconType } from 'react-icons';
import { TiHome } from 'react-icons/ti';
import { atom } from 'recoil';

export type TDirectoryMenu = {
	displayText: string;
	link: string;
	icon: IconType;
	iconColor: string;
	imageURL?: string;
};

interface IDirectoryMenu {
	isOpen: boolean;
	selectedMenuItem: TDirectoryMenu;
}

export const defaultMenuItem: TDirectoryMenu = {
	displayText: 'Home',
	link: '/',
	icon: TiHome,
	iconColor: 'black',
};

export const defaultMenuState: IDirectoryMenu = {
	isOpen: false,
	selectedMenuItem: defaultMenuItem,
};

export const directoryMenuState = atom<IDirectoryMenu>({
	key: 'directoryMenuState',
	default: defaultMenuState,
});
