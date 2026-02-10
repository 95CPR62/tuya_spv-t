import React, { useEffect, useState } from 'react';
import { Text, View, Switch, Input } from '@ray-js/ray';
import Strings from '@/i18n';

import styles from './index.module.less';

type RowDisplayNameProps = {
  className?: string
  title: string
  styleType?: string
  onChange?: (value: boolean) => void
}

export const RowDisplayName = (props: RowDisplayNameProps) => {

  const [isDisabled, setIsDisabled] = useState(true)
  const height = isDisabled ? '12vh' : '14vh'

  function applyStyleCSS() {
    return props.styleType == 'secondary' ? styles.cardSecondColor : ''
  }

  return (
    <View className={`${styles.contentFlexCol} ${props.className} ${styles.card} ${styles.cardSecondColor}`} style={{ justifyContent: 'space-between', height: height, minHeight: '186rpx' }}>
      <View className={`${styles.contentFlexCol}`}>
        <Text className={styles.desText1}>{Strings.getLang('displayName')}</Text>
        {
          !isDisabled &&
          <Text className={styles.desText3}>{Strings.getLang('displayNameInputDes')}</Text>
        }
      </View>
      <Input
        className={`${styles.textField} ${styles.header2} ${isDisabled ? styles.textFieldDisabled : ''}`}
        style={{ textAlign: 'center'}}
        value={props.title}
        type='text'
        maxLength={14}
        confirmType='next'
        disabled={isDisabled}
      />
    </View>
  );
};
