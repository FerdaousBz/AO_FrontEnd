import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ROUTE_INPUT_EMAIL_RESET, ROUTE_RESSET_PASSWORD } from '@/utils/consts';
import { setCookie } from '@/utils/cookies';
import handleToast from '@/utils/toast-util';

export default function ResetPasswordLinkHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    // console.log('tokeen', token);

    if (token) {
      setCookie('resetToken', token, 1);
      navigate(ROUTE_RESSET_PASSWORD);
    } else {
      handleToast('error', 'Invalid Token ');
      navigate(ROUTE_INPUT_EMAIL_RESET);
    }
  }, [location, navigate]);

  return null;
}
