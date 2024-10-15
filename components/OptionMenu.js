import { Menu, Pressable, Box, ZStack } from 'native-base';
import React, { useRef } from "react";
import { SvgXml } from 'react-native-svg'; // Import SvgXml to use custom SVGs

export default OptionMenu = ({ navigation }) => {
    // const navigationRef = useRef();
    function inviteFriend() {
        console.log('invite friend')
        // navigationRef.current?.navigate("Invite");
        navigation.navigate("Invite");
    }


    return (
      <ZStack alignSelf="flex-end" mr="17%" mt="17%">
        <Box alignItems="flex-start" shadow={2}>
          <Menu shadow={2} ml="-100" mt="-10%" w="160" borderRadius="15" trigger={(triggerProps) => {
              return (
                <Pressable accessibilityLabel="Options menu" {...triggerProps}>
                  <SvgXml xml={plusSvg} width={30} height={30} />
                </Pressable>
              );
            }}
          >
            {/* Use custom SVG in menu item */}
            <Menu.Item px="0" onPress={inviteFriend}>
              <SvgXml xml={addUserSvg} width={24} height={24} /> Add a friend
            </Menu.Item>
            <Menu.Item px="0">Test</Menu.Item>
            <Menu.Item px="0">Test</Menu.Item>
          </Menu>
        </Box>
      </ZStack>
    );
};


const plusSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <path fill="#191919" class="cls-1" d="M25,45.47c-11.29,0-20.47-9.18-20.47-20.47S13.71,4.53,25,4.53s20.47,9.18,20.47,20.47-9.18,20.47-20.47,20.47ZM25,8.53c-9.08,0-16.47,7.39-16.47,16.47s7.39,16.47,16.47,16.47,16.47-7.39,16.47-16.47-7.39-16.47-16.47-16.47Z"/><path class="cls-1" d="M32.49,27h-14.98c-1.1,0-2-.9-2-2s.9-2,2-2h14.98c1.1,0,2,.9,2,2s-.9,2-2,2Z"/><path class="cls-1" d="M25,34.49c-1.1,0-2-.9-2-2v-14.98c0-1.1.9-2,2-2s2,.9,2,2v14.98c0,1.1-.9,2-2,2Z"/></svg>
    `;

const addUserSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50" height="50">
      <path fill="#191919" class="cls-1" d="M23.91,27.24c-5.8,0-10.51-4.72-10.51-10.51s4.72-10.51,10.51-10.51,10.51,4.72,10.51,10.51-4.72,10.51-10.51,10.51ZM23.91,8.62c-4.47,0-8.11,3.64-8.11,8.11s3.64,8.11,8.11,8.11,8.11-3.64,8.11-8.11-3.64-8.11-8.11-8.11Z"/><path class="cls-1" d="M6.06,40.18c-.65,0-1.18-.51-1.2-1.16-.06-1.63.09-7.29,4.27-11.73,3.18-3.37,6.93-4.24,8.89-4.45.66-.07,1.25.4,1.33,1.07.07.66-.4,1.26-1.07,1.33-1.63.18-4.75.9-7.39,3.71-3.54,3.77-3.66,8.6-3.62,10,.02.66-.5,1.22-1.16,1.24-.01,0-.03,0-.04,0Z"/><path class="cls-1" d="M38.29,30.17c-.52,0-.99-.33-1.15-.85-.16-.52-.64-1.52-2.08-2.45-1.95-1.26-4.41-1.56-5.38-1.63-.66-.05-1.16-.63-1.11-1.29s.62-1.16,1.29-1.11c1.43.11,4.17.51,6.5,2.01,1.99,1.28,2.78,2.76,3.09,3.78.19.64-.17,1.31-.8,1.5-.12.04-.23.05-.35.05Z"/><path class="cls-1" d="M39.14,43.79c-.66,0-1.2-.54-1.2-1.2v-9.61c0-.66.54-1.2,1.2-1.2s1.2.54,1.2,1.2v9.61c0,.66-.54,1.2-1.2,1.2Z"/><path class="cls-1" d="M43.95,38.99h-9.61c-.66,0-1.2-.54-1.2-1.2s.54-1.2,1.2-1.2h9.61c.66,0,1.2.54,1.2,1.2s-.54,1.2-1.2,1.2Z"/></svg>
      </svg>
    `;
