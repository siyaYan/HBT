// Mock API functions for testing without a backend
import { Alert } from 'react-native';
import RNFS from 'react-native-fs';
export async function registerUser(username, nickname, email, password, confirmPassword) {

  try {
    const response = await fetch('http://54.252.176.246:8000/habital/v1/signup', {
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
      Alert.alert('Success', 'Please check your email inbox');
    } else {
      Alert.alert('Oh,No!', data.message || 'Registration failed');
      console.log(data.message)
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error('Error in RegisterUser:', error);
    Alert.alert('Error', 'Registration failed. Please try again later.');
  }
};

export async function loginUser(id, password) {
  try {
    const response = await fetch('http://54.252.176.246:8000/habital/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, password }),
    });

    const data = await response.json();
    if (data.status == 'success') {
      // Alert.alert('Success', 'Login successful');
    } else {
      Alert.alert('Unsuccessful', data.message || 'Login failed');
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error('Error in loginUser:', error);
    Alert.alert('Unsuccessful', 'Login failed. Please try again later');
    // Decide how to handle the error. You may want to re-throw it or return a specific value.
  }
};

export async function tokenResetPassword(password, passwordConfirm, code) {
  try {
    const response = await fetch("http://54.252.176.246:8000/habital/v1/users/resetPassword/" + code, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "password": password,
        "passwordConfirm": passwordConfirm
      }),
    });

    const data = await response.json();
    if (data.status == "success") {
      Alert.alert('Success', 'Please login using your new password');
    } else {
      Alert.alert('Error', data.message || 'Reset password failed');
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error('Error in Reset password:', error);
    Alert.alert('Error', 'Reset password failed. Please try again later');
  }
};

export async function forgetSendEmail(email) {
  try {
    const response = await fetch('http://54.252.176.246:8000/habital/v1/users/forgotPassword', {
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
      Alert.alert('Success', 'Please check your email');
    } else {
      Alert.alert('Error', data.message || 'send email failed');
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error('Error in send email:', error);
    Alert.alert('Error', 'Send Email failed. Please try again later');
  }

};

export async function resetPassword(userId, token, currentPassword, newPassword, passwordConfirm) {
  //dummy success
  try {
    const response = await fetch("http://54.252.176.246:8000/habital/v1/users/${userId}" , {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        "password": newPassword,
        "passwordConfirm": passwordConfirm
      }),
    });

    const data = await response.json();
    if (data.status == "success") {
      Alert.alert('Success', 'Please login using your new password');
    } else {
      Alert.alert('Error', data.message || 'Reset password failed');
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error('Error in Reset password:', error);
    Alert.alert('Error', 'Reset password failed. Please try again later');
  }
};

export async function resetProfile(userId, token, nickname, username) {
  console.log(userId)
  try {
    const response = await fetch("http://54.252.176.246:8000/habital/v1/users/"+userId , {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        "nickname": nickname,
        "username": username,
        "profileImageUrl": "https://habital-images.s3.ap-southeast-2.amazonaws.com/profiles/default-profile-image.png"
      }),
    });

    const data = await response.json();
    if (data.status == "success") {
      Alert.alert('Success', 'Update your profile');
    } else {
      Alert.alert('Error', data.message || 'Reset profile failed');
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error('Error in Reset profile:', error);
    Alert.alert('Error', 'Reset profile failed. Please try again later');
  }
};

export async function resetSendEmail(email) {
  //dummy success
  // Alert.alert('Success', 'Send reset email successful');
  console.log('send reset email success');
  return 'success';
  //dummy failed
  // Alert.alert('Failed', 'Non valid email address!');
  // console.log('Non valid email address!');
  // return 'failed';
};

export async function resetEmail(email, token) {
  //dummy success
  // "email": "abcd1234@gmail.com",
  Alert.alert('Success', 'Reset email successful');
  console.log('reset email success');
  return 'success';
  //dummy failed
  // Alert.alert('Failed', 'wrong email reset token!');
  // console.log('wrong email reset token!');
  // return 'failed';
};

//TODO: update avatar failed
export async function updateAvatar(token, userId, avatar) {
  // const binaryData = await RNFS.readFile(avatar, 'base64');
const file = {
    uri: avatar.uri, // Local file URI
    type: 'image/jpeg', // MIME type of the image
    name: avatar.fileName, // Any file name
  };
  
const formData = new FormData();
  formData.append('profileImage', file);

  try {
    const response = await fetch("http://54.252.176.246:8000/habital/v1/users/"+userId+"/profileImage", {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    console.log(data,"update avatar")
    if (data.status == "Successful operation") {
      Alert.alert('Success', 'Avatar updated!');
    } else {
      Alert.alert('Error', data.message || 'update avatar failed');
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error('Error in Update avatar:', error);
    Alert.alert('Error', 'Update avatar failed, Please try again later');
  }
};


