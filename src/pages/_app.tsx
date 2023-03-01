import type { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import ChakraComponent from '@/ChakraComponent';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<RecoilRoot>
			<ChakraComponent Component={Component} pageProps={pageProps} />
		</RecoilRoot>
	);
}
