// Mock API functions for testing without a backend
import { Alert } from 'react-native';
export const registerUser = async (username, nickname, email, password, confirmPassword) => {
  // if (!username || !nickname || ! email ||!password || !confirmPassword) {
  //     Alert.alert('Error', 'Please enter both username and password');
  //     return;
  //   }
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
    console.error('Error in loginUser:', error);
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

export const resetPassword = async (password) => {
  // Simulate a successful password reset
  return { success: true, message: 'Password reset success!' };
  // // Add validation checks
  // if (!email) {
  //   Alert.alert('Error', 'Please enter your email address');
  //   return;
  // }

  // // Assuming you have an API endpoint for password reset
  // fetch('https://your-api-url/reset-password', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ email }),
  // })
  //   .then(response => response.json())
  //   .then(data => {
  //     // Handle success or error response from the server
  //     if (data.success) {
  //       Alert.alert('Success', 'Password reset email sent');
  //       // You can navigate to the login screen or perform other actions
  //     } else {
  //       Alert.alert('Error', data.message || 'Password reset failed');
  //     }
  //   })
  //   .catch(error => {
  //     console.error('Error during password reset:', error);
  //     Alert.alert('Error', 'Password reset failed. Please try again later.');
  //   });
};

//TODO: sent email
export const sendEmail = async (email) => {
  // Simulate a successful password reset
  return { success: true, message: 'Password reset email sent' };
  // // Add validation checks
  // if (!email) {
  //   Alert.alert('Error', 'Please enter your email address');
  //   return;
  // }

  // // Assuming you have an API endpoint for password reset
  // fetch('https://your-api-url/reset-password', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ email }),
  // })
  //   .then(response => response.json())
  //   .then(data => {
  //     // Handle success or error response from the server
  //     if (data.success) {
  //       Alert.alert('Success', 'Password reset email sent');
  //       // You can navigate to the login screen or perform other actions
  //     } else {
  //       Alert.alert('Error', data.message || 'Password reset failed');
  //     }
  //   })
  //   .catch(error => {
  //     console.error('Error during password reset:', error);
  //     Alert.alert('Error', 'Password reset failed. Please try again later.');
  //   });
};
