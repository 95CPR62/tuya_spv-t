import React, { useEffect, useState } from 'react';
import { Text, View, Picker } from '@ray-js/ray';
import Strings from '@/i18n';

import styles from './index.module.less';

type SpeedPickerProps = {
  className?: string
  value: number
  modes: string[]
  editable?: boolean
  styleType?: string
  onChange?: (value: number) => void
}

export const SpeedPicker = (props: SpeedPickerProps) => {

  const [isDisabled, setIsDisabled] = useState(false)
  // const height = isDisabled ? '12vh' : '9vh'

  function applyStyleCSS() {
    return props.styleType == 'secondary' ? styles.cardSecondColor : ''
  }

  return (
    <View className={`${styles.contentFlexRow} ${props.className} ${styles.absoluteCenter} ${applyStyleCSS()}`} style={{ justifyContent: 'space-between', height: '8vh', minHeight: '100rpx' }}>
      <Picker
        mode="selector"
        range={props.modes}
        value={props.value}
        confirmText={Strings.getLang('Confirm')}
        cancelText={Strings.getLang('Cancel')}
        disabled={props.editable !== undefined ? !props.editable : false}
        onChange={ (e) => props.onChange !== undefined ? props.onChange(e.value) : {} }
      >
        <View className={`${styles.contentFlexRow} ${styles.dropdownListContainer} ${styles.textField}`} style={{ width: '35vw' }}>
          <Text style={{ flex: 1, textAlign: 'center', color: 'white' }}>{props.modes[props.value]}</Text>
        </View>
      </Picker>
    </View>
  );
};
