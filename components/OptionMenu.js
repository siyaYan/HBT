
import { Menu, Pressable, Box, ZStack } from 'native-base';

import { AntDesign } from '@expo/vector-icons';


export default OptionMenu = () => {
    function inviteFriend(value) {
        console.log('invite friend')
    }
    return (<ZStack alignSelf='flex-end' mr='15%' mt='10%' >
        <Box alignItems="flex-start">
            <Menu shadow={2} mr='2' w="140" trigger={triggerProps => {
                return <Pressable accessibilityLabel="Options menu" {...triggerProps}>
                    <AntDesign name="plus" size={24} color="black" />
                </Pressable>;
            }}>
                <Menu.Item px='0' onPress={inviteFriend}><AntDesign name="adduser" size={24} color="black" />Add a friend</Menu.Item>
                <Menu.Item px='0' >Test</Menu.Item>
                <Menu.Item px='0' >Test</Menu.Item>
            </Menu>
        </Box>
    </ZStack>)
}