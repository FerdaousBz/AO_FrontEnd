import Layout from '@/layouts/layout';
import DashboardPage from '@/pages/Dashboard';
import InputEmailPage from '@/pages/input-email-page';
import LoginPage from '@/pages/login-page';
import RecreatePasswordPage from '@/pages/recreate-password-page';
import VerifyOtpPage from '@/pages/verify-otp-page';
import {
  ROUTE_CREATE_PASSWORD,
  ROUTE_DASHBOARD,
  ROUTE_INPUT_EMAIL,
  ROUTE_INPUT_EMAIL_RESET,
  ROUTE_PROFILE,
  ROUTE_RESSET_PASSWORD,
  ROUTE_SIGNIN,
  ROUTE_SOUTENANCE,
  ROUTE_VERIFY_OTP,
} from '@/utils/consts';
import { AuthLayout } from '../layouts';
import SoutenancePage from '@/pages/soutenance';
import FormWrapper from '@/components/organism/form.wrapper/formwrapper';
import ProfileScreen from '@/screens/profile/profileScreen';
import ProfilePage from '@/pages/profile';

const routes = [
  {
    component: () => (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
    name: 'Signin',
    path: ROUTE_SIGNIN,
  },
  {
    component: () => (
      <AuthLayout>
        <VerifyOtpPage />
      </AuthLayout>
    ),
    name: 'VerifyOtp',
    path: ROUTE_VERIFY_OTP,
  },
  {
    component: () => (
      <AuthLayout>
        <InputEmailPage from="signup" />
      </AuthLayout>
    ),
    name: 'Inputemail',
    path: ROUTE_INPUT_EMAIL,
  },

  {
    component: () => (
      <AuthLayout>
        <InputEmailPage from="reset" />
      </AuthLayout>
    ),
    name: 'Inputemail',
    path: ROUTE_INPUT_EMAIL_RESET,
  },
  {
    component: () => (
      <AuthLayout>
        <RecreatePasswordPage from="ressetpass" />
      </AuthLayout>
    ),
    name: 'RecreatePassword',
    path: ROUTE_RESSET_PASSWORD,
  },
  {
    component: () => (
      <AuthLayout>
        <RecreatePasswordPage from="createpass" />
      </AuthLayout>
    ),
    name: 'RecreatePassword',
    path: ROUTE_CREATE_PASSWORD,
  },
  {
    component: () => (
      <Layout>
        <DashboardPage />
      </Layout>
    ),
    name: 'Dashboard',
    path: ROUTE_DASHBOARD,
  },
  {
    component: () => (
      <Layout page="soutenance">
        <SoutenancePage />
      </Layout>
    ),
    name: 'Soutenance',
    path: `${ROUTE_SOUTENANCE}`,
  },
  {
    component: () => (
      <Layout page="soutenance">
        <ProfilePage/>
      </Layout>
    ),
    name: 'Profile',
    path: ROUTE_PROFILE,
  },
];

export default routes;
