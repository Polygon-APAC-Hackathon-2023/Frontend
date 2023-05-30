import NumberInputs from "@/components/Number Input/NumberInputs";
import { fetchData, uploadMetadata } from "@/services/uploadMeta";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  NumberInput,
  Button,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { localhost } from "@wagmi/chains";
import { useState } from "react";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import {
  useContractEvent,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import Hypercert from "../../../public/Hypercert.json";
import Authenticate from "../../../public/Authenticate.json";
import { BigNumber } from "ethers";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import QRCode from "react-qr-code";

const CreateGrant = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [workScope, setWorkScope] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<number>(0);
  const [contributors, setContributors] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [endGrant, setEndGrant] = useState<number>(0);
  const [projectLink, setProjectLink] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { config } = usePrepareContractWrite({
    address: "0x0cDaa4A6df7b761C9785b399470e947e011E1955",
    abi: Hypercert.abi,
    functionName: "createGrant",
    args: [name, BigNumber.from(BigInt(endGrant)), result],
  });
  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { config: config2 } = usePrepareContractWrite({
    address: "0xEC324E5ED846F2E7aC94c3381056235CE2DB1343",
    abi: Authenticate.abi,
    functionName: "addressToId",
    args: [walletAddress],
  });

  const { data: data2, write: write2 } = useContractWrite(config2);

  const { isLoading: isLoading2, isSuccess: isSuccess2 } =
    useWaitForTransaction({
      hash: data2?.hash,
    });

  const handleSubmit = async () => {
    //call contract
    console.log(name, description, workScope, startDate, endDate);
    const result = await uploadMetadata({
      title: name,
      description: description,
      image: "",
      link: projectLink,
      properties: {
        workScope: workScope,
        startDate: BigNumber.from(BigInt(startDate)),
        endDate: BigNumber.from(BigInt(endDate)),
        contributors: contributors,
        endGrant: BigNumber.from(BigInt(endGrant)),
      },
    });
    setResult(result.path);
    if (write) {
      write();
    }
    // await fetchData("ad");
  };

  const connector = new MetaMaskConnector({
    chains: [localhost],
  });

  const qrProofRequestJson = {
    id: "7f38a193-0918-4a48-9fac-36adfdb8b542",
    typ: "application/iden3comm-plain-json",
    type: "https://iden3-communication.io/proofs/1.0/contract-invoke-request",
    thid: "7f38a193-0918-4a48-9fac-36adfdb8b542",
    body: {
      reason: "Proof request for create grant",
      transaction_data: {
        contract_address: "0xf6A4CF2F83165A35b7BE8A0463622B6cBEf958c1",
        method_id: "b68967e2",
        chain_id: 80001,
        network: "polygon-mumbai",
      },
      scope: [
        {
          id: 1,
          circuitId: "credentialAtomicQuerySigV2OnChain",
          query: {
            allowedIssuers: ["*"],
            context:
              "https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld",
            credentialSubject: {
              birthday: {
                $lt: 20020101,
              },
            },
            type: "KYCAgeCredential",
          },
        },
      ],
    },
  };

  return (
    <>
      <div className="flex justify-center align-middle">
        <div className="flex-col justify-center align-middle">
          <h1 className="text-[30px]">Create Grant</h1>
          <br />
          <div className="h-[500px] w-[500px]">
            {/** Box */}
            <FormControl>
              <FormLabel>Grant Name</FormLabel>
              <Input type="text" onChange={(e) => setName(e.target.value)} />
              <FormHelperText>
                Grant Name Example: Beach Cleaning
              </FormHelperText>
              <br />
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
              />
              <FormHelperText>Decription of Grant</FormHelperText>
              <br />
              <FormLabel>Work Scope</FormLabel>
              <Input
                type="text"
                onChange={(e) => setWorkScope(e.target.value)}
              />
              <div className="flex justify-center align-middle mt-[10px] text-[20px]">
                <h1>Duration of Work</h1>
              </div>
              <div className="flex justify-between align-middle">
                <div>
                  <FormLabel>Start Work Date</FormLabel>
                  <Input
                    placeholder="Select Date and Time"
                    size="lg"
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <FormLabel>End Work Date</FormLabel>
                  <Input
                    placeholder="Select Date and Time"
                    size="lg"
                    type="date"
                    onChange={(e) => {
                      setEndDate(new Date(e.target.value).getTime() / 1000);
                    }}
                  />
                </div>
              </div>
              <FormLabel>List of Contributors</FormLabel>
              <Input
                type="text"
                onChange={(e) => setContributors(e.target.value)}
              />
              <FormLabel>End of Grant</FormLabel>
              <Input
                placeholder="Select Date and Time"
                size="lg"
                type="date"
                onChange={(e) => {
                  setEndGrant(new Date(e.target.value).getTime() / 1000);
                }}
              />
              <FormLabel>Project Link</FormLabel>
              <Input
                type="text"
                onChange={(e) => setProjectLink(e.target.value)}
              />
              <FormHelperText>Link to Project (example: Github)</FormHelperText>
              <Button mt={4} colorScheme="teal" type="submit" onClick={onOpen}>
                Create
              </Button>
              <Modal
                blockScrollOnMount={false}
                isOpen={isOpen}
                onClose={onClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Proof of ID</ModalHeader>
                  <ModalCloseButton />
                  <Input onChange={(e) => setWalletAddress(e.target.value)} />
                  <ModalBody>
                    <Text fontWeight="bold" mb="1rem">
                      QR
                    </Text>
                    <QRCode
                      level="Q"
                      style={{ width: 256, marginLeft: 20 }}
                      value={JSON.stringify(qrProofRequestJson)}
                    />
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <Button
                      colorScheme="teal"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </FormControl>
            <div>
              {isLoading && <p>Waiting for transaction to be mined...</p>}
              {isSuccess && <p>Transaction was successful!</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateGrant;
