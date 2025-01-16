import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const UserManual = () => {
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Welcome to Habital!</Text>
            <Text style={styles.paragraph}>
                Habital is a community and interactive way to build and share habits with your friends. Here's how to get started:
            </Text>
            <Text style={styles.subHeader}>1. Create a Habit</Text>
            <Text style={styles.paragraph}>
                Start by creating a habit that you want to build. It could be anything from drinking more water to exercising daily.
            </Text>
            <Text style={styles.subHeader}>2. Share Your Habit</Text>
            <Text style={styles.paragraph}>
                Share your habit with your friends and invite them to join you. The more people you have, the more fun it gets!
            </Text>
            <Text style={styles.subHeader}>3. React and Participate</Text>
            <Text style={styles.paragraph}>
                React to your friends' habits and participate in them. Encourage each other and keep the motivation high.
            </Text>
            <Text style={styles.subHeader}>4. Gain Points</Text>
            <Text style={styles.paragraph}>
                Earn points by consistently following your habits and participating in your friends' habits. The more you engage, the more points you earn!
            </Text>
            <Text style={styles.footer}>Happy Habit Building!</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 10,
    },
    footer: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 30,
        textAlign: 'center',
    },
});

export default UserManual;