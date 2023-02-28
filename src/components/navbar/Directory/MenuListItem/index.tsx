import { TDirectoryMenu } from "@/atoms/directoryMenuAtom";
import { Flex, Icon, Image, MenuItem } from "@chakra-ui/react";
import React from "react";
import useDirectory from "@/hooks/useDirectory";
import { darkModeState } from "@/atoms/darkmodeAtom";
import { useRecoilValue } from 'recoil';

const MenuListItem: React.FC<TDirectoryMenu> = ({
    displayText,
    link,
    icon,
    iconColor,
    imageURL,
}) => {
    const { onSelectMenuItem } = useDirectory();
    const {darkMode} = useRecoilValue(darkModeState);
    return (
        <MenuItem
            width={"100%"}
            fontSize={"10pt"}
            _hover={{ bg: darkMode ? "dark_border" : "gray.100" }}
            {
                ...darkMode && {
                    color: "dark_text",
                    bg: "dark_posts"
                }
            }
            onClick={() =>
                onSelectMenuItem({
                    displayText,
                    link,
                    icon,
                    iconColor,
                    imageURL,
                })
            }
        >
            <Flex align={"center"}>
                {imageURL ? (
                    <Image
                        src={imageURL}
                        alt={"community"}
                        boxSize={"20px"}
                        mr={2}
                        borderRadius={"full"}
                    />
                ) : (
                    <Icon as={icon} fontSize={20} mr={2} color={iconColor} />
                )}
                {displayText}
            </Flex>
        </MenuItem>
    );
};
export default MenuListItem;
