import React, { useEffect, useState } from 'react';
import {  Button, Text, View, Image, switchTab, router } from '@ray-js/ray';

import styles from './index.module.less';

export const CustomTabBar = ({ now, show }) => {

  useEffect(() => {
    setActive(now)
  })

  const [active, setActive] = useState(2);

  function makeActive(id) {
    if (active === id) return console.log('tab unchanged')
    console.log('tab changed')
    setActive(id)

    switch (id) {
      case 3:
        return  router.push('/setting')
        // switchTab({
        //   url: '/pages/setting/index',
        //   fail: (error) => console.log(error)
        // })

      // case 1:
      //   return switchTab({
      //     url: '/pages/sample/index',
          
      //     fail: (error) => console.log(error)
      //   })
    
      default:
        return router.back()
        //  switchTab({
        //   url: '/pages/home/index',
        //   fail: (error) => console.log(error)
        // })
    }
  }

  if (!show) return null

  return (
    <View
      className={`${styles.tabBarContainer}`}
      style={{  }}>
      {/*
        <Button className={`${styles.tabBtn} ${active === 1 ? styles.tabBtnActive : ''}`} onClick={ () => makeActive(1) }>
          <Image
            className={styles.iconActive}
            style={{ width: '100%', height: '100%' }}
            mode="aspectFit"
            src={require('public/images/ic/ic_home.svg')}
          />
        </Button>
      */}
      <Button className={`${styles.tabBtn} ${active === 2 ? styles.tabBtnActive : ''}`} onClick={ () => makeActive(2) }>
        <Image 
          className={styles.iconActive}
          style={{ width: '100%', height: '100%' }}
          mode="aspectFit"
          src={require('public/images/ic/ic_device.svg')}
        />
      </Button>
      <Button className={`${styles.tabBtn} ${active === 3 ? styles.tabBtnActive : ''}`} onClick={ () => makeActive(3) }>
        <Image 
          className={styles.iconActive}
          style={{ width: '100%', height: '100%' }}
          mode="aspectFit"
          src={require('public/images/ic/ic_setting.svg')}
        />
      </Button>
    </View>
  );
};
