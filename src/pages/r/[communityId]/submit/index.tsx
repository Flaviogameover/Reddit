import { darkModeState } from "@/atoms/darkmodeAtom";
import About from "@/components/Comunity/About";
import PageContent from "@/components/Layout/PageContent";
import NewPostForm from "@/components/Posts/NewPostForm";
import { auth } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
import { Box, Text } from "@chakra-ui/react";
import { NextPage } from "next/types";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

const CommunitySubmit: NextPage = () => {
    const [user] = useAuthState(auth);
    const { darkMode } = useRecoilValue(darkModeState);
    // const communityStateValue = useRecoilValue(communityState);
    const { communityStateValue } = useCommunityData();
    return (
        <PageContent>
            <>
                <Box
                    p={"14px 0"}
                    borderBottom={"1px solid"}
                    borderColor={"white"}
                    fontWeight={700}
                >
                    <Text
                        {...(darkMode && {
                            color: "dark_text",
                        })}
                    >
                        Create a post
                    </Text>
                </Box>
                {user && (
                    <NewPostForm
                        user={user}
                        communityImageURL={
                            communityStateValue.currentCommunity?.imageURL
                        }
                    />
                )}
            </>
            <>
                {communityStateValue.currentCommunity && (
                    <About
                        communityData={communityStateValue.currentCommunity}
                    />
                )}
            </>
        </PageContent>
    );
};
export default CommunitySubmit;
