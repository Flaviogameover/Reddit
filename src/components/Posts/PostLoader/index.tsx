import { Box, Skeleton, SkeletonText, Stack } from "@chakra-ui/react";
import React from "react";

type TPostLoader = {
    darkMode: boolean;
};

const PostLoader: React.FC<TPostLoader> = ({ darkMode }) => {
    return (
        <Stack spacing={6}>
            <Box
                padding={"10px"}
                boxShadow={"lg"}
                bg={darkMode ? "dark_posts" : "white"}
                borderRadius={4}
            >
                <SkeletonText
                    mt={"4"}
                    noOfLines={1}
                    width={"40%"}
                    spacing={"4"}
                />
                <SkeletonText mt={"4"} noOfLines={4} spacing={"4"} />
            </Box>
            <Box
                padding={"10px"}
                boxShadow={"lg"}
                bg={darkMode ? "dark_posts" : "white"}
                borderRadius={4}
            >
                <SkeletonText
                    mt={"4"}
                    noOfLines={1}
                    width={"40%"}
                    spacing={"4"}
                />
                <SkeletonText mt={"4"} noOfLines={4} spacing={"4"} />
                <Skeleton mt={"4"} height={"200px"} />
            </Box>
        </Stack>
    );
};
export default PostLoader;
