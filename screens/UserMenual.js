import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useState, useEffect } from "react";
import { Avatar } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import Background from "../components/Background";

const CreateRoundSVG = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
    <path fill="#49A579" d="M12 5v14m7-7H5" stroke="#49A579" stroke-width="2" stroke-linecap="round" />
  </svg>
`;

const InviteFriendSVG = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
    <path fill="#FFA500" d="M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z"/>
    <path fill="#FFA500" d="M2 20c0-3.31 4.03-6 9-6s9 2.69 9 6v1H2v-1Z"/>
  </svg>
`;

const ReactToRoundSVG = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
    <path fill="#FF6188" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"/>
  </svg>
`;

const UserManual = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to RoundMaster! 🎯</Text>
      <Text style={styles.subtitle}>Master the game in 3 steps:</Text>

      <View style={styles.stepContainer}>
        <SvgXml xml={CreateRoundSVG()} width={60} height={60} />
        <Text style={styles.stepTitle}>1. Create Your Round</Text>
        <Text style={styles.stepDescription}>
          You can create ONE exciting round at a time. Focus is key!
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <SvgXml xml={InviteFriendSVG()} width={60} height={60} />
        <Text style={styles.stepTitle}>2. Invite Friends</Text>
        <Text style={styles.stepDescription}>
          Connect with friends and invite them to join your round. More friends, more fun!
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <SvgXml xml={ReactToRoundSVG()} width={60} height={60} />
        <Text style={styles.stepTitle}>3. Upload & React</Text>
        <Text style={styles.stepDescription}>
          Upload your round and let friends react. Get the majority reactions and earn FULL POINTS!
        </Text>
      </View>

      <Text style={styles.subtitle}>Challenge Levels 📈</Text>
      <View style={styles.levelContainer}>
        <Text style={styles.level}>🌿 21 Days - Starter</Text>
        <Text style={styles.level}>🔥 35 Days - Challenger</Text>
        <Text style={styles.level}>🏆 66 Days - Master</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreateRound')}
      >
        <Text style={styles.buttonText}>Let's Start a Round!</Text>
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
    fontWeight: 'bold',
    color: '#191919',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#49A579',
    marginTop: 20,
    marginBottom: 10,
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  stepDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  levelContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  level: {
    fontSize: 18,
    fontWeight: '600',
    color: '#191919',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#49A579',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserManual;
