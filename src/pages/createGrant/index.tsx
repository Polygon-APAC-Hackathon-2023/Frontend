import NumberInputs from "@/components/Number Input/NumberInputs";
import { FormControl, FormLabel, FormHelperText, Input, NumberInput, Button, NumberDecrementStepper, NumberIncrementStepper, NumberInputField, NumberInputStepper } from "@chakra-ui/react";
import { useState } from "react";

const CreateGrant = () => {
    const [name, setName] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [fund,setFund] = useState<number>(50);
    const format = (val: any) => `$` + val
    const parse = (val: any) => val.replace(/^\$/, '')

    const handleSubmit = () => {
        //call contract
    }

    return (
        <>
        <div className="flex justify-center align-middle">
        <div className="flex-col justify-center align-middle">
            <h1 className="text-[30px]">Create Grant</h1>
            <br/>
            <div className="h-[500px] w-[500px]" >
                {/** Box */}
                <FormControl>
                <FormLabel>Grant Name</FormLabel>
                <Input type='text' onChange={(e)=> setName(e.target.value)}/>
                <FormHelperText>Grant Name Example: Beach Cleaning</FormHelperText>
                <br/>
                <FormLabel>Description</FormLabel>
                <Input type='text' onChange={(e)=>setDescription(e.target.value)}/>
                <FormHelperText>Decription of Grant</FormHelperText>
                <br/>
                <FormLabel>Funds Needed</FormLabel>
                <NumberInput
                    onChange={(valueString) => setFund(parse(valueString))}
                    value={format(fund)}
                    defaultValue={50}
                    min={50}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <FormHelperText>Target of Funds Needed Min: $50</FormHelperText>
                <Button
                    mt={4}
                    colorScheme='teal'
                    type='submit'
                    onClick={handleSubmit}
                >
                    Create
                </Button>
                </FormControl>
            </div>
        </div>
        </div>
        </>
    )
}

export default CreateGrant;