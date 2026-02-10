import React, { useEffect, useState } from 'react';
import { Text, View, event, usePageEvent } from '@ray-js/ray';
import { Slider } from '@ray-js/smart-ui';
import Strings from '@/i18n';

import styles from './index.module.less';
import { powerGreen, vStackSpace } from '@/constant';
import { TextValue } from '@/components/text-value';

type RowRangeSliderProps = {
  className?: string
  title: string
  value: number[]
  valUnit: string
  min: number
  max: number
  step: number
  showDecimalPlace?: boolean
  styleType?: string
  onChanging?: (value: number[]) => void
  onChange?: (value: number[]) => void
}

export const RowRangeSlider = (props: RowRangeSliderProps) => {
  const [isChanging, setIsChanging] = useState(false)
  const [onChangingStart, setOnChangingStart] = useState(props.value)
  const [onChangingEnd, setOnChangingEnd] = useState(props.value)

  const [showDecPlace, setShowDecPlace] = useState(false)

  function applyStyleCSS() {
    return props.styleType == 'secondary' ? styles.cardSecondColor : ''
  }

  useEffect( () => {
    if (props.showDecimalPlace !== undefined) {
      setShowDecPlace(true)
    }
  })

  return (
    <View 
      className={`${styles.contentFlexRow} ${props.className} ${applyStyleCSS()}`}
      style={{ height: '13vh', minHeight: '176rpx', gap: '0rpx' }}
    >
      <View className={`${styles.contentFlexCol} `} style={{ width: '100%' }}>
        <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-between', width: '100%', /*marginBottom: '16rpx'*/ }}>
          <Text className={`${styles.desText1}`}>{props.title}</Text>
          <View className={`${styles.contentFlexRow}`}>
            { 
              !isChanging && (<>
                <TextValue value={props.value[0]} decimalPlace={ showDecPlace ? 1 : 0 } unit={''} />
                <Text className={styles.header2}>-</Text>
                <TextValue value={props.value[1]} decimalPlace={ showDecPlace ? 1 : 0 } unit={props.valUnit} />
              </>)
            }
            { 
              isChanging && (<>
                <TextValue value={onChangingStart[0]} decimalPlace={ showDecPlace ? 1 : 0 } unit={''} />
                <Text className={styles.header2}>-</Text>
                <TextValue value={onChangingStart[1]} decimalPlace={ showDecPlace ? 1 : 0 } unit={props.valUnit} />
              </>)
            }
          </View>
        </View>

        <Slider.RangeSlider
          style={{ padding: '30rpx 20rpx' }}
          min={props.min}
          max={props.max}
          step={props.step}
          barHeight={2}
          // blockSize={8}
          // thumbWidth={20}
          // thumbHeight={20}
          // thumbColor={powerGreen}
          value={props.value}
          inActiveColor="#93aab5"
          activeColor={powerGreen}
          onDrag={(e) => {
            setIsChanging(true)
            setOnChangingStart(e.detail.value)
            props.onChanging !== undefined ? props.onChanging(e.detail.value) : {}
          }}
          onChange={(e) => {
            setIsChanging(false)
            setOnChangingStart(e.detail)
            props.onChange !== undefined ? props.onChange(e.detail) : {} 
          }}
        />

        <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-between', width: '100%' }}>
          <Text className={styles.desText3}>{props.min}</Text>
          <Text className={styles.desText3}>{props.max}</Text>
        </View>
      </View>
    </View>
  );
};
