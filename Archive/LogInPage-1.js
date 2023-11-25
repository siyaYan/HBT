import * as React from "react";
import { StyleSheet, Text, View, Pressable, TextInput, Image} from 'react-native';
import { Border, Color, FontFamily, FontSize } from "../GlobalStyles";
import { useState } from 'react';
import { loginUser } from "../components/MockApi"; // Import the mock function

const LoginPage = () => {
  const [enteredEmail,setEnteredEmail]=useState('');
  const [enteredPwd,setEnteredPwd]=useState('');
  const [account,setAccount]=useState([]);

  function inputEmailHandler(enteredEmail){
    setEnteredEmail(enteredEmail)
    // console.log(enteredEmail)
  };
  function inputPwdHandler(enteredPwd){
    setEnteredPwd(enteredPwd)
  };
  function signupHandler(){};
  function loginHandler(){
    // console.log(enteredEmail)
    setAccount([enteredEmail,enteredPwd]);
    console.log(account);
    setEnteredEmail('');
    setEnteredPwd('');
  };
  const handleLogin = async () => {
    try {
      // Call the mock registration function
      const response = await loginUser(username, password);

      // Handle success or error response
      if (response.success) {
        Alert.alert('Success', response.message);
        // You can navigate to the login screen or perform other actions
      } else {
        Alert.alert('Error', response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during Login:', error);
      Alert.alert('Error', 'Login failed. Please try again later.');
    }
  };
  function resetHandler(){};
  return (
    <View style={styles.logInPage}>
      <Image
        style={[styles.brainIcon, styles.iconPosition]}
        source={require("../assets/favicon.png")}
      />
      <Image
        style={[styles.barbellIcon, styles.iconPosition]}
        source={require("../assets/favicon.png")}
      />
      <Image
        style={[styles.heartbeatIcon, styles.iconPosition]}
        source={require("../assets/favicon.png")}
      />
      <View style={[styles.userid, styles.useridLayout]}>
        <View style={[styles.useridChild, styles.childPosition]} />
        <TextInput 
        style={[styles.usernameemail, styles.password1Typo]}
        placeholder="Username/Email" onChangeText={inputEmailHandler}/>
      </View>
      <View style={[styles.password, styles.useridLayout]}>
        <View style={[styles.useridChild, styles.childPosition]} />
        <TextInput style={[styles.password1, styles.password1Typo]}
        placeholder="Password" onChangeText={inputPwdHandler}/>
      </View>
       
      
      <Pressable style={styles.login} onClick={loginHandler}>
        <View style={[styles.loginChild, styles.childPosition]} />
        <Text style={[styles.logIn, styles.logInTypo]}>Log in</Text>
      </Pressable>
      <Text style={[styles.forgotpassword, styles.logIn1Layout]}>
        Oh no I forgot 😱
      </Text>
      <View style={[styles.rememberMe, styles.logIn1Layout]}>
        <Text style={[styles.rememberMe1, styles.orTypo]}>Remember me</Text>
        <View style={styles.rememberMeChild} />
        
      </View>
        <Pressable
        style={[styles.signUpToContainer, styles.newToHabitalPosition]}
        onClick={() => {}}
      >
        <Text style={[styles.text, styles.orTypo]}>
          <Text style={[styles.signUp, styles.signUpTypo]}>{`Sign up `}</Text>
          <Text style={[styles.toStart, styles.orTypo1]}>to start</Text>
        </Text>
      </Pressable>
        
          
      <Text style={[styles.newToHabital, styles.newToHabitalPosition]}>
        New to Habital?
      </Text>
      <Text style={[styles.or, styles.orTypo]}>or</Text>
      
      <Image
        style={styles.rightSideIcon}
        source={require("../assets/favicon.png")}
      />
      <Pressable style={styles.caretleft} onClick={() => {}}>
        <Image
          style={styles.icon}
          source={require("../assets/favicon.png")}
        />
        <Text style={[styles.logIn1, styles.signUpTypo]}>Log in</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  iconPosition: {
    opacity: 0.05,
    position: "absolute",
  },
  useridLayout: {
    height: 59,
    width: 281,
    position: "absolute",
  },
  childPosition: {
    borderRadius: Border.br_8xs,
    bottom: "0%",
    right: "0%",
    left: "0%",
    top: "0%",
    height: "100%",
    position: "absolute",
    width: "100%",
  },
  password1Typo: {
    color: Color.colorGray,
    left: "4.98%",
    width: "56.23%",
    height: "40.68%",
    textAlign: "left",
    // fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_lg,
    position: "absolute",
  },
  signingooglePosition: {
    width: 281,
    left: 70,
    position: "absolute",
  },
  orTypo1: {
    // fontFamily: FontFamily.interRegular,
    color: Color.labelColorLightPrimary,
  },
  socialLayout: {
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  logInTypo: {
    color: Color.colorWhite,
    textAlign: "left",
    // fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_lg,
    position: "absolute",
  },
  logIn1Layout: {
    height: 37,
    position: "absolute",
  },
  orTypo: {
    fontSize: FontSize.size_mini,
    textAlign: "left",
  },
  newToHabitalPosition: {
    left: 243,
    position: "absolute",
  },
  signUpTypo: {
    // fontFamily: FontFamily.interBold,
    fontWeight: "700",
  },
  timeLayout: {
    width: 54,
    position: "absolute",
  },
  brainIcon: {
    top: 85,
    left: 233,
    width: 172,
    height: 180,
  },
  barbellIcon: {
    top: 324,
    left: 21,
    width: 160,
    height: 168,
  },
  heartbeatIcon: {
    top: 655,
    left: 250,
    width: 155,
    height: 155,
  },
  useridChild: {
    backgroundColor: Color.colorWhite,
  },
  usernameemail: {
    top: "28.81%",
    textAlign: "left",
  },
  userid: {
    top: 406,
    left: 70,
  },
  password1: {
    top: "30.51%",
    textAlign: "left",
  },
  password: {
    top: 481,
    left: 68,
  },
  signInWith: {
    top: "27.08%",
    left: "26.33%",
    color: Color.labelColorLightPrimary,
    textAlign: "left",
    fontSize: FontSize.size_lg,
    // fontFamily: FontFamily.interRegular,
    position: "absolute",
  },
  socialIcons: {
    height: "62.5%",
    top: "18.75%",
    right: "78.29%",
    bottom: "18.75%",
    left: "11.03%",
    width: "10.68%",
    maxWidth: "100%",
  },
  signingoogle: {
    top: 227,
    height: 48,
  },
  signinfacebookChild: {
    backgroundColor: "#154799",
  },
  signInWith1: {
    top: "24.44%",
    left: "25.27%",
  },
  socialIcons1: {
    height: "66.67%",
    top: "15.56%",
    right: "78.65%",
    bottom: "17.78%",
    left: "10.68%",
    width: "10.68%",
    maxWidth: "100%",
  },
  signinfacebook: {
    top: 291,
    height: 45,
  },
  loginChild: {
    backgroundColor: "#143214",
  },
  logIn: {
    top: "15.15%",
    left: "18.6%",
  },
  login: {
    left: 270,
    width: 86,
    height: 33,
    top: 592,
    position: "absolute",
  },
  forgotpassword: {
    top: 625,
    textDecorationLine:"underline",
    width: 162,
    fontSize: FontSize.size_mini,
    textAlign: "left",
    color: Color.labelColorLightPrimary,
    left: 68,
    // fontFamily: FontFamily.interRegular,
  },
  rememberMe1: {
    width: "88.52%",
    left: "11.48%",
    color: Color.labelColorLightPrimary,
    // fontFamily: FontFamily.interRegular,
    top: "0%",
    fontSize: FontSize.size_mini,
    height: "100%",
    position: "absolute",
  },
  rememberMeChild: {
    height: "48.65%",
    width: "8.74%",
    right: "91.26%",
    bottom: "51.35%",
    backgroundColor: "#75b54e",
    left: "0%",
    top: "0%",
    position: "absolute",
  },
  checkIcon: {
    height: "35.14%",
    width: "7.65%",
    top: "5.41%",
    right: "91.8%",
    bottom: "59.46%",
    left: "0.55%",
  },
  rememberMe: {
    width: 183,
    top: 592,
    left: 68,
  },
  signUp: {
    color: "#634eb5",
  },
  toStart: {
    color: Color.labelColorLightPrimary,
  },
  text: {
    width: 120,
    height: 21,
  },
  signUpToContainer: {
    top: 175,
  },
  newToHabital: {
    top: 153,
    width: 118,
    height: 19,
    fontSize: FontSize.size_mini,
    textAlign: "left",
    color: Color.labelColorLightPrimary,
    // fontFamily: FontFamily.interRegular,
  },
  or: {
    top: 368,
    left: 198,
    width: 33,
    height: 22,
    color: Color.labelColorLightPrimary,
    // fontFamily: FontFamily.interRegular,
    position: "absolute",
  },
  logIn1: {
    top: 143,
    fontSize: 35,
    width: 106,
    height: 37,
    position: "absolute",
    color: Color.labelColorLightPrimary,
    textAlign: "left",
    left: 70,
  },
  time: {
    top: 1,
    left: 0,
    fontSize: FontSize.calloutBold_size,
    letterSpacing: 0,
    lineHeight: 21,
    fontWeight: "600",
    // fontFamily: FontFamily.calloutBold,
    textAlign: "center",
    height: 20,
    color: Color.labelColorLightPrimary,
  },
  statusbarTime: {
    marginLeft: -27,
    top: 0,
    borderRadius: Border.br_5xl,
    left: "50%",
    height: 21,
  },
  leftSide: {
    marginLeft: -168,
    top: 14,
    left: "50%",
    height: 21,
  },
  rightSideIcon: {
    marginLeft: 91,
    top: 19,
    width: 77,
    height: 13,
    left: "50%",
    position: "absolute",
  },
  icon: {
    height: "100%",
    width: "100%",
  },
  caretleft: {
    left: 36,
    top: 88,
    width: 32,
    height: 32,
    position: "absolute",
  },
  logInPage: {
    backgroundColor: "#fff7f0",
    flex: 1,
    height: 932,
    overflow: "hidden",
    width: "100%",
  },
});

export default LoginPage;
