import React, { useEffect, useState } from 'react';
import { Text, View } from '@ray-js/ray';
import Strings from '@/i18n';

import styles from './index.module.less';
import { powerGreen, secondaryColor } from '@/constant';
import { Switch } from '@ray-js/smart-ui';

type RowSwitchProps = {
  className?: string
  nodeClass?: string
  title: string
  state?: boolean
  tintColor?: string
  stateTextType?: number
  styleType?: string
  onChange?: (value: boolean) => void
}

export const RowSwitch = (props: RowSwitchProps) => {

  const [switchFunc, setSwitchFunc] = useState(props.state)

  console.log('RowSwitch - switchFunc:', switchFunc);

  function applyStyleCSS() {
    return props.styleType == 'secondary' ? styles.cardSecondColor : ''
  }

  // const applyStyleCSS = () => {
  //   if (props.styleType === 'secondary' && props.stateTextType === 1) {
  //       setSwitchFunc(true); // Set to true for "ON", or based on your logic
  //   } else {
  //       setSwitchFunc(false); // Optionally reset or set based on your logic
  //   }
  // };

  // useEffect(() => {
  //   applyStyleCSS(); // Call the function on mount and when props change
  // }, [props.styleType, props.stateTextType]);

  // useEffect(() => {
  //   setSwitchFunc(props.state)
  // }, [props.state]);

  return (
    <View className={`${styles.contentFlexRow} ${props.className} ${applyStyleCSS()}`} style={{ justifyContent: 'space-between', height: '8vh', minHeight: '100rpx' }}>
        <Text className={styles.desText1}>{props.title}</Text>
        <View className={`${styles.contentFlexRow}`}>
          {
            props.stateTextType == 1 && (<>
              <Text className={`${styles.desText1} ${styles.textLighter}`}>{switchFunc ? Strings.getLang('ON') : Strings.getLang('OFF')}</Text>
            </>)
          }
          {
            props.stateTextType == 2 && (<>
              <Text className={`${styles.desText1} ${styles.textLighter}`}>{switchFunc ? Strings.getLang('Enable') : Strings.getLang('Disable')}</Text>
            </>)
          }
          <Switch
            nodeClass={`${switchFunc && props.nodeClass? props.nodeClass : ''}`}
            style={{ marginLeft: '1vw' }}
            checked={switchFunc}
            inactiveColor="#cccccc"
            activeColor={(props.tintColor !== undefined) ? props.tintColor : secondaryColor}
            // color={(props.tintColor !== undefined) ? props.tintColor : secondaryColor}
            onChange={(e) => {
              setSwitchFunc(e.detail)
              return props.onChange !== undefined ? props.onChange(e.detail) : {}
            }}
          />
        </View>
      </View>
  );
};
