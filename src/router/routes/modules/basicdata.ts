import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const BASICDATA: AppRouteRecordRaw = {
  path: '/basicdata',
  name: 'basicdata',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.basicdata',
    requiresAuth: true,
    icon: 'icon-bug',
    order: 4,
  },
  children: [
    {
      path: 'despatchdata',
      name: 'Despatchdata',
      component: () => import('@/views/basicdata/despatchdata/index.vue'),
      meta: {
        locale: 'menu.basicdata.despatchdata',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default BASICDATA;
