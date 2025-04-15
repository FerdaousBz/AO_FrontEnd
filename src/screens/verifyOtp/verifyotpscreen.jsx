import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/atoms';
import FormWrapper from '@/components/organism/form.wrapper/formwrapper';
import { generateOtp, verifyOtp } from '@/service/auth';
import { ROUTE_INPUT_EMAIL, ROUTE_CREATE_PASSWORD } from '@/utils/consts';
import { setCookie } from '@/utils/cookies';
import handleToast from '@/utils/toast-util';

import styles from './verifyotp.module.scss';

export default function VerifyOtpScreen() {
  const otpRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(60);
  const email = location.state?.email;

  useEffect(() => {
    const savedExpirationTime = localStorage.getItem('otpExpirationTime');
    const currentTime = Date.now();

    if (savedExpirationTime) {
      const remainingTime = Math.max(0, savedExpirationTime - currentTime);
      setCountdown(Math.ceil(remainingTime / 1000));
    }

    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(timer);
            handleToast('error', 'OTP has expired. Please request a new one.');
            navigate(ROUTE_INPUT_EMAIL);
          }
          return prevCountdown - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown, navigate]);

  const handleInputChange = (e, index) => {
    if (e.target.value.length === 1 && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = otpRefs.current.map((ref) => ref.value).join('');
    const otpRegex = /^\d{5}$/;

    if (!otpRegex.test(otp)) {
      handleToast('error', 'OTP Must be a 5-digit number');
      return;
    }

    try {
      if (!email) {
        handleToast('error', 'Email not found. Please request a new OTP.');
        navigate(ROUTE_INPUT_EMAIL);
        return;
      }
      const response = await verifyOtp(email, otp);
      if (response) {
        setCookie('verifiedEmail', email, 1); // Store email in cookies for 1 day
        handleToast('success', 'OTP verified successfully');
        navigate(ROUTE_CREATE_PASSWORD);
      }
    } catch (error) {
      handleToast('error', 'Invalid or expired OTP');
      console.error('OTP Verification Error', error);
    }
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          handleToast('error', 'OTP has expired. Please request a new one.');
          navigate(ROUTE_INPUT_EMAIL);
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };
  const handleResendOtp = async () => {
    try {
      await generateOtp(email);
      handleToast('success', 'OTP has been resent to your email.');
      const expirationTime = Date.now() + 60 * 1000; // 60 seconds from now
      localStorage.setItem('otpExpirationTime', expirationTime);
      setCountdown(60); // Reset the countdown
      startTimer();
    } catch (error) {
      handleToast('error', 'Failed to resend OTP. Please try again.');
      // console.error('Error in handleResendOtp:', error);
    }
  };

  return (
    <FormWrapper
      imageSrc="public/images/logo-AO.png"
      formTitle="Verify OTP"
      onSubmit={handleSubmit}
    >
      <label htmlFor="otp" className={styles.label}>
        OTP
      </label>

      <div className={styles.otp_input_container} onSubmit={handleSubmit}>
        {Array.from({ length: 5 }).map((_, index) => (
          <input
            key={index}
            type="text"
            id={`otp${index + 1}`}
            name={`otp${index + 1}`}
            className={styles.otp_input}
            maxLength="1"
            ref={(el) => (otpRefs.current[index] = el)}
            onChange={(e) => handleInputChange(e, index)}
          />
        ))}
      </div>
      <p className={styles.timer}>
        Code expires in:{' '}
        <span className={styles.highlightTimer}>
          {countdown}
          seconds
        </span>
      </p>

      <Button type="submit" className={styles.button}>
        Verify
      </Button>
      <Link className={styles.create_account} onClick={handleResendOtp}>
        You did not receive a code? &apos;&apos; &apos;&apos;{' '}
        <span className={styles.highlight}>Resend</span>
      </Link>
    </FormWrapper>
  );
}
