import React, { useState, useEffect } from 'react';
 import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
 
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login'
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login } from '../redux/actions/authAction';
 
const Login = () => {
    const initialState = { email: '', password: '', showPassword: false,   err: '',
    success: ''};
    const [userData, setUserData] = useState(initialState);
    const { email, password, showPassword } = userData;

    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (auth.token) history.push('/');
    }, [auth.token, history]);

    const handleChangeInput = e => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value , err: '', success: ''});
    };

    const handleClickShowPassword = () => {
        setUserData({ ...userData, showPassword: !showPassword });
    };

    const handleMouseDownPassword = e => {
        e.preventDefault();
    };
    const handleSubmit = async e => {
         
        try {
     e.preventDefault();
        dispatch(login(userData));
        setUserData({...userData, err: '' })
            
 

        } catch (err) {
            err.response.data.msg && 
            setUserData({...userData, err: err.response.data.msg, success: ''})
        }
    }
  
    const responseGoogle = async (response) => {
        try {
            const res = await axios.post('/api/google_login', {tokenId: response.tokenId})

            setUserData({...userData, error:'', success: res.data.msg})
            localStorage.setItem('firstLogin', true)

            dispatch(login())
            history.push('/')
        } catch (err) {
            err.response.data.msg && 
            setUserData({...userData, err: err.response.data.msg, success: ''})
        }
    }

    const responseFacebook = async (response) => {
        try {
            const {accessToken, userID} = response
            const res = await axios.post('/api/facebook_login', {accessToken, userID})

            setUserData({...userData, error:'', success: res.data.msg})
            localStorage.setItem('firstLogin', true)

            dispatch(login())
            history.push('/')
        } catch (err) {
            err.response.data.msg && 
            setUserData({...userData, err: err.response.data.msg, success: ''})
        }
    }
    return (
        <ThemeProvider theme={createTheme()}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random?wedding)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Connexion
                        </Typography>

                        <Grid container justifyContent="space-between">
                            <GoogleLogin
                                clientId="810070450306-rjqvpfiice6cltmhs04j0966fbd7v8b7.apps.googleusercontent.com"
                                buttonText="Login avaic google"
                                onSuccess={responseGoogle}
                                cookiePolicy={'single_host_origin'}
                            />

                            <FacebookLogin
                                appId="Your facebook app id"
                                autoLoad={false}
                                fields="name,email,picture"
                                callback={responseFacebook}
                            />
 </Grid>


                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Adresse e-mail"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={handleChangeInput}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mot de passe"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={handleChangeInput}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Connexion
                            </Button>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Link to="/register" variant="body2">
                                        Devenir membre
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link to="/forgot_password" variant="body2">
                                        Mot de passe oublié ?
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default Login;
