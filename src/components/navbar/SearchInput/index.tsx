import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import React from "react";
import { useRouter } from "next/router";
import { darkModeState } from "@/atoms/darkmodeAtom";
import { useRecoilValue } from "recoil";

type TSearch = {
    user?: User | null;
};

const SearchInput: React.FC<TSearch> = ({ user }) => {
    const [search, setSearch] = React.useState<string>("");
    const {darkMode} = useRecoilValue(darkModeState);
    const router = useRouter();
    return (
        <Flex
            flexGrow={1}
            mr={2}
            align={"center"}
            maxWidth={"600px"}
            width={"100%"}
        >
            {" "}
            <InputGroup outline={"none"}>
                <InputLeftElement
                    cursor={"pointer"}
                    onClick={() =>
                        {
                            search && router.push(`/search?q=${search}&type=posts`);
                        }
                    }
                    children={
                        <SearchIcon
                            color={
                                darkMode
                                    ? "dark_text"
                                    : "gray.400"
                            }
                            _hover={{
                                color: darkMode
                                    ? "dark_border_hover"
                                    : "gray.500",
                            }}
                            mb={1}
                        />
                    }
                />
                <Input
                    placeholder="Search Reddit"
                    fontSize={"10pt"}
                    _placeholder={{
                        color: darkMode
                            ? "dark_text"
                            : "gray.500",
                    }}
                    bg={
                        darkMode
                            ? "dark_posts_bright"
                            : "gray.50"
                    }
                    color={darkMode ? "dark_text" : "gray.500"}
                    border={"1px solid"}
                    borderColor={
                        darkMode ? "dark_border" : "gray.300"
                    }
                    _hover={{
                        border: "1px solid",
                        borderColor: darkMode
                            ? "dark_border_hover"
                            : "blue.500",
                    }}
                    _focus={{
                        border: "1px solid",
                        borderColor: darkMode
                            ? "dark_text"
                            : "blue.500",
                    }}
                    _focusVisible={{
                        border: "1px solid",
                        borderColor: darkMode
                            ? "dark_text"
                            : "blue.500",
                    }}
                    height={"34px"}
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            router.push(`/search?q=${search}`);
                        }
                    }}
                />
                {search && (
                    <InputRightElement
                        cursor={"pointer"}
                        onClick={() => setSearch("")}
                        children={
                            <CloseIcon
                                color={
                                    darkMode
                                        ? "dark_text"
                                        : "gray.400"
                                }
                                _hover={{
                                    color: darkMode
                                        ? "dark_border_hover"
                                        : "gray.500",
                                }}
                                mb={1}
                            />
                        }
                    />
                )}
            </InputGroup>
        </Flex>
    );
};
export default SearchInput;
