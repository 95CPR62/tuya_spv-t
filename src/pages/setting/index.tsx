import React from 'react';
import { Button, Text, View, getAppInfo, hideMenuButton, navigateTo, redirectTo, router, showMenuButton, usePageEvent } from '@ray-js/ray';
import { TopBar } from '@/components';
import styles from './index.module.less';
import { useDevice } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { routes } from '@/routes.config';
import { GDefine } from '@/constant';

export function Setting() {
  const devInfo = useDevice(device => device.devInfo);

  const items = [
    {id: 1, title: Strings.getLang('speedSetting'), routeTo: '/setting/speedSetting'},
    {id: 3, title: Strings.getLang('scheduleSetting'), routeTo: '/setting/scheduleSetting'},
    {id: 2, title: Strings.getLang('featureSpeedSetting'), routeTo: '/setting/featureSpeed'},
    {id: 4, title: Strings.getLang('primingSetting'), routeTo: '/setting/priming'},
    {id: 6, title: Strings.getLang('noFlowSetting'), routeTo: '/setting/noFlowSetting'},
    {id: 5, title: Strings.getLang('freezeProtection'), routeTo: '/setting/freezeProtection'},
  ]

  usePageEvent('onShow', () => {
    console.log('>>>>> onShow');
    hideMenuButton()
  })

  return (
    <View className={styles.safeArea}>
      <TopBar title={Strings.getLang('topBarSetting')} showBackBtn={true} />
      <View className={`${styles.contentContainer}`} style={{ height: '100%' }} >
        {
          items.map((item) => {
            return <Button onClick={() => { router.push( item.routeTo ) }} key={item.id}>
              <View className={`${styles.contentFlexRow} ${styles.cardCenterRow}`} style={{ justifyContent: 'space-between', height: '120rpx' }}>
                <Text className={styles.desText1}>{item.title}</Text>
              </View>
            </Button>
          })
        }

        {/* <Button type='default' onClick={() => { router.back() }}>back</Button>
        <Button type='default' onClick={pushTo}>Go Sample</Button> */}
        
      </View>
      <View style={{ marginBottom: '0' }}>
        <Text className={styles.desText2}>{`${Strings.getLang('appVersion')}: ${GDefine.appVersion}`}</Text>
      </View>
    </View>
  );
}

export default Setting;