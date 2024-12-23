import type { Router, RouteRecordNormalized } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import usePermission from '@/hooks/permission';
import { useAppStore, useUserStore } from '@/store';
import appRoutes from '@/router/routes';
import { NOT_FOUND, WHITE_LIST } from '../constants';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const Permission = usePermission();
    const permissionsAllow = Permission.accessRouter(to);

    // 白名单直接放行
    if (WHITE_LIST.find((el) => el.name === to.name)) {
      next();
      NProgress.done();
      return;
    }

    // 动态菜单加载
    if (
      !appStore.appAsyncMenus.length &&
      !WHITE_LIST.find((el) => el.name === to.name)
    ) {
      // 加载菜单
      await appStore.fetchServerMenuConfig();
    }

    const serverMenuConfig = [...appStore.appAsyncMenus, ...WHITE_LIST];
    let exist = false;

    // 遍历菜单，检查路由是否存在
    while (serverMenuConfig.length && !exist) {
      const element = serverMenuConfig.shift();
      if (element?.name === to.name) {
        exist = true;
      }
      if (element?.children) {
        serverMenuConfig.push(
          ...(element.children as unknown as RouteRecordNormalized[])
        );
      }
    }

    // 如果找到了有权限的路由，重定向到该路由，否则去 404
    if (exist && permissionsAllow) {
      next();
    } else {
      const destination =
        Permission.findFirstPermissionRoute(appRoutes, userStore.roles) ||
        NOT_FOUND;
      next(destination);
    }

    NProgress.done();
  });
}
