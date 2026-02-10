import React, { useEffect, useState } from 'react';
import { Text, View } from '@ray-js/ray';
import Strings from '@/i18n';

import styles from './index.module.less';
import { powerGreen, vStackSpace } from '@/constant';
import { TextValue } from '@/components/text-value';
import { Slider } from '@ray-js/smart-ui';
import { throttle } from 'lodash-es';

type RowSliderProps = {
  className?: string
  title: string
  value: number
  valUnit: string
  min: number
  max: number
  step: number
  styleType?: string
  activeColor?: string
  isDisable?: boolean
  // onChanging?: (value: number) => void
  onChange?: (value: number) => void
}

export const RowSlider = (props: RowSliderProps) => {
  const [isChanging, setIsChanging] = useState(false)
  const [onChangingLevel, setOnChangingLevel] = useState(props.value)

  function applyStyleCSS() {
    return props.styleType == 'secondary' ? styles.cardSecondColor : ''
  }

  return (
    <View 
      className={`${styles.contentFlexRow} ${props.className} ${applyStyleCSS()}`}
      style={{ height: '15vh', minHeight: '198rpx', maxHeight: '198rpx'}}
    >
      <View className={`${styles.contentFlexCol}`} style={{ width: '100%', alignItems: 'flex-start' }}>
        <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
          <Text className={`${styles.desText1}`}>{props.title}</Text>
          { 
            !isChanging && (
              <TextValue value={props.value} unit={props.valUnit} />
            )
          }
          { 
            isChanging && (
              <TextValue value={onChangingLevel} unit={props.valUnit} />
            )
          }
        </View>
        <View style={{ width: '100%'}}>
        <Slider 
          style={{ padding: '30rpx 20rpx' }}
          step={props.step}
          // activeColor={props.activeColor !== undefined ? props.activeColor : powerGreen}
          // blockColor={powerGreen}
          minTrackColor={'#003d75'}
          thumbWidth='30px'
          thumbHeight='20px'
          maxTrackHeight='6px'
          minTrackHeight='6px'
          thumbColor={'#fff'}
          maxTrackColor={'#848081'}
          min={props.min}
          max={props.max}
          value={props.value}
          disabled={props.isDisable !== undefined ? props.isDisable : false}
          onAfterChange={(e) => {
            setIsChanging(false)
            setOnChangingLevel(e)
            props.onChange !== undefined ? props.onChange(e) : {} 
          }}
          onChange={throttle((e) => {
            setIsChanging(true)
            // console.log('onChange', e)
            // setIsChanging(false)
            setOnChangingLevel(e)
            // props.onChange !== undefined ? props.onChange(e) : {} 
          }, 100)
        }
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
