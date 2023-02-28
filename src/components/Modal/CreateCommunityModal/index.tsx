import { communityModalState } from "@/atoms/communityModalAtom";
import ImageUpload from "@/components/Posts/ImageUpload";
import { auth, firestore, storage } from "@/firebase/clientApp";
import useDirectory from "@/hooks/useDirectory";
import useSelectFile from "@/hooks/useSelectFile";
import {
    Box,
    Button,
    Checkbox,
    Divider,
    Flex,
    Icon,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
} from "@chakra-ui/react";
import {
    doc,
    getDoc,
    runTransaction,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { uploadString, getDownloadURL, ref } from "firebase/storage";
import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import { useRecoilState } from "recoil";

type TCreateCommunityModal = {
    darkMode: boolean;
};

const CreateCommunityModal: React.FC<TCreateCommunityModal> = ({
    darkMode,
}) => {
    const [user] = useAuthState(auth);
    const [communityName, setCommunityName] = useState<string>("");
    const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();

    const [characterRemaining, setCharacterRemaining] = useState<number>(
        (communityName.length - 21) * -1
    );
    const [communityType, setCommunityType] = useState<string>("public");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { toggleMenuOpen } = useDirectory();
    const [communityModal, setCommunityModal] =
        useRecoilState(communityModalState);
    const router = useRouter();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let chars = e.target.value;
        if (chars.length <= 21) {
            setCommunityName(chars);
            setCharacterRemaining((chars.length - 21) * -1);
        }
        return;
    };

    const onCommunityTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCommunityType(e.target.name);
    };

    const handleCreateCommunity = async () => {
        if (error) setError("");
        const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        // Validate commnunity name
        if (format.test(communityName) || communityName.length < 3) {
            setError(
                "Community name must be at least 3 characters and cannot contain special characters"
            );
            return;
        }

        // Create the community document in firestore
        // check that name is not taken
        // if valid name, create community
        setLoading(true);
        try {
            const communityDocRef = doc(
                firestore,
                "communities",
                communityName
            );

            const communityDoc = await getDoc(communityDocRef);

            await runTransaction(firestore, async (transaction) => {
                if (communityDoc.exists())
                    throw new Error(
                        `Sorry, r/${communityName} is taken. Try another.`
                    );

                transaction.set(communityDocRef, {
                    creatorId: user?.uid,
                    createdAt: serverTimestamp(),
                    numberOfMembers: 1,
                    privacyType: communityType,
                });

                transaction.set(
                    doc(
                        firestore,
                        `users/${user?.uid}/communitySnippets`,
                        communityName
                    ),
                    {
                        communityId: communityName,
                        isModerator: true,
                    }
                );
            });
            if (selectedFile) {
                const imageRef = ref(
                    storage,
                    `communities/${communityName}/banner`
                );
                await uploadString(imageRef, selectedFile, "data_url");
                const downloadURL = await getDownloadURL(imageRef);
                await updateDoc(communityDocRef, { banner: downloadURL });
            }
            setCommunityModal({ open: false });
            toggleMenuOpen();
            router.push(`/r/${communityName}`);
        } catch (e: any) {
            console.log("handleCreateCommunity", e);
            setError(e.message);
        }
        setLoading(false);
    };

    return (
        <>
            <Modal
                isOpen={communityModal.open}
                onClose={() => {
                    setCommunityModal({ open: false });
                }}
                size={"lg"}
            >
                <ModalOverlay />
                <ModalContent
                    {...(darkMode && {
                        bg: "dark_posts",
                        border: "1px solid",
                        borderColor: "dark_border",
                    })}
                >
                    <ModalHeader
                        display={"flex"}
                        flexDirection={"column"}
                        fontSize={15}
                        padding={3}
                        {...(darkMode && {
                            color: "dark_text",
                        })}
                    >
                        Create Communiy
                    </ModalHeader>
                    <Box pl={3} pr={3}>
                        <Divider />
                        <ModalCloseButton />
                        <ModalBody
                            display={"flex"}
                            flexDirection={"column"}
                            padding={"10px 0"}
                            {...(darkMode && {
                                color: "dark_text",
                            })}
                        >
                            <Text fontWeight={600} fontSize={15}>
                                Name
                            </Text>
                            <Text fontSize={11} color={"gray.500"}>
                                Community names includingcapitalization cannot
                                be change
                            </Text>
                            <Text
                                position={"relative"}
                                top={"28px"}
                                left={"10px"}
                                width={"20px"}
                                color={"gray.400"}
                            >
                                r/
                            </Text>
                            <Input
                                position={"relative"}
                                value={communityName}
                                onChange={handleChange}
                                size={"sm"}
                                pl="22px"
                            />
                            <Text
                                fontSize={"9pt"}
                                color={
                                    characterRemaining === 0
                                        ? "red"
                                        : "gray.500"
                                }
                            >
                                {characterRemaining} Characters Remaining{" "}
                            </Text>
                            <Text fontSize={"9pt"} color="red" pt={1}>
                                {error}
                            </Text>
                            <Text fontWeight={600} fontSize={15}>
                                Banner
                            </Text>
                            <ImageUpload
                                onSelectImage={onSelectFile}
                                selectedFile={selectedFile}
                                setSelectedFile={setSelectedFile}
                                caller={"community"}
                                darkMode={darkMode}
                            />
                            <Box mt={4} mb={4}>
                                <Text fontWeight={600} fontSize={15}>
                                    Community Type
                                </Text>
                                <Stack spacing={2}>
                                    <Checkbox
                                        name={"public"}
                                        isChecked={communityType === "public"}
                                        onChange={onCommunityTypeChange}
                                        {...(darkMode && {
                                            colorScheme: "dark_posts",
                                        })}
                                    >
                                        <Flex align={"center"}>
                                            <Icon
                                                as={BsFillPersonFill}
                                                color={"gray.500"}
                                                mr={2}
                                            />
                                            <Text fontSize={"10pt"} mr={1}>
                                                Public
                                            </Text>
                                            <Text
                                                fontSize={"8pt"}
                                                color={"gray.500"}
                                            >
                                                Anyone can view, post and
                                                comment to this community
                                            </Text>
                                        </Flex>
                                    </Checkbox>
                                    <Checkbox
                                        name={"restricted"}
                                        isChecked={
                                            communityType === "restricted"
                                        }
                                        {...(darkMode && {
                                            colorScheme: "dark_posts",
                                        })}
                                        onChange={onCommunityTypeChange}
                                    >
                                        <Flex align={"center"}>
                                            <Icon
                                                as={BsFillEyeFill}
                                                color={"gray.500"}
                                                mr={2}
                                            />
                                            <Text fontSize={"10pt"} mr={1}>
                                                Restricted
                                            </Text>
                                            <Text
                                                fontSize={"8pt"}
                                                color={"gray.500"}
                                            >
                                                Anyone can view this community,
                                                but only approved users can post
                                            </Text>
                                        </Flex>
                                    </Checkbox>
                                    <Checkbox
                                        name={"private"}
                                        isChecked={communityType === "private"}
                                        onChange={onCommunityTypeChange}
                                        {...(darkMode && {
                                            colorScheme: "dark_posts",
                                        })}
                                    >
                                        <Flex align={"center"}>
                                            <Icon
                                                as={HiLockClosed}
                                                color={"gray.500"}
                                                mr={2}
                                            />
                                            <Text fontSize={"10pt"} mr={1}>
                                                Private
                                            </Text>
                                            <Text
                                                fontSize={"8pt"}
                                                color={"gray.500"}
                                            >
                                                Only approved users can view and
                                                submit to this community
                                            </Text>
                                        </Flex>
                                    </Checkbox>
                                </Stack>
                            </Box>
                        </ModalBody>
                    </Box>
                    <ModalFooter
                        bg={darkMode ? "dark_posts_dark" : "gray.100"}
                        borderRadius={"0 0 10px 10px"}
                    >
                        <Button
                            variant={darkMode ? "dark" : "outline"}
                            height={"30px"}
                            mr={3}
                            onClick={() => setCommunityModal({ open: false })}
                        >
                            Cancel
                        </Button>
                        <Button
                            height={"30px"}
                            onClick={handleCreateCommunity}
                            isLoading={loading}
                            {...(darkMode && {
                                variant: "dark_selected",
                            })}
                        >
                            Create Community
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export default CreateCommunityModal;
