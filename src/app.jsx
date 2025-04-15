import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { UiProvider } from './contexts/ui.context';
import AppRoute from './routes/app-route';

export default function App() {
  return (
    <UiProvider>
      <BrowserRouter>
        <AppRoute />
        <ToastContainer />
      </BrowserRouter>
    </UiProvider>
  );
}
