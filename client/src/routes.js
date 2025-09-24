import Home from './pages/Home';
import DonorDashboard from './pages/DonorDashboard';
import NGOPortal from './pages/NGOPortal';

const routes = [
  {
    path: '/',
    component: Home,
    isProtected: false,
    exact: true
  },
  {
    path: '/dashboard',
    component: DonorDashboard,
    isProtected: true,
    exact: true
  },
  {
    path: '/ngo-portal',
    component: NGOPortal,
    isProtected: true,
    exact: true
  }
];

export default routes;