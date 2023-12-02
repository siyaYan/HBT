// Mock API functions for testing without a backend

export const registerUser = async (username, nickname, email, password) => {
  // Simulate a successful registration
  return { success: true, message: 'Registration successful' };
  // if (!username || !password) {
  //     Alert.alert('Error', 'Please enter both username and password');
  //     return;
  //   }

  //   // Assuming you have an API endpoint for registration
  //   fetch('https://your-api-url/register', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ username, password }),
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       // Handle success or error response from the server
  //       if (data.success) {
  //         Alert.alert('Success', 'Registration successful');
  //         // You can navigate to the login screen or perform other actions
  //       } else {
  //         Alert.alert('Error', data.message || 'Registration failed');
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error during registration:', error);
  //       Alert.alert('Error', 'Registration failed. Please try again later.');
  //     });

};

export const loginUser = async (email, password) => {
  // Simulate a successful login
  return { success: true, message: 'Login successful' };
  // // Add validation checks
  // if (!username || !password) {
  //   Alert.alert('Error', 'Please enter both username and password');
  //   return;
  // }

  // // Assuming you have an API endpoint for login
  // fetch('https://your-api-url/login', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ username, password }),
  // })
  //   .then(response => response.json())
  //   .then(data => {
  //     // Handle success or error response from the server
  //     if (data.success) {
  //       Alert.alert('Success', 'Login successful');
  //       // You can navigate to the home screen or perform other actions
  //     } else {
  //       Alert.alert('Error', data.message || 'Login failed');
  //     }
  //   })
  //   .catch(error => {
  //     console.error('Error during login:', error);
  //     Alert.alert('Error', 'Login failed. Please try again later.');
  //   });
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
