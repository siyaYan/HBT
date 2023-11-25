import React, { useState } from 'react';
import { VStack, FormControl, Input, Button } from 'native-base'; // Adjust based on

function BuildForm() {
  const [formData, setData] = useState({});
  const [errors, setErrors] = useState({});

  const validate = () => {
    const isValidLength = formData.length >= 8 && input.length <= 20;
    const hasLetter = /[a-zA-Z]/.test(input);
    const hasNumber = /\d/.test(input);
    const hasNoSpaces = !/\s/.test(input);
    const hasValidSpecialCharacters = /^[a-zA-Z0-9%&_?#=-]*$/.test(input);

    // return isValidLength && hasLetter && hasNumber && hasNoSpaces && hasValidSpecialCharacters;
    if (formData.name === undefined) {
      setErrors({
        ...errors,
        name: 'Name is required'
      });
      return false;
    } else if (formData.name.length < 3) {
      setErrors({
        ...errors,
        name: 'Name is too short'
      });
      return false;
    }
    //   Between 8-20 characters
    //   Must include a letter and a number 
    // Cannot have any spaces 
    //   Special characters allowed: %&amp;_?#=-

    return true;
  };

  const onSubmit = () => {
    validate() ? console.log('Submitted') : console.log('Validation Failed');
  };

  return <VStack width="90%" mx="3" maxW="300px">
    <FormControl isRequired isInvalid={'name' in errors}>
      <FormControl.Label _text={{
        bold: true
      }}>Name</FormControl.Label>
      <Input placeholder="John" onChangeText={value => setData({
        ...formData,
        name: value
      })} />
      {'name' in errors ? <FormControl.ErrorMessage>Error</FormControl.ErrorMessage> : <FormControl.HelperText>
        Name should contain atleast 3 character.
      </FormControl.HelperText>}
    </FormControl>
    <Button onPress={onSubmit} mt="5" colorScheme="cyan">
      Submit
    </Button>
  </VStack>;
}

export default BuildForm;