import React, { useState } from 'react';
import { useRouter } from 'next/router';

const useSelectFile = () => {
	const [selectedFile, setSelectedFile] = useState<string>();
	const router = useRouter();
	const { query } = router;

	const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const reader = new FileReader();

		if (e.target.files?.[0]) {
			reader.readAsDataURL(e.target.files[0]);
		}

		reader.onload = (readerEvent) => {
			if (readerEvent.target?.result) {
				setSelectedFile(readerEvent.target.result as string);
			}
		};
	};

	React.useEffect(() => {
		if (!selectedFile) return;
		setSelectedFile('');
	}, [query]);

	return {
		selectedFile,
		setSelectedFile,
		onSelectFile,
	};
};

export default useSelectFile;
