import { auth } from "@/firebase/clientApp";
import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import RightContent from "./rightContent";
import SearchInput from "./searchInput";
import Directory from "@navbar/Directory";
import useDirectory from "@/hooks/useDirectory";
import { defaultMenuItem } from "@/atoms/directoryMenuAtom";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@/atoms/darkmodeAtom";

const Navbar: React.FC = () => {
    const [user, loading, error] = useAuthState(auth);
    const {darkMode} = useRecoilValue(darkModeState);
    const { onSelectMenuItem } = useDirectory();
    return (
        <Flex
            bg={darkMode ? "dark_posts" : "white"}
            borderBottom={"1px solid"}
            borderColor={darkMode ? "dark_border" : "gray.200"}
            padding={"12px 18px"}
            height={"44px"}
            justify={{ md: "space-between" }}
        >
            <Flex
                align={"center"}
                width={{ base: "40px", md: "auto" }}
                mr={{ base: 0, md: 2 }}
                cursor={"pointer"}
                onClick={() => onSelectMenuItem(defaultMenuItem)}
            >
                <Image
                    src={"/images/redditFace.svg"}
                    alt="reddit logo"
                    height={"30px"}
                />
                <Image
                    src={
                        darkMode
                            ? "/images/redditTextDark.svg"
                            : "/images/redditText.svg"
                    }
                    alt="reddit logo"
                    height={"46px"}
                    display={{ base: "none", md: "unset" }}
                />
            </Flex>
            {user && <Directory darkMode={darkMode}/>}
            <SearchInput user={user} />
            <RightContent user={user} />
        </Flex>
    );
};

export default Navbar;
