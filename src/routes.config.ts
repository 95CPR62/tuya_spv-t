import { Routes } from '@ray-js/types';

export const routes: Routes = [
  {
    route: '/',
    path: '/pages/home/index',
    name: 'Home',
  },
  {
    route: '/setting',
    path: '/pages/setting/index',
    name: 'Setting',
  },
  {
    route: '/setting/speedSetting',
    path: '/pages/setting/speed_setting/index',
    name: 'Speed_Setting',
  },
  {
    route: '/setting/featureSpeed',
    path: '/pages/setting/feature_speed_setting/index',
    name: 'Feature_Speed_Setting',
  },
  {
    route: '/setting/scheduleSetting',
    path: '/pages/setting/schedule_setting/index',
    name: 'Schedule_Setting',
  },
  {
    route: '/setting/priming',
    path: '/pages/setting/priming_setting/index',
    name: 'Priming_Setting',
  },
  {
    route: '/setting/freezeProtection',
    path: '/pages/setting/freeze_protection/index',
    name: 'Freeze_Protection',
  },
  {
    route: '/setting/noFlowSetting',
    path: '/pages/setting/no_flow_setting/index',
    name: 'No_Flow_Setting',
  },
];
