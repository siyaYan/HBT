import { useState } from "react";
import { Center, Box, Heading, VStack, HStack, Button, NativeBaseProvider, Flex } from 'native-base';
import Navigation from '../components/Navigation'
import { Avatar } from "native-base";
import { useRoute } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [selected, setSelected] = useState();
  const route = useRoute();
  const { userName, token } = route.params; // Access parameters here

  function handleNavigate(value) {
    setSelected(value);
    console.log(value, selected);
    if (value == 0) {
      navigation.navigate('Home')
    }
    if (value == 1) {
      navigation.navigate('Account')
    }
    if (value == 2) {
      // navigation.navigate('Account')
    }
  }
  return (
    <NativeBaseProvider>
        <Flex direction="column" mt='5' alignItems='center'>
          <Avatar bg="purple.600" alignSelf="center" size="md" source={{
            uri: "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80"
          }}>
            {userName}
          </Avatar>
          <Box py='5' safeArea w="100%" maxW="290" alignItems="center">
            <Heading mt='140' size="lg" fontWeight="600" color="coolGray.300" _dark={{
              color: "Gray.50"
            }}>
              Home Page
            </Heading>
          </Box >
        </Flex>
      <Center flex={1} justifyContent="flex-end">
        <Box safeArea bg="black" w="100%" >
          <Flex direction='row' width='100%' >
            <Navigation onSelect={handleNavigate} />
          </Flex>
        </Box>
      </Center>
    </NativeBaseProvider>

  );
};

export default HomeScreen;
