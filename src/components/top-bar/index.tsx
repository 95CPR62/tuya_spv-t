import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Image, getConnectedWifi, router, showToast, Text, View } from '@ray-js/ray';
import { useDevice } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';

import styles from './index.module.less';

type TopBarProps = {
  title: string
  showBackBtn?: boolean
  subtitle?: string
  smallFont?: boolean
  custom?: boolean
  onClick?: (value: string) => void
}

export const TopBar = (props: TopBarProps) => {
  const statusBarHeight = useSelector(selectSystemInfoByKey('statusBarHeight'));
  const devInfo = useDevice(device => device.devInfo);

  return (
    <View className={styles.topBarWrap}>
      {
        (!props.showBackBtn) && (<>
          <View className={styles.topBar} style={{ height: '7vh', textOverflow: 'ellipsis', overflow: 'hidden', position: 'relative' }} >
              <Text className={`${styles.header1} ${props.smallFont ? styles.smallFont : ''}`} style={{ whiteSpace: 'nowrap',top: '50%', position: 'absolute', transform: 'translateY(-50%)' }}>{props.title || ''}</Text>
          </View>
        </>)
      }
      {
        (props.showBackBtn) && (<>
          <View className={`${styles.topBar} ${styles.topBarWithBack} ${styles.contentFlexRow}`} style={{ height: '7vh' }}>
            <Button style={{ width: '56rpx', height: '56rpx'}} onClick={() => { 
              if(props.custom){
                props.onClick()
              }else {
                router.back()
              }
            }}>
              <Image 
                style={{ width: '100%', height: '100%'}}
                mode="aspectFit"
                src={require('public/images/ic/ic_back.svg')}
              />
            </Button>
            <Text className={`${styles.header1} ${props.smallFont ? styles.smallFont : ''}`} style={{ textAlign: 'right' }}>{props.title || ''}</Text>
          </View>
          <View className={`${styles.subTitle} ${props.subtitle == undefined ? styles.hidden : ''}`}>
            <Text className={`${styles.header1} ${props.smallFont ? styles.smallFont : ''}`} style={{ textAlign: 'right' }}>{props.subtitle}</Text>
          </View>
        </>)
      }
    </View>
  );
};