import { defineStore } from 'pinia';
import { Notification, NotificationReturn } from '@arco-design/web-vue';
import { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { getUserMenuList } from '@/api/user';
import convertToCamelCase, { convertToKebabCase } from '@/utils/string';
import { WHITE_LIST } from '@/router/constants';
import { AppRouteRecordRaw } from '@/router/routes/types';
import DASHBOARD from '@/router/routes/modules/dashboard';
import { DEFAULT_LAYOUT } from '@/router/routes/base';
import { AppState, MenuItem } from './types';

function generateMenu(
  data: MenuItem[],
  parentName?: string
): AppRouteRecordRaw[] {
  const menuData: AppRouteRecordRaw[] = [];
  const views = import.meta.glob('@/views/**/*.vue');

  data.forEach((menu) => {
    const localeName = convertToCamelCase(menu.name);
    const path = menu.path || `${convertToKebabCase(menu.name)}`;
    const component = menu.component
      ? views[`/src/views${menu.component}`]
      : DEFAULT_LAYOUT;

    const menuItem: AppRouteRecordRaw = {
      path,
      name: menu.name,
      component,
      children: [],
      meta: {
        title: menu.title,
        roles: ['*'], // TODO: menu.perms ? menu.perms.split(',') : [],
        requiresAuth: !WHITE_LIST.some((item) => item.name === menu.name),
        icon: menu.icon,
        hideInMenu: menu.show === 0,
        ignoreCache: menu.cache === 0,
        order: menu.sort,
        locale: parentName
          ? `menu.${parentName}.${localeName}`
          : `menu.${localeName}`,
      },
    };

    if (menu.children && menu.children.length > 0) {
      menuItem.children = generateMenu(menu.children, localeName);
    }

    menuData.push(menuItem);
  });

  return menuData;
}

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      // 获取当前设置
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      // 从存储中检索服务器端菜单配置
      return state.serverMenu as unknown as RouteRecordNormalized[];
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      this.theme = dark ? 'dark' : 'light';
      document.body.setAttribute('arco-theme', this.theme);
    },

    // Toggle device type
    toggleDevice(device: string) {
      this.device = device;
    },

    // Toggle menu visibility
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },

    // Fetch server menu configuration
    async fetchServerMenuConfig() {
      let notifyInstance: NotificationReturn | null = null;
      try {
        notifyInstance = Notification.info({
          id: 'menuNotice', // Keep the instance id the same
          content: 'loading',
          closable: true,
        });
        // 获取用户菜单
        const data = await getUserMenuList();
        // 如果获取数据为空或没有 dashboard 菜单,则添加 dashboard 菜单
        // 如果获取数据不为空且有 dashboard 菜单，则不做任何处理
        if (
          data.length === 0 ||
          !data.some((item) => item.name === 'dashboard')
        ) {
          this.serverMenu = [DASHBOARD].concat(
            generateMenu(data)
          ) as unknown as RouteRecordNormalized[];
        } else {
          this.serverMenu = generateMenu(
            data
          ) as unknown as RouteRecordNormalized[];
        }
        // 显示通知：用户菜单配置加载成功
        notifyInstance = Notification.success({
          id: 'menuNotice',
          content: 'success',
          closable: true,
        });
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        notifyInstance = Notification.error({
          id: 'menuNotice',
          content: 'error',
          closable: true,
        });
      }
    },

    // Clear server menu
    clearServerMenu() {
      this.serverMenu = [];
    },
  },
});

export default useAppStore;
