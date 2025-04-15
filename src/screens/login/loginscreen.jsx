import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUi } from '@/contexts/ui.context';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import { Button } from '@/components/atoms';
import InputController from '@/components/atoms/input/input-controller';
import FormWrapper from '@/components/organism/form.wrapper/formwrapper';
import { authentication } from '@/service/auth';
import { ROUTE_INPUT_EMAIL, ROUTE_INPUT_EMAIL_RESET } from '@/utils/consts';
import handleToast from '@/utils/toast-util';

import styles from './login.module.scss';
import useAuth from '@/components/hooks/use-auth';

export default function LoginScreen() {
  const methods = useForm();
  const { control, formState, handleSubmit } = methods;
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, login } = useUi();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (data) => {
    try {
      await login(data.email, data.password);
      //console.log('Authentication response:', response); // Ajoutez ceci
      /*
            login(data.email, data.password);
      */
      //console.log('Authentication response:', response); // Ajoutez ceci

      /*  if (rememberMe) {
         Cookies.set('rememberedEmail', data.email);
         // Ne pas stocker le mot de passe dans les cookies pour des raisons de sécurité
       } else {
         Cookies.remove('rememberedEmail');
       } */
      navigate('/dashboard');
    } catch (error) {
      handleToast('error', 'Bad Credentials');
    }
  };

  useEffect(() => {
    const savedEmail = Cookies.get('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const { errors } = formState;

  return (
    <FormProvider {...methods}>
      <FormWrapper
        imageSrc="/images/logo-AO.png"
        formTitle="Login"
        onSubmit={handleSubmit(handleLogin)}
      >
        <div className={styles.text_area}>
          <label htmlFor="email" className={styles.label}>
            E-mail
          </label>
          <Controller
            name="email"
            control={control}
            defaultValue={email}
            render={({ field }) => (
              <InputController
                {...field}
                type="text"
                id="email"
                placeholder="Enter your Email"
                className={styles.text_input}
                hasError={formState.errors.email && formState.errors.email.message}
              />
            )}
          />
        </div>
        <div className={styles.text_area}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <Controller
            name="password"
            control={control}
            defaultValue={password}
            render={({ field }) => (
              <InputController
                {...field}
                type="password"
                id="password"
                placeholder="Enter your password"
                className={styles.text_input}
                hasError={formState.errors.password && formState.errors.password.message}
              />
            )}
          />
        </div>
        <div className={styles.checkbox_container}>
          <label className={styles.checkbox_label}>
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              className={styles.checkbox}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember Me
          </label>
          <Link to={{ pathname: ROUTE_INPUT_EMAIL_RESET }} className={styles.forgot_password}>
            Forgot Password?
          </Link>
        </div>
        <Button type="submit" className={styles.button}>
          Log In
        </Button>
        <Link to={{ pathname: ROUTE_INPUT_EMAIL }} className={styles.create_account}>
          You don't have an account? &apos;&apos; &apos;&apos;
          <span className={styles.highlight}>Sign Up</span>
        </Link>
      </FormWrapper>
    </FormProvider>
  );
}

LoginScreen.propTypes = {
  control: PropTypes.object,
  formState: PropTypes.object,
  handleSubmit: PropTypes.func,
};
