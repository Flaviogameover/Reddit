import useDirectory from "@/hooks/useDirectory";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Flex,
    Icon,
    Image,
    Menu,
    MenuButton,
    MenuList,
    Text,
} from "@chakra-ui/react";
import Communities from "@navbar/Directory/Communities";
import React from "react";

type TDirectory = {
    darkMode: boolean;
};

const Directory: React.FC<TDirectory> = ({ darkMode }) => {
    const { directoryState, toggleMenuOpen } = useDirectory();
    return (
        <Menu isOpen={directoryState.isOpen}>
            <MenuButton
                cursor={"pointer"}
                padding={"0 6px"}
                paddingY={3}
                borderRadius={4}
                mr={2}
                ml={{ base: 0, md: 2 }}
                {...(darkMode && {
                    color: "dark_text",
                })}
                _hover={{
                    outline: "1px solid",
                    outlineColor: darkMode ? "dark_border_hover" : "gray.200",
                }}
                onClick={toggleMenuOpen}
            >
                <Flex align={"center"} justify={"space-between"}>
                    <Flex align={"center"}>
                        {directoryState.selectedMenuItem.imageURL ? (
                            <Image
                                borderRadius={"full"}
                                mr={2}
                                boxSize={"24px"}
                                src={directoryState.selectedMenuItem.imageURL}
                            />
                        ) : (
                            <Icon
                                fontSize={24}
                                mr={{ base: 1, md: 2 }}
                                as={directoryState.selectedMenuItem.icon}
                                color={
                                    darkMode
                                        ? "dark_text"
                                        : directoryState.selectedMenuItem
                                              .iconColor
                                }
                            />
                        )}
                        <Flex display={{ base: "none", lg: "flex" }}>
                            <Text fontWeight={600} fontSize={"10pt"}>
                                {directoryState.selectedMenuItem.displayText}
                            </Text>
                        </Flex>
                    </Flex>
                    <ChevronDownIcon />
                </Flex>
            </MenuButton>
            <MenuList
                {...(darkMode && {
                    bg: "dark_posts",
                })}
            >
                <Communities darkMode={darkMode} />
            </MenuList>
        </Menu>
    );
};
export default Directory;
