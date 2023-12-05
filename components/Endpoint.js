// Mock API functions for testing without a backend
import { Alert } from 'react-native';
export async function registerUser(username, nickname, email, password, confirmPassword) {

  try {
    const response = await fetch('http://localhost:8000/habital/v1/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email,
        "nickname": nickname,
        "username": username,
        "password": password,
        "passwordConfirm": confirmPassword
      }),
    });

    const data = await response.json();
    if (data.status == "success") {
      Alert.alert('Success', 'Registration successful');
    } else {
      Alert.alert('Error', data.message || 'Registration failed');
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error('Error in RegisterUser:', error);
    Alert.alert('Error', 'Registration failed. Please try again later.');
  }
};

export async function loginUser(id, password) {
  try {
    const response = await fetch('http://localhost:8000/habital/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, password }),
    });

    const data = await response.json();
    if (data.status == 'success') {
      Alert.alert('Success', 'Login successful');
    } else {
      Alert.alert('Error', data.message || 'Login failed');
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error('Error in loginUser:', error);
    Alert.alert('Error', 'Login failed. Please try again later.');
    // Decide how to handle the error. You may want to re-throw it or return a specific value.
  }
};

//TODO: waiting for beckend update
export async function resetPassword(password, passwordConfirm, token) {
  // const toke=token.toString()
  try {
    const response = await fetch("http://localhost:8000/habital/v1/users/resetPassword/"+token, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // "Authorization":  token,
      },
      body: JSON.stringify({
        "password": password,
        "passwordConfirm":passwordConfirm
      }),
    });

    const data = await response.json();
    if (data.status == "success") {
      Alert.alert('Success', 'Reset password successful');
    } else {
      Alert.alert('Error', data.message || 'Reset password failed');
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error('Error in Reset password:', error);
    Alert.alert('Error', 'Reset password failed. Please try again later.');
  }
};

//TODO: back end still not right
export async function sendEmail(email) {

  try {
    const response = await fetch('http://localhost:8000/habital/v1/users/forgotPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email,
      }),
    });

    const data = await response.json();
    if (data.status == "success") {
      Alert.alert('Success', 'send email successful');
    } else {
      Alert.alert('Error', data.message || 'send email failed');
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error('Error in send email:', error);
    Alert.alert('Error', 'Send Email failed. Please try again later.');
  }

};
