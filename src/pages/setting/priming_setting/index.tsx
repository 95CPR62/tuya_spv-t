import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, hideLoading, hideMenuButton, onDpDataChange, publishDps, router, showLoading, showToast, usePageEvent } from '@ray-js/ray';
import { TopBar, RowSwitch, RowSlider, SaveButton, RowRangeSlider } from '@/components';
import styles from './index.module.less';
import { useActions, useDevice, useProps, utils } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { dpId, powerGreen, secondaryColor } from '@/constant';
import { Slider, DialogInstance, Dialog } from '@ray-js/smart-ui';
import { Priming } from '@/data-model';
import { myUtils } from '@/utils';

// type ElectrolysisDetailsProps = {
//   type: string
//   dpId: number
//   subtitle: string
// }

export function Priming_Setting(props) {
  const actions = useActions();
  const dpState = useProps((dpState) => dpState)
  const [isListen, setListen] = useState(false);
  const [isSave, setSave] = useState(false); // 判断是否点击保存按钮
  const [isReq, setReq] = useState(false); // 判断是否请求成功

  const setting = new Priming(dpState.priming !== undefined ? dpState.priming : '')
  const [newSetting, setNewSetting] = useState(setting)
  const [oldSetting, setOldSetting] = useState(JSON.parse(JSON.stringify(setting)))

  const [switchFunc, setSwitchFunc] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [time, setTime] = useState(10)

  const startListenDpDataChange = () => {
    if (isListen) {
      return console.log('already started listening')
    }
    setListen(true)
    console.log('Init listening')
    return onDpDataChange((res) => {
      console.log('onDpDataChange')
      // hideLoading()

      const time = new Date().toLocaleTimeString()
      // console.log('[', time, ']')
      console.log(res);

      for (const cDpId of Object.keys(res.dps)) {
        if (cDpId === `${dpId.priming}`) { // isSave &&
          const pSetting = new Priming(`${res.dps[`${dpId.priming}`]}`)
          initFromDpState(pSetting)
          setReq(true)
          // router.back()
        }
      }
    });
  }

  const writeDP = async () => {
    console.log('onClicked');
    setSave(true);
    try {
      // showLoading({title: 'Sending...'}) 
      showLoading({title: `${Strings.getLang('Save')}...`})

      await actions.priming.set(newSetting.toWriteData())
      setOldSetting(JSON.parse(JSON.stringify(newSetting)))
      return 
      // return showToast({ title: Strings.getLang('primingSaveSuccess'), icon: 'success' })
    } catch (error) {
      console.log(error)
      hideLoading()
      setSave(false)
      return showToast({ title: Strings.getLang('primingSaveFail'), icon: 'error' })
    }
  }

  const [loadingTimeout, setLoadingTimeout] = useState(null);
  useEffect(() => {
    if(isSave){
      setLoadingTimeout(setTimeout(() => {
        // if(isSave && isReq){
          hideLoading()
          const oldData = myUtils.SHA1(JSON.stringify(oldSetting));
          const newData = myUtils.SHA1(JSON.stringify(setting));
          if(oldData == newData){
            showToast({ title: Strings.getLang('primingSaveSuccess'), icon: 'success' })
          }else{
            showToast({ title: Strings.getLang('primingSaveFail'), icon: 'error' })
          }
          setSave(false)
          setReq(false)
        // }
      }, 10000))
    }
  }, [isSave]);

  useEffect(() => {
    if(isReq && isSave){
      hideLoading()
      clearTimeout(loadingTimeout);
      showToast({ title: Strings.getLang('primingSaveSuccess'), icon: 'success' })
      setSave(false)
      setReq(false)
    }
  }, [isReq]);

  function save() {
    newSetting.enabled = switchFunc
    newSetting.speed = speed
    newSetting.time = time

    // newSetting.toWriteData()
    // setSave(true)
    writeDP()
  }

  function initFromDpState(setting: Priming) {
    console.log('setting', setting)
    setSwitchFunc(setting.enabled)
    setSpeed(setting.speed)
    setTime(setting.time)

    setOldSetting(JSON.parse(JSON.stringify(setting)))
  }

  usePageEvent('onShow', () => {
    hideMenuButton()

    startListenDpDataChange()

    // init from dpState
    initFromDpState(new Priming(dpState.priming !== undefined ? dpState.priming : ''))
  })

  useEffect(() => {
    const oldData = myUtils.SHA1(JSON.stringify(oldSetting));
    const newData = myUtils.SHA1(JSON.stringify(setting));
    if(oldData != newData){
      setOldSetting(JSON.parse(JSON.stringify(setting)))
    }
  }, [setting])
  // useEffect(() => {
  //   console.log('-------0'
  //     ,time, switchFunc)
  //   if(time === 0){
  //     // setting.enabled = false
  //     // newSetting.enabled = false
  //     setSwitchFunc(false)
  //   }
  //   if(time > 0){
  //     // setting.enabled = true
  //     //  newSetting.enabled = true
  //      setSwitchFunc(true)
  //   }
  // }, [time])

  const back = () => {
    newSetting.enabled = switchFunc
    newSetting.speed = speed
    newSetting.time = time
    // console.log(oldSetting, newSetting)
    // console.log(myUtils.SHA1(JSON.stringify(oldPumpControl.programs)))
    // console.log(myUtils.SHA1(JSON.stringify(newPumpControl.programs)))
    const oldData = myUtils.SHA1(JSON.stringify(oldSetting));
    const newData = myUtils.SHA1(JSON.stringify(newSetting));
    if(oldData != newData){
      DialogInstance.confirm({
        selector: '#smart-dialog',
        // title: '提示',
        cancelButtonText: Strings.getLang('Cancel'),
        confirmButtonText: Strings.getLang('Confirm'),
        icon: true,
        message: Strings.getLang('DialogMessage'),
      }).then(async () => {
        // 确认
        try {
          // showLoading({title: 'Sending...'}) 

          await actions.priming.set(newSetting.toWriteData())
          setTimeout(() => {
            router.back()
          }, 1000)
          return showToast({ title: Strings.getLang('primingSaveSuccess'), icon: 'success' })
        } catch (error) {
          console.log(error)
          hideLoading()
          // setSave(false)
          return showToast({ title: Strings.getLang('primingSaveFail'), icon: 'error' })
        }
      }).catch(() => {
        // 取消
        router.back()
      });
    }else {
      router.back()
    }
  }

  return (
    <View className={styles.safeArea}>
      <TopBar title={Strings.getLang('topBarPrimingSetting')} showBackBtn={true} custom={true} onClick={back}/>
      <ScrollView
        className={`${styles.scrollContainer}`}
        scrollY
        refresherTriggered={false}
      >
        <Dialog id="smart-dialog" />
        <View className={`${styles.contentContainer}`} style={{ marginTop: 0 }} >
          <RowSwitch
            className={`${styles.card}`}
            title={Strings.getLang('function')}
            state={switchFunc}
            // state={setting.enabled}
            tintColor={powerGreen}
            stateTextType={1}
            styleType='secondary'
            onChange={(value) => {
              console.log('Priming Input Value:', value); 
              setSwitchFunc(value)
            }}
          />

          <View className={`${styles.card} ${styles.list} ${styles.vStackSpace}`}>
            <RowSlider
              className={`${styles.listDivider}`}
              title={Strings.getLang('timeMin')}
              value={time}
              valUnit={Strings.getLang('mins')}
              min={0}
              max={15}
              step={1}
              isDisable={!switchFunc}
              onChanging={(value) => { }}
              onChange={(value) => { 
                setTime(value)
              }}
            />

            <RowSlider
              className={`${styles.listDivider}`}
              title={Strings.getLang('speed')}
              value={speed}
              valUnit={Strings.getLang('speedUnit')}
              min={2900}
              max={3400}
              step={10}
              // activeColor={secondaryColor}
              isDisable={!switchFunc}
              onChanging={(value) => { }}
              onChange={(value) => {
                setSpeed(value)
              }}
            />

            {/* <RowRangeSlider
              className={`${styles.listDivider}`}
              title={Strings.getLang('speed')}
              value={speed}
              valUnit={Strings.getLang('speedUnit')}
              min={800}
              max={3400}
              step={10}
              // onChanging={(value) => { }}
              onChange={(value) => { 
                setSpeed(value)
              }}
            />

            <RowRangeSlider
              className={`${styles.listDivider}`}
              title={Strings.getLang('timeMin')}
              value={time}
              valUnit={Strings.getLang('mins')}
              min={1}
              max={60}
              step={1}
              // onChanging={(value) => { }}
              onChange={(value) => { 
                setTime(value)
              }}
            /> */}
          </View>
        </View>
      </ScrollView>
      
      <SaveButton onClick={() => save()} />
    </View>
  );
}

export default Priming_Setting;