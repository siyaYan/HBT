
import { Image } from "react-native";
import {
  Box,
  Button,
} from "native-base";
const Background = () => {

    return(
        <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundColor={"#f9f8f2"}
        opacity={0.15} // Set the opacity to 0.2 for 80% transparency
      >
        <Image
          source={require("../assets/background.png")}
          style={{ width: "100%", height: "100%" }}
          alt="image"
        />
      </Box>
    )
}


export default Background;