import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';
import { postData } from '../../../libs/cors/apiClient';
import axios from 'axios';

const ResetPasswordForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleVerifyEmail = async () => {
    try {
      const response = await axios.post('http://localhost:4000/rest/auth/start-verification', {
        email: email,
        type: 'PASSWORD'
      });

      if (response?.status === 200) {
        setIsCodeSent(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const resonse = await axios.put('http://localhost:4000/rest/auth/reset-password', {
        code: verificationCode,
        password: password
      });
      if (resonse?.status === 200) {
        navigate('/login', { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Stack spacing={3}>
        {isCodeSent ? (
          <>
            <TextField
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              name="verificationCode"
              label="Verification Code"
            />
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
          </>
        ) : (
          <TextField value={email} onChange={(e) => setEmail(e.target.value)} name="email" label="Email" />
        )}
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}></Stack>
      {isCodeSent ? (
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleResetPassword}>
          Reset Password
        </LoadingButton>
      ) : (
        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleVerifyEmail}>
          Send Verification Code
        </LoadingButton>
      )}
    </>
  );
};

export default ResetPasswordForm;
