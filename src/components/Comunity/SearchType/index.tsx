import { Button } from "@chakra-ui/react";
import React from "react";

type TSearchType = {
    handleClickType: (search: string) => void;
    type: string;
    darkMode: boolean;
};

const SearchType: React.FC<TSearchType> = ({ handleClickType, type, darkMode }) => {
    return (
        <Button
            variant={darkMode ? "dark" : "outline"}
            borderRadius={100}
            _hover={{
                bg: darkMode ? "dark_posts" : "gray.100",
            }}
            onClick={() => handleClickType(type)}
        >
            {type.charAt(0).toUpperCase() + type.slice(1)}
        </Button>
    );
};
export default SearchType;
