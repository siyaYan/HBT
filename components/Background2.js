
import { Image, useWindowDimensions } from "react-native";
import {
  Box,
  Button,
} from "native-base";
const Background2 = () => {

  const windowWidth = useWindowDimensions().width;
  const imageHeight = windowWidth * 1.8;
    return(
        <Box
        position="absolute"
        // top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundColor={"#f9f8f2"}
        opacity={0.2} // Set the opacity to 0.2 for 80% transparency
      >
        <Image
          source={require("../assets/BackgroundMenu.png")}
          style={{ width: '100%', height:imageHeight }}
          alt="image"
          resizeMode="cover"
        />
      </Box>
    )
}


export default Background2;