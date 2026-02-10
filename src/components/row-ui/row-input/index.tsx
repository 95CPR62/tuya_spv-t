import React, { useEffect, useState } from 'react';
import { Text, View, Switch, Input } from '@ray-js/ray';
import Strings from '@/i18n';

import styles from './index.module.less';

type RowInputProps = {
  className?: string
  title: string
  value: string
  maxLength: number
  type?: string // text, number, idcard, digit
  confirmBtn?: string // search, done, send, next, go
  styleType?: string
  onTapBg?: (value: string) => void
  onConfirm?: (value: string) => void
}

export const RowInput = (props: RowInputProps) => {

  const [isDisabled, setIsDisabled] = useState(false)
  // const height = isDisabled ? '12vh' : '9vh'

  function applyStyleCSS() {
    return props.styleType == 'secondary' ? styles.cardSecondColor : ''
  }

  return (
    <View className={`${styles.contentFlexRow} ${props.className} ${styles.singleRow} ${applyStyleCSS()}`} style={{ justifyContent: 'space-between' }}>
      <Text className={styles.desText1}>{props.title}</Text>
      {/* {
        !isDisabled &&
        <Text className={styles.desText3}>{Strings.getLang('displayNameInputDes')}</Text>
      } */}
      <Input
        className={`${styles.textField} ${styles.header2} ${isDisabled ? styles.textFieldDisabled : ''}`}
        style={{ textAlign: 'center', width: '30vw', padding: '0rpx'}}
        value={props.value}
        type={props.type == undefined ? 'text' : props.type}
        maxLength={props.maxLength}
        confirmType={props.type == undefined ? 'done' : props.type}
        disabled={isDisabled}
        onBlur={(e) => (props.onTapBg !== undefined) ? props.onTapBg(e.detail.value) : {}}
        onConfirm={(e) => (props.onConfirm !== undefined) ? props.onConfirm(e.detail.value) : {}}
      />
    </View>
  );
};
