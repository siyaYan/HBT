// Mock API functions for testing without a backend
import { Alert } from "react-native";

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
      // 'http://localhost:8000/habital/v1/signup',
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
      // 'http://localhost:8000/habital/v1/login',
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
  // // console.log(userId)
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
    // // console.log(data)
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
    // // console.log(data)
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
  // // console.log(binaryData);
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

    if (data.status == "Successful operation") {
      // Alert.alert("Success", "Avatar updated!");
    } else {
      Alert.alert("Unsuccessful", "Oh no! Something went wrong");
    }
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in Update avatar:", error);
    Alert.alert("Unsuccessful", "Update avatar failed, Please try again later");
  }
}

export async function findByUserIdAndUsername(token, userId) {
  try {
    const response = await fetch(
      "http://3.27.94.77:8000/habital/v1/users/" + userId ,
      // "http://localhost:8000/habital/v1/users/" + userId ,
      {
        method: "GET",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data
  }catch (e) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}

export async function connectByUserId(token, senderId, receiverId) {
  try {
    const response = await fetch(
      'http://3.27.94.77:8000/habital/v1/friend-requests',
      // 'http://localhost:8000/habital/v1/friend-requests',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId: senderId,
          receiverId: receiverId,
        }),
      }
    );

    const data = await response.json();
    console.log(data)
    if (data.status == "success") {
      Alert.alert("Success", "Send link request to this friend!");
    } else {
      Alert.alert("Oh,No!", data.message || "Failed to connect!");

    }
    return data
  }catch (e) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}

export async function getFriends(token) {
  try {
    const response = await fetch(
      'http://3.27.94.77:8000/habital/v1/friend-requests/getAllFriends',
      {
        method: "GET",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}
export async function getSendRequest(token) {
  try {
    const response = await fetch(
      'http://3.27.94.77:8000/habital/v1/friend-requests/sender',
      // 'http://localhost:8000/habital/v1/friend-requests/sender',
      {
        method: "GET",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}

export async function getRelationByUserId(token, senderId, receiverId) {
  try {
    const response = await fetch(
      'http://3.27.94.77:8000/habital/v1/friend-requests',
      // 'http://localhost:8000/habital/v1/friend-requests',
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId: senderId,
          receiverId: receiverId,
        }),
      }
    );
    // // console.log(response)
    const data = await response.json();
    // // console.log(data);
    return data
  }catch (e) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}
export async function getReceivedRequest(token) {
  try {
    const response = await fetch(
      'http://3.27.94.77:8000/habital/v1/friend-requests/receiver',
      // 'http://localhost:8000/habital/v1/friend-requests/receiver',
      {
        method: "GET",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    // console.log(data);
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}
export async function reactReceivedRequest(token, friendRequestId, react) {
  try {
    const response = await fetch(
      `http://3.27.94.77:8000/habital/v1/friend-requests/${friendRequestId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ // Stringify the body object
          status: `${react}` // Assuming 'react' is a variable containing the status to update
        })
      }
    );
    const data = await response.json();
    // console.log(data);
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}
export async function deleteFriends(token) {
  try {
    const response = await fetch(
      `http://3.27.94.77:8000/habital/v1/friend-requests/deleteAllFriends`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    // console.log(data);
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}
export async function deleteFriendOrWithdrawRequestById(token,friendRequestId) {
  try {
    const response = await fetch(
      `http://3.27.94.77:8000/habital/v1/friend-requests/${friendRequestId}/deleteFriend`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    // console.log(data);
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}
// Chapter 4 Round Configuration

export async function updateRound(roundData,token) {
  fetch('http://3.27.94.77:8000/habital/v1/round/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roundData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`HTTP error ${response.status}: ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}

export async function getNotifiableFriendRequests(token) {
  try {
    const response = await fetch(
      'http://3.27.94.77:8000/habital/v1/friend-requests/notifiable',
      // 'http://localhost:8000/habital/v1/friend-requests/notifiable',
      {
        method: "GET",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    // console.log(data);
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}

export async function getNotifiableNotification(token, userId) {
  try {
    const response = await fetch(
      `http://3.27.94.77:8000/habital/v1/notifications/${userId}/notifiable`,
      // `http://localhost:8000/habital/v1/notifications/${userId}/notifiable`,
      {
        method: "GET",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    // console.log(data);
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}

export async function getNotificationHistory(token, userId) {
  try {
    const response = await fetch(
      `http://3.27.94.77:8000/habital/v1/notifications/${userId}/history`,
      // `http://localhost:8000/habital/v1/notifications/${userId}/history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    // console.log(data);
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}

export async function clearNotificationById(token, userId, notificationId) {
  try {
    const response = await fetch(
      `http://3.27.94.77:8000/habital/v1/notifications/${userId}/acknowledge/${notificationId}`,
      // `http://localhost:8000/habital/v1/notifications/${userId}/acknowledge/${notificationId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    // console.log(data);
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}

export async function clearAllNotifications(token, userId) {
  try {
    const response = await fetch(
      `http://3.27.94.77:8000/habital/v1/notifications/${userId}/acknowledgeAll`,
      // `http://localhost:8000/habital/v1/notifications/${userId}/acknowledgeAll`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    // console.log(data);
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}

export async function clearAllFriendRequests(token) {
  try {
    const response = await fetch(
      `http://3.27.94.77:8000/habital/v1/friend-requests/acknowledgeAll`,
      // `http://localhost:8000/habital/v1/friend-requests/acknowledgeAll`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    // console.log(data);
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}

export async function clearFriendRequestById(token, friendRequestId) {
  try {
    const response = await fetch(
      `http://3.27.94.77:8000/habital/v1/friend-requests/${friendRequestId}/acknowledge`,
      // `http://localhost:8000/habital/v1/friend-requests/${friendRequestId}/acknowledge`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    // console.log(data);
    return data; // Make sure you return the data here
  } catch (error) {
    console.error("Unsuccessful in connect server:", error);
    Alert.alert("Unsuccessful", "can not connect to server");
  }
}

export async function getNoteUpdate(token, userId){
  let res=0;
  const response1 = await fetch(
    'http://3.27.94.77:8000/habital/v1/friend-requests/notifiable',
    // 'http://localhost:8000/habital/v1/friend-requests/notifiable',
    {
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const response2 = await fetch(
    `http://3.27.94.77:8000/habital/v1/notifications/${userId}/notifiable`,
    // `http://localhost:8000/habital/v1/notifications/${userId}/notifiable`,
    {
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if(response1){
    const data1 = await response1.json();
    res=res+data1.data.length;
  }
  if(response2){
    const data2 = await response2.json();
    res=res+data2.data.length;
    // console.log('get notificates:',data2.data.length)
  }
  // console.log(res)
  return res
}

