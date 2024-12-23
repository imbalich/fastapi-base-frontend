import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';

export default function usePermission() {
  const userStore = useUserStore();
  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      return (
        // 路由不需要认证 route.meta.requiresAuth = false
        !route.meta?.requiresAuth ||
        // 路由不限制角色（route.meta.roles 为空或不存在）
        !route.meta?.roles ||
        // 路由允许所有角色（route.meta.roles 包含 '*'）
        route.meta?.roles?.includes('*') ||
        // 用户的角色在路由允许的角色列表中（route.meta.roles 包含 userStore.roles）
        route.meta?.roles?.includes(userStore.roles)
      );
    },
    findFirstPermissionRoute(_routers: any, role = 'admin') {
      // 这个函数用来找到用户有权限访问的第一个路由。它接受两个参数： _routers（路由数组）和 role（用户角色，默认为 'admin'）。
      // 它首先复制了路由数组，然后使用 while 循环遍历它。
      // 如果第一个路由的 meta.roles 包含用户角色或者 meta.roles 包含 *，则它就是用户有权限访问的第一个路由，返回它的 name 字段。
      // 如果第一个路由的子路由不为空，那么它会将子路由添加到复制的路由数组中，然后继续遍历。
      // 如果没有找到用户有权限访问的第一个路由，返回 null。
      const cloneRouters = [..._routers];
      while (cloneRouters.length) {
        const firstElement = cloneRouters.shift();
        if (
          firstElement?.meta?.roles?.find((el: string[]) => {
            return el.includes('*') || el.includes(role);
          })
        )
          return { name: firstElement.name };
        if (firstElement?.children) {
          cloneRouters.push(...firstElement.children);
        }
      }
      return null;
    },
    // You can add any rules you want
  };
}
