import { Modal } from "native-base";
import { useState } from "react";
import { Center } from 'native-base';
import { FormControl, Input, Button, Pressable, Text } from 'native-base'; // Adjust based on
import { sendEmail } from "./MockApi";
import { Alert } from 'react-native';

const ResetModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const handleSubmit = () => {
        // Validate the email
        if (validateEmail(email)) {
            console.log({ email });
            // TODO: call end point
            // If the email is valid, you would typically make an API call to your backend here
            handleSentEmail();
            setShowModal(false);
            setEmail(''); // Clear the email state after successful submission
            setError(false)

        } else {
            setEmail(''); // Clear the email state after successful submission
            setError(true);
            // Keep the modal open and display the error message
        }
    };

    const handleSentEmail = async () => {
        try {
          // Call the mock registration function
          const response = await sendEmail(email);
          // Handle success or error response
          if (response.success) {
            Alert.alert('Success', response.message);
            // You can navigate to the login screen or perform other actions
          } else {
            Alert.alert('Error', response.message || 'Send email failed');
          }
        } catch (error) {
          console.error('Error during Send email:', error);
          Alert.alert('Error', 'Please try again later.');
        }
      };

    return (
        <Center>
            <Pressable onPress={() => setShowModal(true)}>
                <Text fontSize={15} color="indigo.500">forget password?</Text>
            </Pressable>
            {/* <Button onPress={() => setShowModal(true)}>Forget Password?</Button> */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header>Send Reset Password Email</Modal.Header>
                    <Modal.Body>
                        <FormControl mt="3" isInvalid={!!error} isRequired>
                            <FormControl.Label>Email</FormControl.Label>
                            <Input value={email} onChangeText={setEmail} />
                            {error ? <FormControl.ErrorMessage>Please enter a valid email address.</FormControl.ErrorMessage> : <FormControl.HelperText>
                                Example@gmail.com
                            </FormControl.HelperText>}
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setShowModal(false);
                                setError(false); // Clear any errors
                            }}>
                                Cancel
                            </Button>
                            <Button onPress={handleSubmit}>
                                Send
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Center>
    );
};

export default ResetModal;
