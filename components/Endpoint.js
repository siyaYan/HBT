// Mock API functions for testing without a backend
import { Alert } from "react-native";
import RNFS from "react-native-fs";
export async function registerUser(
  username,
  nickname,
  email,
  password,
  confirmPassword
) {
  try {
    const response = await fetch(
      "http://3.27.94.77:8000/habital/v1/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          nickname: nickname,
          username: username,
          password: password,
          passwordConfirm: confirmPassword,
        }),
      }
    );

    const data = await response.json();
    if (data.status == "success") {
      Alert.alert("Success", "Please check your email inbox");
    } else {
      Alert.alert("Oh,No!", data.message || "Registration unsuccessful");
      console.log(data.message);
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in register user:", error);
    Alert.alert("Unsuccessful", "Registration failed. Please try again later.");
  }
}

export async function loginUser(id, password) {
  try {
    const response = await fetch(
      "http://3.27.94.77:8000/habital/v1/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
      }
    );

    const data = await response.json();
    if (data.status == "success") {
      // Alert.alert('Success', 'Login successful');
    } else {
      Alert.alert("Unsuccessful", data.message || "Login failed");
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in loginUser:", error);
    Alert.alert("Unsuccessful", "Login failed. Please try again later");
    // Decide how to handle the error. You may want to re-throw it or return a specific value.
  }
}

export async function tokenResetPassword(password, passwordConfirm, code) {
  try {
    const response = await fetch(
      "http://3.27.94.77:8000/habital/v1/users/reset-password/" + code,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
          passwordConfirm: passwordConfirm,
        }),
      }
    );

    const data = await response.json();
    if (data.status == "success") {
      Alert.alert("Success", "Please login using your new password");
    } else {
      Alert.alert("Unsuccessful", data.message || "Reset password failed");
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in Reset password:", error);
    Alert.alert(
      "Unsuccessful",
      "Reset password failed. Please try again later"
    );
  }
}

export async function forgetSendEmail(email) {
  try {
    const response = await fetch(
      "http://3.27.94.77:8000/habital/v1/users/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    );

    const data = await response.json();
    if (data.status == "success") {
      Alert.alert("Success", "Please check your email");
    } else {
      Alert.alert("Unsuccessful", data.message || "Send email unsuccessful");
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in send email:", error);
    Alert.alert("Unsuccessful", "Send Email failed. Please try again later");
  }
}

export async function resetPassword(
  userId,
  token,
  currentPassword,
  newPassword,
  passwordConfirm
) {
  //dummy success
  try {
    const response = await fetch(
      "http://3.27.94.77:8000/habital/v1/users/"+ userId +"/password",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword:currentPassword,
          newPassword: newPassword,
          newPasswordConfirm: passwordConfirm,
        }),
      }
    );

    const data = await response.json();
    if (data.status == "success") {
      Alert.alert("Success", "Please login using your new password");
    } else {
      Alert.alert(
        "Unsuccessful",
        data.message || "Your current password is not right"
      );
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in Reset password:", error);
    Alert.alert(
      "Unsuccessful",
      "Reset password failed. Please try again later"
    );
  }
}

export async function resetProfile(userId, token, nickname, username) {
  // console.log(userId)
  try {
    const response = await fetch(
      "http://3.27.94.77:8000/habital/v1/users/" + userId,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nickname: nickname,
          username: username
        }),
      }
    );

    const data = await response.json();
    if (data.status == "success") {
      Alert.alert("Success", "Update your profile");
    } else {
      Alert.alert("Unsuccessful", data.message || "Reset profile unsuccessful");
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in Reset profile:", error);
    Alert.alert("Unsuccessful", "Reset profile failed. Please try again later");
  }
}

export async function resetSendEmail(token, userId, email) {

  try {
    // const response = await fetch("http://3.27.94.77:8000/habital/v1/users/"+userId+"/profileImage", {
    const response = await fetch(
      "http://3.27.94.77:8000/habital/v1/users/" + userId + "/request-email-change",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newEmail: email,
        }),
      }
    );
    const data = await response.json();
    // console.log(data)
    if (data.status == "success") {
      Alert.alert("Code sent", "Please check your email");
    } else {
      Alert.alert("Unsuccessful", data.message || "send email code unseccuess");
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in sending token", error);
    Alert.alert("Unsuccessful", "can not send token, Please try again later");
  }
}

export async function resetEmail(token, userId, resetToken) {
  try {
    const response = await fetch(
      "http://3.27.94.77:8000/habital/v1/users/" + userId + "/verify-email-change/"+ resetToken,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    const data = await response.json();
    // console.log(data)
    if (data.status == "success") {
      Alert.alert("Success", "Email updated");
    } else {
      Alert.alert("Unsuccessful",  data.message || "Code is invalid or has expired" );
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in email reset", error);
    Alert.alert("Unsuccessful", "can not reset email , Please try again later");
  }
}

export async function updateAvatar(token, userId, avatar) {
  // const binaryData = await RNFS.readFile(avatar.uri, 'base64');
  // console.log(binaryData);
  const file = {
    uri: avatar.uri, // Local file URI
    type: "image/jpeg", // MIME type of the image
    name: avatar.fileName, // Any file name
  };

  const formData = new FormData();
  formData.append("profileImage", file);

  try {
    // const response = await fetch("http://3.27.94.77:8000/habital/v1/users/"+userId+"/profileImage", {
    const response = await fetch(
      "http://3.27.94.77:8000/habital/v1/users/" + userId + "/profile-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    const data = await response.json();
    console.log(data, "update avatar");
    if (data.status == "Successful operation") {
      Alert.alert("Success", "Avatar updated!");
    } else {
      Alert.alert("Unsuccessful", data.message || "Update avatar unsuccessful");
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in Update avatar:", error);
    Alert.alert("Unsuccessful", "Update avatar failed, Please try again later");
  }
}

export async function findByUserId(token, userId) {
  try {
    const response = await fetch(
      "http://3.27.94.77:8000/habital/v1/users/" + userId ,
      {
        method: "GET",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);
    // if (data.status == "success") {
    //   Alert.alert("Success", "Avatar updated!");
    // } else {
    //   Alert.alert("Unsuccessful", data.message || "Update avatar unsuccessful");
    // }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}