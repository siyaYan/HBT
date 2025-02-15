import { Menu, Pressable, Box, ZStack } from 'native-base';
import React, { useRef } from "react";
import { SvgXml } from 'react-native-svg'; // Import SvgXml to use custom SVGs
import UserManual from '../screens/UserMenual';

export default OptionMenu = ({ navigation }) => {
    // const navigationRef = useRef();
    function inviteFriend() {
        console.log('invite friend')
        // navigationRef.current?.navigate("Invite");
        navigation.navigate("Invite");
    }

    return (
      <ZStack alignSelf="flex-end" mr="15%" mt="15%">
        <Box alignItems="flex-start" shadow={2}>
          <Menu ml="-110" mt="-10%" w="160" borderRadius="15" trigger={(triggerProps) => {
              return (
                <Pressable accessibilityLabel="Options menu" {...triggerProps}>
                  <SvgXml xml={plusSvg} width={30} height={30} />
                </Pressable>
              );
            }}
          >
            {/* Use SVG in menu item */}
            <Menu.Item px="0" onPress={inviteFriend}>
              <SvgXml xml={addUserSvg} width={24} height={24} /> Add a friend
            </Menu.Item>
            <Menu.Item px="0"onPress={UserManual}>
            <SvgXml xml={infoSVG} width={24} height={24} /> How to play?</Menu.Item>
            {/* <Menu.Item px="0">Test</Menu.Item> */}
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

    const infoSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
      <defs>
        <style>
          .st0{fill:#93D8C5;}
          .st1{fill:none;stroke:#93D8C5;stroke-width:2;stroke-miterlimit:10;}
          .st2{fill:none;stroke:#231F20;stroke-miterlimit:10;}
          .st3{fill:#231F20;}
          .st4{fill:#FFFFFF;}
          .st5{fill:none;stroke:#000000;stroke-width:2;stroke-miterlimit:10;}
          .st6{stroke:#000000;stroke-miterlimit:10;}
          .st7{fill:#FF061E;}
          .st8{fill:#BDDB6B;}
          .st9{fill:#49A579;}
          .st10{fill:#6666FF;}
          .st11{fill:#191919;}
          .st12{fill:#F9F8F2;}
        </style>
      </defs>
      <path d="M47.26,6.77c-1.04-2.06-9.12-0.63-15.46,1.95C20.48,13.31,7.26,24.67,8.95,35.21c0.46,2.89,2.28,7.13,5.88,8.54
        c3.03,1.18,6.04-0.13,8.45-1.17c4.69-2.04,9.52-6.36,10.98-11.33c0.25-0.85,0.84-2.96,1.85-6.27c0.28-0.94,0.66-2.03,1.22-3.4
        c0.66-1.63,1.61-3.45,3.09-5.59C44.36,10.28,48.01,8.27,47.26,6.77z M26.74,34.84c-0.12,0.24-0.28,0.45-0.48,0.67
        c-0.19,0.21-0.31,0.35-0.37,0.41c-0.86,0.89-1.93,1.66-3.22,2.3c-1.29,0.65-2.57,1.04-3.84,1.2c-1.27,0.16-2.3,0.03-3.09-0.38
        c-0.75-0.39-1.19-0.98-1.32-1.78c-0.14-0.8,0.12-1.84,0.78-3.1c0.16-0.3,0.29-0.53,0.39-0.69l3.57-4.95
        c1.57-2.23,2.55-3.58,2.92-4.07c0.23-0.24,0.5-0.39,0.82-0.45c0.32-0.05,0.62-0.01,0.91,0.14c0.26,0.13,0.43,0.32,0.52,0.57
        c0.09,0.24,0.09,0.46,0.01,0.66c-1.48,2.01-3.62,4.99-6.43,8.96c-0.11,0.18-0.25,0.42-0.41,0.73c-0.34,0.65-0.49,1.17-0.44,1.56
        s0.26,0.67,0.63,0.86c0.64,0.34,1.52,0.36,2.61,0.08c1.09-0.28,2.22-0.75,3.38-1.42s2.17-1.39,3.04-2.2
        C26.91,34.21,26.91,34.52,26.74,34.84z M26.11,22.99c-1.17,0-2.11-0.95-2.11-2.11c0-1.17,0.95-2.11,2.11-2.11
        c1.17,0,2.11,0.95,2.11,2.11C28.22,22.04,27.27,22.99,26.11,22.99z"/>
    </svg>`;
  
