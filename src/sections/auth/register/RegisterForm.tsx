import React from 'react';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Button, Alert, AlertColor } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';
// import { postData } from '../../../libs/cors/apiClient';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  //   const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      // validation
      if (!email) {
        alert('Please enter email');
        return;
      }
      if (!name) {
        alert('Please enter name');
        return;
      }
      if (!company) {
        alert('Please enter company');
        return;
      }
      if (!password) {
        alert('Please enter password');
        return;
      }

      // if pasword is less than 8 characters and does not contain a number
      if (password.length < 8 || !/\d/.test(password)) {
        alert('Password must be at least 8 characters and contain a number');
        return;
      }

      if (!confirmPassword) {
        alert('Please enter confirm password');
        return;
      }
      if (password !== confirmPassword) {
        alert('Password and confirm password are not matched');
        return;
      }
      if (!agree) {
        alert('Please agree to the terms and conditions');
        return;
      }
      const response = await axios.post('http://localhost:4000/rest/auth/start-verification', {
        email: email,
        type: 'EMAIL'
      });

      if (response.status === 200) {
        setIsCodeSent(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:4000/rest/auth/register', {
        email: email,
        name: name,
        company: company,
        password: password,
        verificationToken: verifyCode
      });
      console.log(response);

      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField disabled={isCodeSent} value={email} onChange={(e) => setEmail(e.target.value)} name="email" label="Email address" />
        <TextField disabled={isCodeSent} value={name} onChange={(e) => setName(e.target.value)} name="name" label="Name" />
        <TextField disabled={isCodeSent} value={company} onChange={(e) => setCompany(e.target.value)} name="company" label="Company" />
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} sx={{ my: 2 }}>
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            disabled={isCodeSent}
          />
          <TextField
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            name="confirmPassword"
            label="Confirm Password"
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
            disabled={isCodeSent}
          />
        </Stack>
      </Stack>
      {isCodeSent && (
        <Stack spacing={3} sx={{ position: 'relative', mt: 2 }}>
          <TextField name="code" label="Code" value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} />
          <Button variant="text" sx={{ position: 'absolute', bottom: '10px', right: '10px' }}>
            Resend
          </Button>
        </Stack>
      )}

      <Stack direction="row" alignItems="center" justifyItems="start" sx={{ my: 2 }}>
        <Checkbox name="remember" checked={agree} onChange={(e) => setAgree(e.target.checked)} disabled={isCodeSent} />
        <Link href="#" underline="hover" variant="subtitle2">
          I agree to the terms and conditions
        </Link>
      </Stack>
      {!isCodeSent ? (
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
          Register
        </LoadingButton>
      ) : (
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleRegister}>
          Complete Registration
        </LoadingButton>
      )}
    </>
  );
};

export default RegisterForm;
