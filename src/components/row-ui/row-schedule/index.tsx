import React, { useState, useEffect } from 'react';
import { Picker, showToast, Switch, Text, Image, usePageEvent, View } from '@ray-js/ray';
import Strings from '@/i18n';

import styles from './index.module.less';
import { powerGreen, secondaryColor, vStackSpace } from '@/constant';

type RowScheduleProps = {
  className?: string
  type?: number
  id: number
  // enable: boolean
  tintColor?: string
  start: string
  end: string
  editable?: boolean
  styleType?: string
  onEnabled?: (value: boolean, index: number) => void
  onChange?: (newStart: string, newEnd: string, index: number) => void
}

export const RowSchedule = (props: RowScheduleProps) => {

  function applyStyleCSS() {
    return props.styleType == 'secondary' ? styles.cardSecondColor : ''
  }

  const [startPicker, setStartPicker] = useState(props.start)
  const [endPicker, setEndPicker] = useState(props.end)

  function validate(startValue, endValue) {
    var start = parseInt(startValue.replace(":", ""))
    var end = parseInt(endValue.replace(":", ""))

    if (start >= end) {
      return showToast({ title: Strings.getLang('errScheduleNotValidRange'), icon: 'error' })
    }
    setStartPicker(startValue)
    setEndPicker(endValue)
    if (props.onChange !== undefined) {
      props.onChange(startValue, endValue, props.id)
    }
  }

  usePageEvent('onShow', () => {
    setStartPicker(props.start)
    setEndPicker(props.end)
  })

  useEffect(() => {
    setStartPicker(props.start)
    setEndPicker(props.end)
  }, [props.start, props.end])

  return (
    <View className={`${styles.contentFlexRow} ${props.className} ${applyStyleCSS()}`}
      style={{ height: '11vh', minHeight: '170rpx' }}
    >
      <View className={`${styles.contentFlexCol}`} style={{ width: '100%', alignItems: 'flex-start' }}>
        {/* <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-between', width: '100%', marginBottom: '8rpx' }}>
          <Text className={styles.desText1}>{`${Strings.getLang('function')} ${props.id + 1}`}</Text>
          <Switch 
            checked={props.enable}
            color={(props.tintColor !== undefined) ? props.tintColor : secondaryColor}
            disabled={(props.editable !== undefined) ? !props.editable : false}
            onChange={ (e) => props.onEnabled !== undefined ? props.onEnabled(e.value, props.id) : {} }
          />
        </View> */}
        <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-around', width: '100%' }}>
          <Text className={styles.desText1} style={{ marginRight: '20rpx' }}>{`${Strings.getLang('startTime')}`}</Text>
          <Text className={styles.desText1} style={{ marginLeft: '20rpx' }}>{`${Strings.getLang('endTime')}`}</Text>
        </View>
        <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-evenly', width: '100%' }}>
          <Picker
            className={`${styles.pickerContainer}`}
            mode="time"
            start={'00:00'}
            end={'23:59'}
            value={startPicker}
            confirmText={Strings.getLang('Confirm')}
            cancelText={Strings.getLang('Cancel')}
            disabled={(props.editable !== undefined) ? !props.editable : false}
            onChange={ (e) => validate(e.value, endPicker) }
          >
            <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-evenly', width: '100%' }}>
              <Image 
                style={{ width: '44rpx', height: '44rpx'}}
                mode="aspectFit"
                src={require('public/images/ic/ic_time.svg')}
              />
              <Text className={`${styles.header2}`} style={{ textAlign: 'center' }}>{startPicker}</Text>
            </View>
          </Picker>
          <Text className={styles.header2}>-</Text>
          <Picker
            className={`${styles.pickerContainer}`}
            mode="time"
            start={'00:00'}
            end={'23:59'}
            value={endPicker}
            confirmText={Strings.getLang('Confirm')}
            cancelText={Strings.getLang('Cancel')}
            disabled={(props.editable !== undefined) ? !props.editable : false}
            onChange={ (e) => validate(startPicker, e.value) }
          >
            <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-evenly', width: '100%' }}>
              <Image 
                style={{ width: '44rpx', height: '40rpx'}}
                mode="aspectFit"
                src={require('public/images/ic/ic_time.svg')}
              />
              <Text className={`${styles.header2}`} style={{ textAlign: 'center' }}>{endPicker}</Text>
            </View>
          </Picker>
        </View>
      </View>
    </View>
  );
};
