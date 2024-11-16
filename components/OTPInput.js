import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const OTPInput = ({ value, onChange }) => {
  // Split the value into an array of digits if verifyToken has value, otherwise an empty array
  const [otp, setOtp] = useState(
    value ? value.split("") : new Array(6).fill("")
  );

  const handleChange = (text, index) => {
    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Combine the OTP array into a single string and pass it back via onChange
    onChange && onChange(newOtp.join(""));

    // Focus logic
    if (text.length === 1 && index < 5) {
      // Move to next input
      refs[index + 1]?.focus();
    } else if (text.length === 0 && index > 0) {
      // Move to previous input when cleared
      refs[index - 1]?.focus();
    }
  };

  const refs = [];

  return (
    // <View style={styles.container}>
    //   {otp.map((digit, index) => (
    //     <TextInput
    //       key={index}
    //       style={styles.input}
    //       value={digit}
    //       onChangeText={(text) => handleChange(text, index)}
    //       keyboardType="number-pad"
    //       maxLength={1}
    //       ref={(ref) => (refs[index] = ref)}
    //     />
    //   ))}
    // </View>
        <View style={styles.container}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="number-pad"
            maxLength={1}
            ref={(ref) => (refs[index] = ref)} // Assign refs for each input
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === "Backspace" && !otp[index]) {
                // Handle backspace manually if the input is empty
                refs[index - 1]?.focus();
              }
            }}
          />
        ))}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: 'center', // Center the input boxes horizontally
  },
  input: {
    flex: 1,               // Make each input box flexible
    height: 50, // height of each box
    borderWidth: 2, // border thickness
    borderColor: "#000", // border color (black)
    textAlign: "center", // center the text
    fontSize: 20, // make the digits larger
    borderRadius: 8, // make the boxes slightly rounded (optional)
    marginHorizontal: 5, // space between the boxes
  },
});

export default OTPInput;
