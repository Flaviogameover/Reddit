import { atom } from 'recoil';

interface DarkModeState {
	darkMode: boolean;
}

const defaultDarkModeState: DarkModeState = {
	darkMode: false,
};

export const darkModeState = atom<DarkModeState>({
	key: 'darkModeState',
	default: defaultDarkModeState,
});
