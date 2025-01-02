import { AppRouteRecordRaw } from '@/router/routes/types';
import { DEFAULT_LAYOUT } from '@/router/routes/base';

const DATAMANAGE: AppRouteRecordRaw = {
  path: '/datamanage',
  name: 'datamanage',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.datamanage',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 9,
  },
  children: [
    {
      path: 'dm-despatch',
      name: 'Despatch',
      component: () => import('@/views/datamanage/despatch/index.vue'),
      meta: {
        locale: 'menu.datamanage.despatch',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DATAMANAGE;
