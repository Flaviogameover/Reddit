import { Flex, Image } from "@chakra-ui/react";
import React from "react";

const Navbar: React.FC = () => {
    return (
        <Flex bg={"white"} padding={"6px 12px"} height={"44px"}>
            <Flex align={"center"}>
                <Image
                    src={"/images/redditFace.svg"}
                    alt="reddit logo"
                    height={"30px"}
                />
                <Image
                    src={"/images/redditText.svg"}
                    alt="reddit logo"
                    height={"46px"}
                    display={{ base: "none", md: "unset" }}
                />
            </Flex>
            
        </Flex>
    );
};
export default Navbar;
