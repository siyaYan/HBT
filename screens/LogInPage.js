import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { loginUser } from '../components/MockApi';


const defaultTheme = createTheme();

const LoginScreen = ({ navigation }) => {
// Method to handle login
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    try {
      // Call the mock registration function
      const response = await loginUser(email, password);

      // Handle success or error response
      if (response.success) {
        alert('Success', response.message);
        // Alert.alert('Success', response.message);
        navigation.navigate('Account')
        // You can navigate to the login screen or perform other actions
      } else {
        alert('Error', response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during Login:', error);
      alert('Error', 'Login failed. Please try again later.');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" style={{backgroundColor:"#fff7f0"}}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom:8,
            marginLeft:3,
            marginRight:3
          }}
        >
          <Grid container sx={{mb:3}}>
            <Grid item xs sx={{ ml: 2 }}>
              <Typography component="h1" variant="h4" >
                Log in
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Link href="#" variant="body2">
                {"New to Habital? Sign Up to start!"}
              </Link>
            </Grid>
          </Grid>

          <Button
            fullWidth
            variant="contained"
            href="#contained-buttons"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {
              alert('clicked facebook');
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <FacebookIcon />
            </Avatar>
            Sign in with Facebook
          </Button>

          <Button
            fullWidth
            variant="contained"
            href="#contained-buttons"
            sx={{  mb: 3 ,bgcolor: 'secondary.main' }}
            onClick={() => {
              alert('clicked google');
            }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <GoogleIcon />
            </Avatar>
            Sign in with Google
          </Button>

          <Typography component="h2" variant="body1" >
                OR
              </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Grid container>
              <Grid item xs={7}>
                <FormControlLabel 
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                  // sx={{fontSize: 5}}
                />
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs={5}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Log In
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginScreen;