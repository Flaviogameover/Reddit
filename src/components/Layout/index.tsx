import React from 'react';
import Navbar from '@NavbarComponent/index';

type TLayout = {
	children: React.ReactNode;
};

const index: React.FC<TLayout> = ({ children }) => {
	return (
		<>
			<Navbar />
			<main>{children}</main>
		</>
	);
};
export default index;
