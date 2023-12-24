Store keychain:expo secure store
usestate do not update immediataly
setState({...state, new property:})
if use twice in a function, it would work only the last time dynamically
property name in state could affect each other
install async-storage to keep the data while refresh the app
install react-native-image-picker react-native-camera to let user pick picture as avatar
I am using EXPO, it do not supprt [react-native-image-picker], so I have to Install Expo Image Picker:
expo install expo-image-picker

Note: setData func can run only one time in one func


Safety Key chain:[SecureStore]
id:username/Email
password

local Storage:[AsyncStorage]
id&token(temperary)
nickname
user perferance
avatar


Test account:
Test12/Test13
passowrd: test123!
Testing: 
1.Reset password didn't work correctly
2.Login endpoint only have status&token(need username)

## What is the difference between `SecureStore` and `AsyncStorage`

`SecureStore` and `AsyncStorage` are both storage solutions provided by React Native for persisting data, but there are some key differences between them:

1. **Security:**
   - **AsyncStorage:** This is a simple, asynchronous, unencrypted, key-value storage system. It's suitable for storing non-sensitive data, but it's not designed to provide a high level of security.
   - **SecureStore:** This module provides a secure, encrypted storage solution. It is designed to store sensitive information, such as authentication tokens or other private data, in a more secure manner.

2. **Encryption:**
   - **AsyncStorage:** Data is stored in plain text, which means it's not encrypted. If the device is compromised, the data can be accessed.
   - **SecureStore:** Data is stored in an encrypted format, adding an extra layer of security. This makes it more suitable for storing sensitive information.

3. **Use Cases:**
   - **AsyncStorage:** Ideal for non-sensitive data like user preferences, app settings, or cached data that doesn't require a high level of security.
   - **SecureStore:** Designed for storing sensitive information, such as access tokens, API keys, or any data that should be kept secure.

4. **Implementation:**
   - **AsyncStorage:** Easy to use and doesn't require additional setup. It's a simple key-value store.
   - **SecureStore:** Requires additional setup for setting a key for encrypting data. It provides an API similar to `AsyncStorage` but with an added layer of security.

5. **Platform Support:**
   - **AsyncStorage:** Available on both iOS and Android.
   - **SecureStore:** Available on both iOS and Android.

