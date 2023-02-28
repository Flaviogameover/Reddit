import { Community } from "@/atoms/communitiesAtom";
import useCommunityData from "@/hooks/useCommunityData";
import { Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FaReddit } from "react-icons/fa";

type TSearchCommunity = {
    searchResult: Community;
    isJoined: boolean;
    darkMode: boolean;
};

const SearchCommunity: React.FC<TSearchCommunity> = ({ searchResult, isJoined, darkMode }) => {
    const router = useRouter();
    const {onJoinLeaveCommunity} = useCommunityData();

    const handleClickCommunity = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        router.push(`/r/${searchResult.id}`);
    };

    const handleJoinLeaveCommunity = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        isJoined: boolean
    ) => {
        e.stopPropagation();
        onJoinLeaveCommunity(searchResult, isJoined);
    };

    return (
        <Flex
            p={"0.7rem 1.1rem"}
            width={"100%"}
            border={"1px"}
            borderStyle={"solid"}
            borderColor={darkMode ? "dark_border" : "gray.300"}
            cursor={"pointer"}
            _hover={{ borderColor: darkMode ? "dark_border" : "gray.500" }}
            bg={darkMode ? "dark_posts" : "white"}
            align={"center"}
            justify={"space-between"}
            onClick={handleClickCommunity}
        >
            <Flex align={"center"}>
                {searchResult.imageURL ? (
                    <Image
                        src={searchResult.imageURL}
                        alt={"Post Image"}
                        boxSize={"35px"}
                        borderRadius={"full"}
                    />
                ) : (
                    <Icon as={FaReddit} boxSize={"35px"} bg={"white"} borderRadius={"full"} color={
                        darkMode
                            ? "brand.100"
                            : "blue.100"
                    }/>
                )
            
            }
                <Text fontSize={"9pt"} pl={2} fontWeight={700}
                                color={darkMode ? "dark_text" : "gray.500"}
                                _hover={{ textDecoration: "underline" }}
                >
                    {`r/${searchResult.id}`}
                </Text>
                <Text fontSize={"9pt"} pl={2} 
                
                color={darkMode ? "dark_text" : "gray.500"}
                >
                    {`${searchResult.numberOfMembers} members`}
                </Text>
            </Flex>
            <Button
                height="22px"
                fontSize="8pt"
                onClick={(
                    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                ) => handleJoinLeaveCommunity(e, isJoined)}
                variant={
                    isJoined
                        ? darkMode ? "dark" :"outline"
                        : darkMode ? "dark_selected": "solid"
                }
            >
                {isJoined ? "Joined" : "Join"}
            </Button>
        </Flex>
    );
};
export default SearchCommunity;
