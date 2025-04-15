import PropTypes from 'prop-types';
import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { Button } from '@/components/atoms';
import InputController from '@/components/atoms/input/input-controller';
import FormWrapper from '@/components/organism/form.wrapper/formwrapper';
import { initiatePasswordReset } from '@/service/auth';
import handleToast from '@/utils/toast-util';

import styles from './inputemail.module.scss';
import InputEmailScreen from './inputemailscreen';

export default function InputEmailResetScreen() {
  const methods = useForm();
  const { control, formState, handleSubmit } = methods;
  // const navigate = useNavigate();

  const handleEmailReset = async (data) => {
    try {
      await initiatePasswordReset(data.email);
      handleToast('success', 'Mail is sent');
    } catch (error) {
      // console.error('Error', error);
      handleToast('error', 'Mail does not exist ');
    }
  };

  const { errors } = formState;

  return (
    <FormProvider {...methods}>
      <FormWrapper
        imageSrc="public/images/logo-AO.png"
        formTitle="Input Email"
        onSubmit={handleSubmit(handleEmailReset)}
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
                  type="text"
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
          Sign Up
        </Button>
        <a href="#" className={styles.create_account}>
          You already have an account ?<span className={styles.highlight}>Send Email</span>
        </a>
      </FormWrapper>
    </FormProvider>
  );
}
InputEmailScreen.propTypes = {
  control: PropTypes.object,
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  formState: PropTypes.object,
};
