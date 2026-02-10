import React, { useEffect, useState } from 'react';
import { Image, Text, View, Picker } from '@ray-js/ray';
import Strings from '@/i18n';

import styles from './index.module.less';

type RowDropdownListProps = {
  className?: string
  title: string
  value: number
  modes: string[]
  editable?: boolean
  styleType?: string
  onChange?: (value: number) => void
}

export const RowDropdownList = (props: RowDropdownListProps) => {

  function applyStyleCSS() {
    return props.styleType == 'secondary' ? styles.cardSecondColor : ''
  }

  return (
    <View className={`${styles.contentFlexRow} ${props.className} ${applyStyleCSS()}`} style={{ justifyContent: 'space-between', height: '8vh', minHeight: '100rpx' }}>
      <Text className={styles.desText1}>{props.title}</Text>
      <Picker
        mode="selector"
        range={props.modes}
        value={props.value}
        confirmText={Strings.getLang('Confirm')}
        cancelText={Strings.getLang('Cancel')}
        disabled={props.editable !== undefined ? !props.editable : false}
        onChange={ (e) => {
          props.onChange !== undefined ? props.onChange(e.value) : {}
        }}
      >
        <View className={`${styles.contentFlexRow} ${styles.dropdownListContainer}`} style={{ width: '35vw' }}>
          <Text className={`${styles.desText2} ${styles.textLighter}`} style={{ flex: 1, textAlign: 'center' }}>{props.modes[props.value]}</Text>
          <Image 
            style={{ width: '30rpx', height: '30rpx', flex: '0 auto'}}
            mode="aspectFit"
            src={require('public/images/ic/ic_arrow_down.svg')}
          />
        </View>
      </Picker>
    </View>
  );
};
