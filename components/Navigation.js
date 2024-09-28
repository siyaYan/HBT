
import { useState } from "react";
import { NativeBaseProvider, Text, Icon, HStack, Center, Pressable } from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 

const Navigation = ({ onSelect }) => {
    const [selected, setSelected] = useState(0);
    const handleSelect = (value) =>{
        setSelected(value)
        onSelect(value)
    }
    return(
    <NativeBaseProvider>
        <HStack alignItems="center" safeAreaBottom shadow={6}>
            <Pressable cursor="pointer" opacity={selected === 0 ? 1 : 0.5} py="3" flex={1} onPress={()=>handleSelect(0)}>
                <Center>
                    <Icon mb="1" as={<MaterialCommunityIcons name={selected === 0 ? 'home' : 'home-outline'} />} color="white" size="md" />
                    <Text color="white" fontSize="12">
                        Home
                    </Text>
                </Center>
            </Pressable>

            <Pressable cursor="pointer" opacity={selected === 1 ? 1 : 0.5} py="2" flex={1} onPress={()=>handleSelect(1)}>
                <Center>
                <Icon mb="1" as={<MaterialCommunityIcons name={selected === 3 ? 'account' : 'account-outline'} />} color="white" size="md" />
                    <Text color="white" fontSize="12">
                    Profile
                    </Text>
                </Center>
            </Pressable>
           
            <Pressable cursor="pointer" opacity={selected === 2 ? 1 : 0.6} py="2" flex={1} onPress={()=>handleSelect(2)}>
                <Center>
                    <Icon mb="1" as={Ionicons} color="white"  name={selected === 2 ? 'settings' : 'settings-outline'} size='md' />
                    <Text color="white" fontSize="12">
                        Setting
                    </Text>
                </Center>
            </Pressable>
            
        </HStack>
    </NativeBaseProvider>
    )
}


export default Navigation;