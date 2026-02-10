import React, { useEffect, useState } from 'react';
import { Text, View } from '@ray-js/ray';
import Strings from '@/i18n';

import styles from './index.module.less';
import { powerGreen, vStackSpace } from '@/constant';
import { TextValue } from '@/components';
import { set } from 'lodash-es';
import { Slider } from '@ray-js/smart-ui';

type RowSliderProps = {
  className?: string
  id: number
  title: string
  value: number
  valUnit: string
  min: number
  max: number
  step: number
  styleType?: string
  activeColor?: string
  isDisable?: boolean
  onChanging?: (value: number) => void
  onChange?: (value: number) => void
}

export const RowSpeedSetting = (props: RowSliderProps) => {
  const [isChanging, setIsChanging] = useState(false)
  const [onChangingLevel, setOnChangingLevel] = useState(props.value)

  const [value, setValue] = useState(props.value)

  function applyStyleCSS() {
    return props.styleType == 'secondary' ? styles.cardSecondColor : ''
  }

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  return (
    <View 
      className={`${styles.contentFlexRow} ${props.className} ${applyStyleCSS()}`}
      style={{ height: '18vh', minHeight: '238rpx', maxHeight: '238rpx'}}
    >
      <View className={`${styles.contentFlexCol}`} style={{ width: '100%', alignItems: 'center' }}>
        <View className={`${styles.contentFlexRow}`} style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <View className={styles.fieldset}>
            <Text className={`${styles.legend} ${styles.desText3}`}>{`${Strings.getLang('speed')} ${props.id} ${Strings.getLang('title')}`}</Text>
            <Text className={`${styles.desText1}`}>{props.title}</Text>
          </View>

          <Text className={`${styles.desText1}`}>:</Text>

          <View className={styles.fieldset}>
            <Text className={`${styles.legend2} ${styles.desText3}`}>{'RPM'}</Text>
            { 
              !isChanging && (
                <Text className={`${styles.desText1}`}>{value}</Text>
              )
            }
            { 
              isChanging && (
                <Text className={`${styles.desText1}`}>{onChangingLevel}</Text>
              )
            }
          </View>
        </View>
        <View style={{ width: '100%'}}>
        <Slider 
          style={{ padding: '30rpx 20rpx' }}
          step={props.step}
          minTrackColor={'#003d75'}
          thumbWidth='30px'
          thumbHeight='20px'
          maxTrackHeight='6px'
          minTrackHeight='6px'
          thumbColor={'#fff'}
          maxTrackColor={'#848081'}
          // blockColor={powerGreen}
          min={props.min}
          max={props.max}
          value={props.value}
          disabled={props.isDisable !== undefined ? props.isDisable : false}
          // onChanging={(e) => {
          //   setIsChanging(true)
          //   setOnChangingLevel(e.value)
          //   props.onChanging !== undefined ? props.onChanging(e.value) : {} 
          // }}
          onChange={(e) => {
            setIsChanging(false)
            setOnChangingLevel(e)
            setValue(e)
            props.onChange !== undefined ? props.onChange(e) : {} 
          }}
        />
        </View>
        <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-between', width: '100%' }}>
          <Text className={styles.desText3}>{props.min}</Text>
          <Text className={styles.desText3}>{props.max}</Text>
        </View>
      </View>
    </View>
  );
};
