import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { TFormTabs } from "../NewPostForm";

type TTabItem = {
    item: TFormTabs;
    selected: boolean;
    setSelectedForm: (
        value: "Post" | "Images & Videos" | "Link" | "Poll" | "Talk"
    ) => void;
    darkMode: boolean;
};

const TabItem: React.FC<TTabItem> = ({
    item,
    selected,
    setSelectedForm,
    darkMode,
}) => {
    return (
        <Flex
            justify={"center"}
            align={"center"}
            flexGrow={1}
            p={"14px 0px"}
            cursor={"pointer"}
            fontWeight={700}
            _hover={{ bg: darkMode ? "dark_border" : "gray.50" }}
            color={
                selected
                    ? darkMode
                        ? "dark_text"
                        : "blue.500"
                    : darkMode
                    ? "#6e6e6e"
                    : "gray.500"
            }
            borderWidth={"0 1px 2px 0"}
            borderRightColor={"gray.200"}
            borderBottomColor={
                selected
                    ? darkMode
                        ? "dark_text"
                        : "blue.500"
                    : darkMode
                    ? "#6e6e6e"
                    : "gray.200"
            }
            onClick={() => setSelectedForm(item.title)}
        >
            <Flex align={"center"} height={"20px"} mr={2}>
                <Icon as={item.icon} />
            </Flex>
            <Text fontSize={"10pt"}>{item.title}</Text>
        </Flex>
    );
};
export default TabItem;
