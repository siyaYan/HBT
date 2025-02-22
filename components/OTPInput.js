import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const OTPInput = ({ value, onChange }) => {
  const [otp, setOtp] = useState(
    value ? value.split("") : new Array(6).fill("")
  );

  const refs = [];

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text.charAt(0); // Ensure only the first character is stored
    setOtp(newOtp);

    // Combine the OTP array into a single string and pass it back via onChange
    onChange && onChange(newOtp.join(""));

    // Automatically focus the next input if not on the last one
    if (text.length === 1 && index < otp.length - 1) {
      refs[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && !otp[index]) {
      // Move to the previous input if current one is empty
      if (index > 0) {
        refs[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = ""; // Clear the previous input
        setOtp(newOtp);
        onChange && onChange(newOtp.join(""));
      }
    }
  };
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
}

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
