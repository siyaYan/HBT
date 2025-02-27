import { Center } from 'native-base';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';

const CreateRoundSVG = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
    <path fill="#49A579" d="M12 5v14m7-7H5" stroke="#49A579" stroke-width="2" stroke-linecap="round" />
  </svg>
`;

const InviteFriendSVG = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
    <path fill="#49A579" d="M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"/>
    <path fill="#49A579" d="M2 20c0-3.31 4.03-6 9-6s9 2.69 9 6v1H2v-1Z"/>
  </svg>
`;

const ReactToRoundSVG = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
    <path fill="#49A579" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"/>
  </svg>
`;

const Instruction = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <View style={styles.stepContainer}>
        <SvgXml xml={InviteFriendSVG()} width={60} height={60} />
        <Text style={styles.stepTitle}>1. Connect</Text>
        <Text style={styles.stepDescription}>
          Connect with friends and add them to your ‘myCircle’ list to invite them to join your round.
        </Text>
      </View>


      <View style={styles.stepContainer}>
        <SvgXml xml={CreateRoundSVG()} width={60} height={60} />
        <Text style={styles.stepTitle}>2. Create or accept round invitations</Text>
        <Text style={styles.stepDescription}>
          You can create ONE active round at a time.{"\n"}{"\n"}You can plan an upcoming round; however, it must start the day after you complete the current active round.
        </Text>
      </View>


      <View style={styles.stepContainer}>
        <SvgXml xml={ReactToRoundSVG()} width={60} height={60} />
        <Text style={styles.stepTitle}>3. Upload & React</Text>
        <Text style={styles.stepDescription}>
          Upload your round and let friends react.By sharing a post, you will automatically earn a half point for the day.{"\n"}{"\n"}Get the majority (50% plus) to support you and earn FULL POINTS!
        </Text>
      </View>

      <Text style={styles.subtitle}>Round levels</Text>
      <View style={styles.levelContainer}>
        <Text style={styles.level}>🌿 21 Days | Starter</Text>
        <Text style={styles.level}>🔥 35 Days | Challenger</Text>
        <Text style={styles.level}>🏆 66 Days | Master</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MainStack", { screen: "Home" })}
      >
        <Text style={styles.buttonText}>Let's start a round!</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F9F8F2',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Regular Semi Bold',
    color: '#191919',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 25,
    fontWeight: '600',
    fontFamily: 'Regular Semi Bold',
    color: '#191919',
    marginTop: 20,
    textAlign: 'left',
  },
  stepContainer: {
    padding: 20,
    alignItems: 'left',
    marginBottom: 5,
  },
  stepTitle: {
    fontSize: 23,
    fontFamily: 'Regular Semi Bold',
    marginTop: 10,
  },
  stepDescription: {
    fontSize: 15,
    color: '#191919',
    fontFamily: 'Regular Medium',
    lineHeight: 25,     // Increases spacing between lines of text
    textAlign: 'left',
    marginTop: 10,
  },
  levelContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  level: {
    fontSize: 18,
    fontFamily: 'Regular Semi Bold',
    color: '#191919',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#6666ff',
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: '#F9F8F2',
    fontFamily: 'Regular Medium',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Instruction;
