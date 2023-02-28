import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

type TCommunityNotFound = {
    darkMode: boolean;
};

const CommunityNotFound:React.FC<TCommunityNotFound> = ({darkMode}) => {
    
    return (
        <Flex
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            minHeight={"60vh"}
            {
                ...darkMode && {
                    color: "dark_text"
                }
            }
        >
            Sorry, that community or the post does not exists or has been banned.
            <Link href="/">
                <Button {
                    ...darkMode && {
                        variant: "dark_selected"
                    }
                } mt={4}>GO HOME</Button>
            </Link>
        </Flex>
    )
}
export default CommunityNotFound;