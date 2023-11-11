import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { useState } from 'react';

export default function App() {
  const [enteredEmail,setEnteredEmail]=useState('');
  const [enteredPwd,setEnteredPwd]=useState('');
  const [account,setAccount]=useState([]);

  function inputEmailHandler(enteredEmail){
    setEnteredEmail(enteredEmail)
  };
  function inputPwdHandler(enteredPwd){
    setEnteredPwd(enteredPwd)
  };
  function signupHandler(){};
  function loginHandler(){
    // console.log(enteredEmail)
    setAccount([enteredEmail,enteredPwd]);
    console.log(account)
  };
  function resetHandler(){};

  return (
    <View style={styles.container}>
      <Button title="Back"/>
      <View style={styles.top}>
        <View>
          <Text>Log in</Text>
          <Image source={require("./assets/icon.png")} />
        </View>
        <View styles={styles.promptChunck}>
          <Text>New to hapital?</Text>
          <Button title="Sign up"/>
          <Text>to start</Text>
        </View>
        
      </View>
      <View style={styles.middle}>
        <View style={styles.textInput} >
          <TextInput placeholder="Your Email" onChangeText={inputEmailHandler}/>
        </View>
        <View style={styles.textInput}>
          <TextInput placeholder="Your Password" onChangeText={inputPwdHandler}/>
        </View>
      </View>
      <View style={styles.bottom}>
        <View styles={styles.promptChunck}>
          <Text>oh, I forgot!</Text>
          <Button title="Forget Password"/>
        </View>
        <View>
          <Button title="Log in" onPress={loginHandler}
          />
        </View>
        
      </View>
      
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection:'column',
    paddingTop:80,
    paddingBottom:140,
    paddingHorizontal:20,
    backgroundColor:"grey"
  },
  textInput:{
    borderWidth:1,
    borderColor:'black',
    backgroundColor:'white',
    margin:10,
    height:"20%"
  },
  top:{
    flex:1,
    backgroundColor:'red',
    flexDirection:"row",
    width:"80%",
    justifyContent:"space-between"
  },
  middle:{
    flex:1,
    backgroundColor:'blue',
    justifyContent:'center',
    width:"80%"
  },
  bottom:{
    flex:1,
    backgroundColor:'yellow',
    flexDirection:"row",
    width:"80%",
    justifyContent:"space-between"
  },
  promptChunck:{
    flexDirection:"column",
    // alignContent:'center',
    // justifyContent:"center",
  }
});
