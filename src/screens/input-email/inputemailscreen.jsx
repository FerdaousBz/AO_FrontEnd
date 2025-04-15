import PropTypes from 'prop-types';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/atoms';
import InputController from '@/components/atoms/input/input-controller';
import FormWrapper from '@/components/organism/form.wrapper/formwrapper';
import { generateOtp, initiatePasswordReset } from '@/service/auth';
import { ROUTE_VERIFY_OTP } from '@/utils/consts';
import handleToast from '@/utils/toast-util';

import styles from './inputemail.module.scss';

function InputEmailScreen({ from }) {
  const methods = useForm();
  const { control, formState, handleSubmit } = methods;
  const navigate = useNavigate();

  const handleFormSubmit = async (data) => {
    // console.log('Form data:', data);
    try {
      if (from === 'reset') {
        await initiatePasswordReset(data.email);
        handleToast('success', 'Email sent successfully for reset password');
      } else if (from === 'signup') {
        await generateOtp(data.email);
        handleToast('success', 'OTP code sent successfully');
        navigate(ROUTE_VERIFY_OTP, { state: { email: data.email } });
      } else {
        handleToast('error', 'Unknown action type');
      }
    } catch (error) {
      handleToast('error', 'Email already exist');
      // console.error('Error:', error);
    }
  };

  const { errors } = formState;

  return (
    <FormProvider {...methods}>
      <FormWrapper
        imageSrc="public/images/logo-AO.png"
        formTitle={from === 'reset' ? 'Forget Password' : 'Send Email'}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className={styles.form_group}>
          <label htmlFor="email" className={styles.label}>
            E-mail
          </label>
          <div className={styles.text_area}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <InputController
                  {...field}
                  type="email"
                  id="email"
                  placeholder="Enter your Email"
                  className={styles.text_input}
                  hasError={errors?.email && errors?.email.message}
                />
              )}
            />
          </div>
        </div>
        <Button type="submit" className={styles.button}>
          {from === 'reset' ? 'Forget Password' : 'Send Email'}
        </Button>
      </FormWrapper>
    </FormProvider>
  );
}

InputEmailScreen.propTypes = {
  from: PropTypes.string.isRequired,
};

export default InputEmailScreen;
