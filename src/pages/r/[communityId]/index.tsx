import { Community, communityState } from "@/atoms/communitiesAtom";
import CreatePostLink from "@/components/Comunity/CreatePostLink";
import Header from "@/components/Comunity/Header";
import CommunityNotFound from "@/components/Comunity/NotFound";
import PageContent from "@/components/Layout/PageContent";
import Posts from "@/components/Posts";
import { firestore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import { NextPage } from "next/types";
import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import safeJsonStringfy from "safe-json-stringify";
import About from "@/components/Comunity/About/index";
import { darkModeState } from "@/atoms/darkmodeAtom";

type TCommunityPage = {
    communityData: Community;
};

const CommunityId: NextPage<TCommunityPage> = ({ communityData }) => {
    const setCommunityStateValue = useSetRecoilState(communityState);
    const {darkMode} = useRecoilValue(darkModeState);
    if (!communityData) return <CommunityNotFound darkMode={darkMode}/>;

    useEffect(() => {
        setCommunityStateValue((prev) => ({
            ...prev,
            currentCommunity: communityData,
        }));
    }, [communityData]);

    return (
        <>
            <Header communityData={communityData} darkMode={darkMode} />
            <PageContent>
                <>
                    <CreatePostLink darkMode={darkMode}/>
                    <Posts communityData={communityData} darkMode={darkMode}/>
                </>
                <>
                    <About communityData={communityData} />
                </>
            </PageContent>
        </>
    );
};

const getServerSideProps = async (context: GetServerSidePropsContext) => {
    try {
        const communityDocRef = doc(
            firestore,
            "communities",
            context.query.communityId as string
        );

        const communityDoc = await getDoc(communityDocRef);
        console.log("communityDoc", communityDoc.data());
        return {
            props: {
                communityData: communityDoc.exists()
                    ? JSON.parse(
                          safeJsonStringfy({
                              id: communityDoc.id,
                              ...communityDoc.data(),
                          })
                      )
                    : "",
            },
        };
    } catch (e: any) {
        // add 404 error page redirect here;
        console.log("getServerSidePropss community page", e.message);
    }
};

export { getServerSideProps };
export default CommunityId;
