import { lazy } from 'react';
import type { RouteObject } from 'react-router';
import AdminLayout from '@/shared/layouts/AdminLayout';

// Lazy load the billing page
const BillingPage = lazy(() => import('./pages/BillingPage'));

export const billingRoutes: RouteObject = {
  path: 'billing',
  element: <AdminLayout />,
  children: [
    {
      index: true,
      element: <BillingPage />,
    },
    {
      path: ':id',
      element: <BillingPage />,
    },
  ],
};

export default billingRoutes;
