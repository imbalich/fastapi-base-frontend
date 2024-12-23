import { computed } from 'vue';
import { cloneDeep } from 'lodash';
import { RouteRecordNormalized, RouteRecordRaw } from 'vue-router';
import usePermission from '@/hooks/permission';
import { useAppStore } from '@/store';

export default function useMenuTree() {
  const permission = usePermission();
  const appStore = useAppStore();
  const appRoute = computed(() => {
    if (appStore.appAsyncMenus.length === 0) {
      // 加载失败可以在这里触发重新获取菜单数据
      appStore.fetchServerMenuConfig();
    }
    return appStore.appAsyncMenus;
  });
  const menuTree = computed(() => {
    const copyRouter = cloneDeep(appRoute.value) as RouteRecordNormalized[];
    copyRouter.sort((a: RouteRecordNormalized, b: RouteRecordNormalized) => {
      return (a.meta.order || 0) - (b.meta.order || 0);
    });

    function travel(_routes: RouteRecordRaw[], layer: number) {
      if (!_routes) return null;

      const collector: any = _routes.map((element) => {
        // no access
        if (!permission.accessRouter(element)) {
          return null;
        }

        // leaf node
        if (element.meta?.hideInMenu || !element.children) {
          element.children = [];
          if (appStore.menuFromServer) {
            return null;
          }
          return element;
        }

        // route filter hideInMenu true
        element.children = element.children.filter(
          (x) => x.meta?.hideInMenu !== true
        );

        // Associated child node
        const subItem = travel(element.children, layer + 1);
        if (subItem.length) {
          element.children = subItem;
          return element;
        }

        // the else logic
        if (layer > 1) {
          element.children = subItem;
          return element;
        }

        if (element.meta?.hideInMenu === false) {
          return element;
        }

        return null;
      });

      return collector.filter(Boolean);
    }

    return travel(copyRouter, 0);
  });

  return {
    menuTree,
  };
}
