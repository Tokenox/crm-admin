import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';
import { postData } from '../../../libs/cors/apiClient';
import axios from 'axios';

const LoginForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = async () => {
    try {
      const resonse = await axios.post('http://localhost:4000/rest/auth/login', {
        email: email,
        password: password
      });
      const token = resonse?.data?.data?.token;
      document.cookie = `session=${token}`;
      navigate('/dashboard/leads', { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField value={email} onChange={(e) => setEmail(e.target.value)} name="email" label="Email address" />
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" />
        <Link
          onClick={() => {
            navigate('/reset-password', { replace: true });
          }}
          variant="subtitle2"
          underline="hover"
        >
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
};

export default LoginForm;
