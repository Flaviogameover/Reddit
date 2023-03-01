import { darkModeState } from '@/atoms/darkmodeAtom';
import { defaultDarkTheme, theme } from '@/chakra/theme';
import Layout from '@/components/Layout';
import { ChakraProvider } from '@chakra-ui/react';
import { NextComponentType, NextPageContext } from 'next/types';
import React from 'react';
import { useRecoilValue } from 'recoil';

type _chakraComponentProps = {
	Component: NextComponentType<NextPageContext, any, any>;
	pageProps: React.PropsWithChildren<any>;
};

const ChakraComponent: React.FC<_chakraComponentProps> = ({
	Component,
	pageProps,
}) => {
	const useDarkModeState = useRecoilValue(darkModeState);
	return (
		<ChakraProvider
			theme={useDarkModeState.darkMode ? defaultDarkTheme : theme}
		>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ChakraProvider>
	);
};
export default ChakraComponent;
