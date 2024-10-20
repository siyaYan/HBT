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
    // Automatically focus on next input
    if (text.length === 1 && index < 5) {
      refs[index + 1].focus();
    }
  };

  const refs = [];

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          style={styles.input}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          keyboardType="number-pad"
          maxLength={1}
          ref={(ref) => (refs[index] = ref)}
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
