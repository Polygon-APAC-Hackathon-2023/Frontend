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
} from "@chakra-ui/react";
import { useState } from "react";

const CreateGrant = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [workScope, setWorkScope] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [contributors, setContributors] = useState<string>("");

  const handleSubmit = async () => {
    //call contract
    console.log(name, description, workScope, startDate, endDate);
    uploadMetadata({ name: name });
    // await fetchData("ad");
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
              <FormHelperText>Work Scope</FormHelperText>
              <div className="flex justify-between align-middle">
                <div>
                  <FormLabel>Start Date</FormLabel>
                  <Input
                    placeholder="Select Date and Time"
                    size="lg"
                    type="date"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <FormLabel>End Date</FormLabel>
                  <Input
                    placeholder="Select Date and Time"
                    size="lg"
                    type="date"
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <FormLabel>List of Contributors</FormLabel>
              <Input
                type="text"
                onChange={(e) => setContributors(e.target.value)}
              />
              <Button
                mt={4}
                colorScheme="teal"
                type="submit"
                onClick={handleSubmit}
              >
                Create
              </Button>
            </FormControl>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateGrant;
