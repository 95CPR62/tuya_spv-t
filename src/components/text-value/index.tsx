import React, { useEffect, useState } from 'react';
import { Text, View } from '@ray-js/ray';

import styles from './index.module.less';

type TextValueProps = {
  className?: string
  valueClassName?: string
  unitClassName?: string
  marginRight?: string
  value: number
  unit: string
  decimalPlace?: number
}

export const TextValue = (props: TextValueProps) => {
  return (
    <View className={props.className} style={{ marginRight: props.marginRight }}>
      <Text className={`${styles.header2} ${props.valueClassName}`}>{(props.decimalPlace !== undefined) ? props.value.toFixed(props.decimalPlace) : props.value}</Text>
      <Text className={`${styles.desText1} ${props.unitClassName}`} style={{ marginLeft: '6rpx'}}>{props.unit}</Text>
    </View>
  );
};
