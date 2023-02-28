import React from "react";
import Navbar from "../navbar";

type TLayout = {
    children: React.ReactNode;
};

const index: React.FC<TLayout> = ({ children }) => {
    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    );
};
export default index;
