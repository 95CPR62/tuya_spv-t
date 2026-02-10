import React, { useState } from 'react';
import { Picker, showToast, Switch, Text, usePageEvent, View } from '@ray-js/ray';
import Strings from '@/i18n';

import styles from './index.module.less';
import { powerGreen, secondaryColor, vStackSpace } from '@/constant';
import { TextValue } from '@/components/text-value';

type RowScheduleProps = {
  className?: string
  id: number
  name: string
  speedValue: number
  enable: boolean
  tintColor?: string
  start: string
  end: string
  editable?: boolean
  styleType?: string
  onEnabled?: (value: boolean, index: number) => void
  onChange?: (newStart: string, newEnd: string, index: number) => void
}

export const RowScheduleDisplay = (props: RowScheduleProps) => {

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

  return (
    <View 
      className={`${styles.contentFlexRow} ${props.className} ${applyStyleCSS()}`}
      style={{ height: '7vh', minHeight: '92rpx' }}
    >
      <View className={`${styles.contentFlexCol}`} style={{ width: '100%', alignItems: 'flex-start' }}>
        <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-between', width: '100%' }}>
          <Text className={styles.desText2}>{props.name}</Text>
          
          <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-between', width: '26vw' }}>
            <Picker
                mode="time"
                start={'00:00'}
                end={'23:59'}
                value={startPicker}
                confirmText={Strings.getLang('Confirm')}
                cancelText={Strings.getLang('Cancel')}
                disabled={true}
                // disabled={(props.editable !== undefined) ? !props.editable : false}
                // onChange={ (e) => validate(e.value, endPicker) }
              >
                <Text className={`${styles.desText2}`} style={{ flex: 1, textAlign: 'center' }}>{startPicker}</Text>
            </Picker>
            <Text className={styles.desText1}>-</Text>
            <Picker
                mode="time"
                start={'00:00'}
                end={'23:59'}
                value={endPicker}
                confirmText={Strings.getLang('Confirm')}
                cancelText={Strings.getLang('Cancel')}
                disabled={true}
                // disabled={(props.editable !== undefined) ? !props.editable : false}
                // onChange={ (e) => validate(startPicker, e.value) }
              >
                <Text className={`${styles.desText2}`} style={{ flex: 1, textAlign: 'center' }}>{endPicker}</Text>
            </Picker>
          </View>

          <TextValue className={`${styles.speedContainer}`} valueClassName={styles.desText2} value={props.speedValue} unitClassName={styles.desText3} unit={Strings.getLang('speedUnit')} />

          {/* <Switch 
            checked={props.enable}
            color={(props.tintColor !== undefined) ? props.tintColor : secondaryColor}
            disabled={(props.editable !== undefined) ? !props.editable : false}
            onChange={ (e) => props.onEnabled !== undefined ? props.onEnabled(e.value, props.id) : {} }
          /> */}
        </View>
      </View>
    </View>
  );
};
