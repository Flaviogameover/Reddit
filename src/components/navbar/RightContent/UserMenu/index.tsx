import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
    Flex,
    Icon,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
} from "@chakra-ui/react";
import { signOut, User } from "firebase/auth";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { FaRedditSquare } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { MdOutlineLogin } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { useSetRecoilState } from "recoil";

type TUserMenu = {
    user?: User | null;
    darkMode: boolean;
};

const UserMenu: React.FC<TUserMenu> = ({ user, darkMode }) => {
    const setAuthModalState = useSetRecoilState(authModalState);

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <Menu>
            <MenuButton
                cursor={"pointer"}
                padding={"0 6px"}
                borderRadius={4}
                _hover={{
                    outline: "1px solid",
                    outlineColor: "gray.200",
                }}
            >
                <Flex align={"center"}>
                    <Flex align={"center"}>
                        {user ? (
                            <>
                                <Icon
                                    fontSize={24}
                                    mr={1}
                                    color={darkMode ? "dark_text" : "gray.500"}
                                    as={FaRedditSquare}
                                />
                                <Flex
                                    direction={"column"}
                                    display={{ base: "none", md: "flex" }}
                                    fontSize={"8pt"}
                                    align={"flex-start"}
                                    mr={8}
                                >
                                    <Text
                                        {...(darkMode && {
                                            color: "dark_text",
                                        })}
                                        fontWeight={700}
                                    >
                                        {user?.displayName ||
                                            user.email?.split("@")[0]}
                                    </Text>
                                    <Flex
                                        {...(darkMode && {
                                            color: "dark_text",
                                        })}
                                    >
                                        <Icon
                                            as={IoSparkles}
                                            color={"brand.100"}
                                            mr={1}
                                        />
                                        <Text color={"gray.400"}>1 karma</Text>
                                    </Flex>
                                </Flex>
                            </>
                        ) : (
                            <Icon
                                as={VscAccount}
                                color={"gray.400"}
                                mr={1}
                                fontSize={24}
                            />
                        )}
                    </Flex>
                    <ChevronDownIcon {...(darkMode && {
                                            color: "dark_text",
                                        })} />
                </Flex>
            </MenuButton>
            {user ? (
                <MenuList
                    p={1}
                    {...(darkMode && {
                        bg: "dark_posts",
                        border: "1px solid",
                        borderColor: "dark_border_hover",
                        color: "dark_text",
                    })}
                >
                    <MenuItem
                        fontSize={"10pt"}
                        fontWeight={700}
                        {
                            ...darkMode && {
                                bg: "dark_posts"
                            }
                        }
                        _hover={{ bg: darkMode ? "dark_border" : "blue.500", color: "white" }}
                    >
                        <Flex align={"center"}>
                            <Icon fontSize={20} mr={2} as={CgProfile} />
                            Profile
                        </Flex>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                        fontSize={"10pt"}
                        fontWeight={700}
                        {
                            ...darkMode && {
                                bg: "dark_posts"
                            }
                        }
                        _hover={{ bg: darkMode ? "dark_border" : "blue.500", color: "white" }}
                        onClick={logout}
                    >
                        <Flex align={"center"}>
                            <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                            Log Out
                        </Flex>
                    </MenuItem>
                </MenuList>
            ) : (
                <MenuList p={1} {
                    ...darkMode && {
                        bg: "dark_posts",
                        color: "dark_text"
                    }
                }>
                    <MenuItem
                        fontSize={"10pt"}
                        fontWeight={700}
                        {
                            ...darkMode && {
                                bg: "dark_posts",
                            }
                        }
                        _hover={{ bg: darkMode ? "dark_posts_bright" : "blue.500", color: "white" }}
                        onClick={() =>
                            setAuthModalState({ open: true, type: "login" })
                        }
                    >
                        <Flex align={"center"} >
                            <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
                            Log in / Sign Up
                        </Flex>
                    </MenuItem>
                </MenuList>
            )}
        </Menu>
    );
};
export default UserMenu;
