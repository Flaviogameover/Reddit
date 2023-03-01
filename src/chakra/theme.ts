import { extendTheme } from '@chakra-ui/react';
import '@fontsource/open-sans/300.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';
import { Button } from './button';

export const theme = extendTheme({
	colors: {
		brand: {
			100: '#ff3c00',
		},
	},
	fonts: {
		body: 'Open Sans, sans-serif',
	},
	styles: {
		global: () => ({
			body: {
				bg: 'gray.200',
			},
		}),
	},
	components: {
		Button,
	},
});

export const defaultDarkTheme = extendTheme({
	colors: {
		brand: {
			100: '#ff3c00',
		},
		dark_body: '#030303',
		dark_border: '#343536',
		dark_border_hover: '#D7DADC',
		dark_posts: '#1A1A1B',
		dark_posts_bright: '#272729',
		dark_posts_dark: '#161617',
		dark_text: '#C8CBCD',
		// bg_reddit: {
		//     100: "#030303", // background
		//     200: "#161617", // posts
		//     250: "#272729", // posts bright
		//     300: "#C8CBCD", // text
		// },
	},
	fonts: {
		body: 'Open Sans, sans-serif',
	},
	styles: {
		global: () => ({
			body: {
				bg: 'dark_body',
			},
		}),
	},
	components: {
		Button,
	},
});
