/* context ui */

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const IMAGE_URL = 'IMAGE_URL';
export const USERNAME = 'USERNAME';
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const NEWCHAT = 'NEWCHAT';
export const RESETCHAT = 'RESETCHAT';
export const UPDATECHATLIST = 'UPDATECHATLIST';
export const RESETCHATLIST = 'RESETCHATLIST';
export const OPENSIDEBAR = 'OPENSIDEBAR';
export const SUBMENU = 'SUBMENU';

/* loading conts behaviour */
export const IDLE = 'IDLE';
export const LOADING = 'LOADING';
export const SUCCESS = 'SUCCESS';
export const DONE = 'DONE';
export const ERROR = 'ERROR';

/* Screen routes */

export const ROUTE_DASHBOARD = '/dashboard';
export const ROUTE_SIGNIN = '/signin';
export const ROUTE_VERIFY_OTP = '/verify-otp';
export const ROUTE_INPUT_EMAIL = '/input-email';
export const ROUTE_INPUT_EMAIL_RESET = '/input-email-reset';
export const ROUTE_RESSET_PASSWORD = '/reset-password';
export const ROUTE_CREATE_PASSWORD = '/create-password';
export const ROUTE_SOUTENANCE = '/soutenance';
export const ROUTE_PROFILE = '/profile';

/* BACKEND API routes */

export const BACKEND_OTP_SENT = '/api/auth/verify-email';
export const BACKEND_SIGNUP = '/api/auth/signup';
export const BACKEND_SIGNIN = '/api/auth/signin';
export const BACKEND_FORGET_PASSWORD = '/api/auth/forgot-password';
export const BACKEND_RESET_PASSWORD = '/api/auth/reset-password';
export const BACKEND_UPDATE_PASS = '/api/auth/change-password';

export const BACKEND_VERIF_OTP = '/api/otp/verify-otp';

export const BACKEND_GET_USERBYID = '/api/resource/user/'; //Get user Details by id
export const BACKEND_UPDATE_USER = '/api/resource/update/user/'; //Update userby id

export const BACKEND_OPPORTUNITIES =
  '/boondmanager/opportunities'; /* this api is for all opportunities */
export const BACKEND_OPPORTUNITIES_DROPDOWN = '/boondmanager/opportunities/dropdown';
export const BACKEND_GET8RESUME = '/api/files/get-resume';

export const BACKEND_NEW_OPPORTUNITIES =
  '/boondmanager/newopportunities'; /* this api is for new opportunities means create new opportunities */
export const BACKEND_OPPORTUNITIES_ID = (id) =>
  `/boondmanager/opportunities/${id}`; /* this api is for the opportunities with id  */
export const BACKEND_UPLOAD_FILE = '/api/files/upload';
export const BACKEND_GEN_SUMMARY = '/api/files/generate-summary';
export const BACKEND_GET_RESUME = '/api/files/get-resume';
export const BACKEND_ADD_PARTICIPANT = '/api/participant/addparticipant';
export const BACKEND_ALL_PARTICIPANT = '/api/participant/participant';

//export const BACKEND_OPP_INFORMATION = (id) => `/boondmanager/opportunities/${id}/information`; /* this api is for the opportunities details by id  */
export const BACKEND_OPP_INFORMATION =
  '/boondmanager/opportunities/'; /* this api is for the opportunities details by id  */

//Get ppt
export const BACKEND_GET_PPT = '/api/ppt/get/generate/ppt/';
//generate ppt
export const BACKEND_GEN_PPT = '/api/ppt/generate/ppt/';

// Combined API opportunities and generate summary
export const BACKEND_OPPORT_SUMMARY = '/api/files/opportunity/';

// Send email for the Summary
export const BACKEND_SEND_RESUME_EMAIL = '/api/emails/send-resume'; // Send resume
export const BACKEND_DROPDOWN = '/boondmanager/opportunities/dropdown'; //DoprDownList
export const BACK_END_FILTER_NAVBAR = '/boondmanager/dictionary/opportunities/filter'; // get all filter
export const BACK_END_OPP_ID_VALUES = '/boondmanager/dictionary/opportunities/'; // get value dictionary for an opportunity
