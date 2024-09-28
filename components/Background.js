
import { Image, useWindowDimensions } from "react-native";
import {
  Box,
  Button,
} from "native-base";
const Background = ({navigation}) => {
  const windowWidth = useWindowDimensions().width;
  const imageHeight = windowWidth * 1.78;
    return(
        <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundColor={"#f9f8f2"}
        opacity={0.3} // Set the opacity to 0.2 for 80% transparency
      >
        <Image
          source={require("../assets/BackgroundMain.png")}
          style={{ width: '100%', height:"100%" }}
          alt="image"
          resizeMode="cover"
        />
      </Box>
    )
}


export default Background;