import React, { useEffect, useState } from 'react';
import { Text, View, Input } from '@ray-js/ray';
import Strings from '@/i18n';

import styles from './index.module.less';

type SpeedInputProps = {
  className?: string
  value: string
  type?: string // text, number, idcard, digit
  confirmBtn?: string // search, done, send, next, go
  editable?: boolean
  styleType?: string
  onInput?: (value: string) => void
  onTapBg?: (value: string) => void
  onConfirm?: (value: string) => void
}

export const SpeedInput = (props: SpeedInputProps) => {

  // const [isDisabled, setIsDisabled] = useState(!props.editable ? true : false)
  // const height = isDisabled ? '12vh' : '9vh'

  function applyStyleCSS() {
    return props.styleType == 'secondary' ? styles.cardSecondColor : ''
  }

  return (
    <View className={`${styles.contentFlexCol} ${props.className} ${applyStyleCSS()}`} style={{ alignItems: 'center' }}>
      <Text className={`${styles.desText1}`}>{`${Strings.getLang('speed')}`}</Text>

      <View className={`${styles.contentFlexRow} ${styles.singleRow} ${applyStyleCSS()}`} style={{ justifyContent: 'space-between', width: '35vw' }}>
      {/* {
        !isDisabled &&
        <Text className={styles.desText3}>{Strings.getLang('displayNameInputDes')}</Text>
      } */}
        <Input
          className={`${styles.textField} ${styles.header2}`}
          style={{ position: 'absolute', textAlign: 'center', padding: '0 30rpx 0 0'}}
          value={props.value}
          type='number'
          maxLength={4}
          confirmType='send'
          disabled={!props.editable}
          onInput={(e) => (props.onInput !== undefined) ? props.onInput(e.detail.value) : {}}
          onBlur={(e) => (props.onTapBg !== undefined) ? props.onTapBg(e.detail.value) : {}}
          onConfirm={(e) => (props.onConfirm !== undefined) ? props.onConfirm(e.detail.value) : {}}
        />
      </View>

  <Text className={`${styles.desText1}`}>{`${Strings.getLang('speedUnit')}`}</Text>

</View>
  );
};
