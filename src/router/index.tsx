import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import BrowsePage from '../pages/BrowsePage';
import WatchPage from '../pages/WatchPage';
import SearchPage from '../pages/SearchPage';
import { LoginForm } from '../features/auth/components/LoginForm';
import { RegisterForm } from '../features/auth/components/RegisterForm';

import PageLayout from '../components/layout/PageLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'browse',
        element: <BrowsePage />,
      },
      {
        path: 'watch/:videoId',
        element: <WatchPage />,
      },
      {
        path: 'search',
        element: <SearchPage />
      },
      {
        path: 'login',
        element: <LoginForm />
      },
      {
        path: 'register',
        element: <RegisterForm />
      }
    ]
  }
]);
