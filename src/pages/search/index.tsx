import { Community } from "@/atoms/communitiesAtom";
import { darkModeState } from "@/atoms/darkmodeAtom";
import { Post } from "@/atoms/postsAtom";
import PersonalHome from "@/components/Comunity/PersonalHome";
import Premium from "@/components/Comunity/Premium";
import Recommendations from "@/components/Comunity/Recommendations";
import SearchType from "@/components/Comunity/SearchType";
import PageContent from "@/components/Layout/PageContent";
import SearchCommunity from "@/components/Posts/SearchCommunity";
import SearchPost from "@/components/Posts/SearchPost";
import { auth, firestore } from "@/firebase/clientApp";
import useCommunityData from "@/hooks/useCommunityData";
import {
    Button,
    Flex,
    Skeleton,
    SkeletonCircle,
    Text,
    Stack,
} from "@chakra-ui/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

const SearchPage: React.FC = () => {
    const { darkMode } = useRecoilValue(darkModeState);
    const [user] = useAuthState(auth);
    const router = useRouter();
    const { q, type } = router.query;
    const [searchResults, setSearchResults] = useState<Post[] | Community[]>(
        []
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);
    const { communityStateValue } = useCommunityData();

    const getSearchPosts = async () => {
        setLoading(true);
        setIsEmpty(false);

        try {
            const check_type = type === "communities" ? "communities" : "posts";
            const searchQuery = user
                ? query(
                      collection(firestore, check_type),
                      orderBy("createdAt", "desc")
                  )
                : query(
                      collection(firestore, check_type),
                      where("privacyType", "!=", "restricted"),
                      orderBy("privacyType", "desc")
                  );

            const searchDocs = await getDocs(searchQuery);
            let searchData: Post[] | Community[] = [];
            let filteredQuery: Post[] | Community[] = [];
            if (check_type === "posts") {
                searchData = searchDocs.docs.map(
                    (doc) =>
                        ({
                            id: doc.id,
                            ...doc.data(),
                        } as Post)
                );
                filteredQuery = searchData.filter((post) =>
                    post.title
                        .toLowerCase()
                        .includes(q?.toString().toLowerCase() as string)
                );
            } else {
                searchData = searchDocs.docs.map(
                    (doc) =>
                        ({
                            id: doc.id,
                            ...doc.data(),
                        } as Community)
                );
                filteredQuery = searchData.filter((community) =>
                    community.id
                        .toLowerCase()
                        .includes(q?.toString().toLowerCase() as string)
                );
            }
            if (!filteredQuery.length) {
                setIsEmpty(true);
            } else {
                setSearchResults(filteredQuery.slice(0, 10));
            }
        } catch (e: any) {
            console.log("getCommunityRecommendations error: ", e.message);
        }

        setLoading(false);
    };

    const handleClickType = (searchType: string) => {
        if (!q) return;
        if (searchType === type) return;
        setSearchResults([]);
        router.push(`/search?q=${q}&type=${searchType}`);
    };

    useEffect(() => {
        if (!q) return;
        getSearchPosts();
        return () => {
            setSearchResults([]);
        };
    }, [q, type, user]);

    return (
        <PageContent>
            <>
                {isEmpty ? (
                    <Flex direction={"column"} p={2} width={"100%"}>
                        <Stack direction={"row"} mb={2}>
                            <SearchType
                                handleClickType={handleClickType}
                                type={"posts"}
                                darkMode={darkMode}
                            />
                            <SearchType
                                handleClickType={handleClickType}
                                type={"communities"}
                                darkMode={darkMode}
                            />
                        </Stack>
                        <Flex
                            bg={darkMode ? "dark_posts" : "white"}
                            p={4}
                            justify={"center"}
                            align={"center"}
                            {...(darkMode && {
                                border: "1px solid",
                                borderColor: "dark_border",
                            })}
                        >
                            <Text
                                fontSize={"xl"}
                                fontWeight={700}
                                color={darkMode ? "dark_text" : "gray.500"}
                            >
                                No{" "}
                                {type === "posts" || !type
                                    ? "posts"
                                    : "communities"}{" "}
                                found
                            </Text>
                        </Flex>
                    </Flex>
                ) : (
                    <>
                        <Flex direction={"column"} p={2} width={"100%"}>
                            <Stack direction={"row"} mb={2}>
                                <SearchType
                                    handleClickType={handleClickType}
                                    type={"posts"}
                                    darkMode={darkMode}
                                />
                                <SearchType
                                    handleClickType={handleClickType}
                                    type={"communities"}
                                    darkMode={darkMode}
                                />
                            </Stack>
                            {loading ? (
                                <Flex direction={"column"}>
                                    <Flex
                                        bg={darkMode ? "dark_posts" : "white"}
                                        p={4}
                                        justify={"space-between"}
                                        align={"center"}
                                    >
                                        <SkeletonCircle size={"10"} />
                                        <Skeleton
                                            height={"10px"}
                                            width={"70%"}
                                        />
                                    </Flex>
                                </Flex>
                            ) : (
                                <>
                                    {type === "posts" || !type
                                        ? searchResults &&
                                          searchResults.map((post) => (
                                              <SearchPost
                                                  key={post.id}
                                                  searchResult={post as Post}
                                                  darkMode={darkMode}
                                              />
                                          ))
                                        : searchResults &&
                                          searchResults.map((community) => {
                                              const isJoined =
                                                  !!communityStateValue.mySnippets.find(
                                                      (snippet) =>
                                                          snippet.communityId ===
                                                          community.id
                                                  );

                                              return (
                                                  <SearchCommunity
                                                      key={community.id}
                                                      searchResult={
                                                          community as Community
                                                      }
                                                      isJoined={isJoined}
                                                  darkMode={darkMode}
                                                  />
                                              );
                                          })}
                                </>
                            )}
                        </Flex>
                    </>
                )}
            </>
            <>
                <Stack spacing={5}>
                    <Recommendations darkMode={darkMode} />
                    <Premium darkMode={darkMode} />
                    <PersonalHome darkMode={darkMode} />
                </Stack>
            </>
        </PageContent>
    );
};
export default SearchPage;
