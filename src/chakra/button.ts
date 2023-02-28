import { ComponentStyleConfig } from "@chakra-ui/react";

export const Button: ComponentStyleConfig = {
    baseStyle: {
        borderRadius: "60px",
        fontSize: "10pt",
        fontWeight: 700,
        _focus: {
            boxShadow: "none",
        },
    },
    sizes: {
        sm: {
            fontSize: "8pt",
        },
        md: {
            fontSize: "10pt",
        },
    },
    variants: {
        solid: {
            color: "white",
            bg: "blue.500",
            _hover: {
                bg: "blue.400",
            },
        },
        outline: {
            color: "blue.500",
            border: "1px solid",
            borderColor: "blue.500",
        },
        dark: {
            bg: "dark_posts_bright",
            color: "dark_text",
            _hover: {
                borderColor: "dark_border_hover",
            },
            border: "1px solid",
            borderColor: "dark_border",
        },
        dark_selected: {
            bg: "dark_posts_dark",
            color: "dark_text",
            _hover: {
                borderColor: "dark_border_hover",
            },
            border: "1px solid",
            borderColor: "dark_border",
        },
        oauth: {
            height: "34px",
            border: "1px solid",
            borderColor: "gray.300",
            _hover: {
                bg: "gray.50",
            },
        },
    },
};
