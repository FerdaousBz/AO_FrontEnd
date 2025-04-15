import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/atoms';
import InputController from '@/components/atoms/input/input-controller';
import FormWrapper from '@/components/organism/form.wrapper/formwrapper';
import { createAccount, updatePassword } from '@/service/auth';
import { ROUTE_RESSET_PASSWORD, ROUTE_SIGNIN } from '@/utils/consts';
import { getCookie, setCookie } from '@/utils/cookies';
import handleToast from '@/utils/toast-util';

import styles from './resetpassword.module.scss';

export default function RecreatePasswordScreen({ from }) {
  const methods = useForm();
  const { control, formState, handleSubmit } = methods;
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(null);
  // const [email, setEmail] = useState("");
  const email = getCookie('verifiedEmail');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');

    if (tokenFromUrl) {
      setCookie('resetToken', tokenFromUrl, 1); // Store token in cookie for 1 day
      setToken(tokenFromUrl);
      navigate(ROUTE_RESSET_PASSWORD, { replace: true }); // Redirect to remove token from URL
    } else {
      const tokenFromCookie = getCookie('resetToken');
      setToken(tokenFromCookie);
    }
  }, [location, navigate]);

  const handlePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      handleToast('error', 'Passwords do not match');
      return;
    }

    try {
      if (from === 'ressetpass') {
        if (!token) {
          handleToast('error', 'Invalid or missing token');
          return;
        }
        await updatePassword(token, data.newPassword, data.confirmPassword);
        handleToast('success', 'Password updated successfully');
        navigate(ROUTE_SIGNIN);
      } else if (from === 'createpass') {
        if (!email) {
          handleToast('error', 'Email not found. Please verify your email first.');
          navigate('/verify-otp'); // Adjust the route as needed
          return;
        }

        await createAccount(email, data.newPassword, data.confirmPassword);

        handleToast('success', 'Account created successfully');
        navigate(ROUTE_SIGNIN);
      }
    } catch (error) {
      handleToast('error', 'Error updating password: ' + (error.response?.data || error.message));
      // console.error('Password Update Error', error);
    }
  };

  const { errors } = formState;

  return (
    <FormProvider {...methods}>
      <FormWrapper
        imageSrc="public/images/logo-AO.png"
        formTitle={from === 'ressetpass' ? 'Reset Password' : 'Create Password'}
        onSubmit={handleSubmit(handlePassword)}
      >
        <div className={styles.form_group}>
          <div className={styles.text_area}>
            <label htmlFor="newPassword" className={styles.label}>
              New Password
            </label>
            <Controller
              name="newPassword"
              control={control}
              defaultValue=""
              rules={{ required: 'New Password is required' }}
              render={({ field }) => (
                <InputController
                  {...field}
                  type="password"
                  id="newPassword"
                  placeholder="Enter your new password"
                  className={styles.text_input}
                  hasError={errors.newPassword && errors.newPassword.message}
                />
              )}
            />
          </div>
          <div className={styles.text_area}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              rules={{ required: 'Confirm Password is required' }}
              render={({ field }) => (
                <InputController
                  {...field}
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your new password"
                  className={styles.text_input}
                  hasError={errors.confirmPassword && errors.confirmPassword.message}
                />
              )}
            />
          </div>
        </div>
        <Button type="submit" className={styles.button}>
          {from === 'ressetpass' ? 'Reset Password' : 'Create Password'}
        </Button>
      </FormWrapper>
    </FormProvider>
  );
}

RecreatePasswordScreen.propTypes = {
  from: PropTypes.string.isRequired,
};
