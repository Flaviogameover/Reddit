import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import _ChakraComponent from "./_chakraComponent";

export default function App({ Component, pageProps }: AppProps) {

    return (
        <RecoilRoot>
            <_ChakraComponent Component={Component} pageProps={pageProps} />
        </RecoilRoot>
    );
}
