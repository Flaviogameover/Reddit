import { darkModeState } from '@/atoms/darkmodeAtom';
import { auth, firestore } from '@/firebase/clientApp';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';

type TUseDarkMode = () => {
	loadDarkMode: () => void;
	toggleDarkMode: (darkMode: boolean) => void;
};

const useDarkMode: TUseDarkMode = () => {
	const setDarkMode = useSetRecoilState(darkModeState);
	const [user] = useAuthState(auth);

	const loadDarkMode = async () => {
		try {
			const userDocRef = doc(firestore, 'users', user!.uid);
			const userDoc = await getDoc(userDocRef);
			setDarkMode({ darkMode: userDoc.get('darkMode') || false });
		} catch (e: any) {
			console.log('Load user dark mode', e.message);
		}
	};

	const toggleDarkMode = async (darkMode: boolean) => {
		try {
			const userDocRef = doc(firestore, 'users', user!.uid);
			await updateDoc(userDocRef, {
				darkMode,
			});
			setDarkMode({ darkMode });
		} catch (e: any) {
			console.log('Load user dark mode', e.message);
		}
	};

	return {
		loadDarkMode,
		toggleDarkMode,
	};
};

export default useDarkMode;
