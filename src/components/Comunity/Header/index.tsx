import { Community } from "@/atoms/communitiesAtom";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import { FaReddit } from "react-icons/fa";
import useCommunityData from "./../../../hooks/useCommunityData";

type THeader = {
    communityData: Community;
    darkMode: boolean;
};

const Header: React.FC<THeader> = ({ communityData, darkMode }) => {
    // Header // image banner 192px
    const { communityStateValue, onJoinLeaveCommunity, loading, error } =
        useCommunityData();
    const isJoined: boolean = !!communityStateValue.mySnippets.find(
        (item) => item.communityId === communityData.id
    );
    const {banner} = communityStateValue.currentCommunity || {};

    return (
        <Flex
            direction={"column"}
            width={"100%"}
            height={banner ? "300px" : "146px"}
        >
            {banner ? (
                <Flex
                    position={"relative"}
                    width={"100%"}
                    height={"75%"}
                    direction={"column"}
                >
                    <Image
                        src={banner}
                        boxSize={"100%"}
                        objectFit={"cover"}
                        alt={"community banner"}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background:
                                "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.75))",
                        }}
                    />
                </Flex>
            ) : (
                <Box height={"50%"} bg={"blue.400"} />
            )}
            <Flex
                justify={"center"}
                bg={darkMode ? "dark_border" : "white"}
                flexGrow={1}
            >
                <Flex width={"95%"} maxWidth={"860px"}>
                    {communityStateValue.currentCommunity?.imageURL ? (
                        <Image
                            src={communityStateValue.currentCommunity.imageURL}
                            borderRadius={"full"}
                            boxSize={"66px"}
                            alt={"community logo"}
                            position={"relative"}
                            top={-3}
                            border={"3x solid white"}
                            color={"blue.500"}
                        />
                    ) : (
                        <Icon
                            as={FaReddit}
                            fontSize={64}
                            position={"relative"}
                            top={-3}
                            color={darkMode ? "brand.100" : "blue.500"}
                            border={"3px solid white"}
                            borderRadius={"full"}
                            bg={"white"}
                        />
                    )}
                    <Flex padding={"10px 6px"}>
                        <Flex direction={"column"} mr={6}>
                            <Text
                                {...(darkMode && {
                                    color: "dark_text",
                                })}
                                fontWeight={800}
                                fontSize={"16pt"}
                            >
                                {communityData.id}
                            </Text>
                            <Text
                                fontWeight={600}
                                fontSize={"10pt"}
                                color={darkMode ? "dark_text" : "gray.400"}
                            >
                                r/{communityData.id}
                            </Text>
                            <Text color="red" fontSize="10pt">
                                {error && error}
                            </Text>
                        </Flex>
                        <Button
                            variant={
                                darkMode
                                    ? isJoined
                                        ? "dark"
                                        : "dark_selected"
                                    : isJoined
                                    ? "outline"
                                    : "solid"
                            }
                            height={"30px"}
                            p={`0 1.5rem`}
                            onClick={() =>
                                onJoinLeaveCommunity(communityData, isJoined)
                            }
                            isLoading={loading}
                        >
                            {isJoined ? "Joined" : "Join"}
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Header;
