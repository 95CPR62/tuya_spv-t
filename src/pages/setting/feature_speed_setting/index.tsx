import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, hideLoading, hideMenuButton, onDpDataChange, publishDps, router, showLoading, showToast, usePageEvent } from '@ray-js/ray';
import { TopBar, RowSwitch, RowSlider, SaveButton, RowRangeSlider, RowSchedule } from '@/components';
import styles from './index.module.less';
import { useActions, useDevice, useProps, utils } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { dpId, powerGreen, secondaryColor } from '@/constant';
import { Slider, DialogInstance, Dialog } from '@ray-js/smart-ui';
import { FeatureSpeed } from '@/data-model';
import { myUtils } from '@/utils';

// type ElectrolysisDetailsProps = {
//   type: string
//   dpId: number
//   subtitle: string
// }

export function Feature_Speed_Setting(props) {
  const devInfo = useDevice(device => device.devInfo)
  const actions = useActions();
  const dpState = useProps((dpState) => dpState)
  const [isListen, setListen] = useState(false);
  const [isSave, setSave] = useState(false); // 判断是否点击保存按钮
  const [isReq, setReq] = useState(false); // 判断是否请求成功

  const setting = new FeatureSpeed(dpState.feature_speed !== undefined ? dpState.feature_speed : '')
  const [newSetting, setNewSetting] = useState(setting)
  const [oldSetting, setOldSetting] = useState(JSON.parse(JSON.stringify(setting)))

  const [switchFunc, setSwitchFunc] = useState(false)

  const [start, setStart] = useState('08:00')
  const [end, setEnd] = useState('14:00')
  function handleScheduleChanged(newStart: string, newEnd: string) {
    setStart(newStart)
    setEnd(newEnd)
  }
  
  const [minSpeed, setMinSpeed] = useState(900)
  const [maxSpeed, setMaxSpeed] = useState(1200)
  function validateSpeedRange(min: number, max: number): Boolean {
    if (max < min || min == max) {
      showToast({ title: Strings.getLang('errSpdNotValidRange'), icon: 'error' })
      return false
    }
    return true
  }
  
  const [step, setStep] = useState(125)
  const [rhythm, setRhythm] = useState(50)

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
        if (cDpId === `${dpId.feature_speed}`) { // isSave &&
          const fsSetting = new FeatureSpeed(`${res.dps[`${dpId.feature_speed}`]}`)
          initFromDpState(fsSetting)
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

      await actions.feature_speed.set(newSetting.toWriteData())
      setOldSetting(JSON.parse(JSON.stringify(newSetting)))
      return 
      // return showToast({ title: Strings.getLang('featureSpeedSaveSuccess'), icon: 'success' })
    } catch (error) {
      console.log(error)
      hideLoading()
      setSave(false)
      return showToast({ title: Strings.getLang('featureSpeedSaveFail'), icon: 'error' })
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
            showToast({ title: Strings.getLang('featureSpeedSaveSuccess'), icon: 'success' })
          }else{
            showToast({ title: Strings.getLang('featureSpeedSaveFail'), icon: 'error' })
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
      showToast({ title: Strings.getLang('featureSpeedSaveSuccess'), icon: 'success' })
      setSave(false)
      setReq(false)
    }
  }, [isReq]);

  function save() {
    if (!validateSpeedRange(minSpeed, maxSpeed)) {
      return
    }
    // newSetting.enabled = setting.enabled
    newSetting.enabled = switchFunc
    newSetting.start = start
    newSetting.end = end
    newSetting.minSpeed = minSpeed
    newSetting.maxSpeed = maxSpeed
    newSetting.step = step
    newSetting.rhythm = myUtils.writeRhythm(rhythm)

    // console.log('Feature Speed Setting Save Start:', newSetting.start);
    // console.log('Feature Speed Setting Save end:', newSetting.end);
    
    // newSetting.toWriteData()
    // // setSave(true)
    writeDP()
  }

  function initFromDpState(eSetting: FeatureSpeed) {
    // setNewSetting(eSetting)
    // setSwitchFunc(setting.enabled)
    setSwitchFunc(eSetting.enabled)
    setStart(eSetting.start)
    setEnd(eSetting.end)
    setMinSpeed(eSetting.minSpeed)
    setMaxSpeed(eSetting.maxSpeed)
    setStep(eSetting.step)
    setRhythm(myUtils.getRhythm(eSetting.rhythm))

    // console.log('Feature speed setting initFromDpState enable', setting.enabled);
    // console.log('Feature speed setting initFromDpState start', eSetting.start);
    // console.log('Feature speed setting initFromDpState end', eSetting.end);
  }

  usePageEvent('onShow', () => {
    hideMenuButton()

    startListenDpDataChange()

    // init from dpState
    initFromDpState(new FeatureSpeed(dpState.feature_speed !== undefined ? dpState.feature_speed : ''))
     // console.log('Feature speed', dpState.feature_speed);

  })

  useEffect(() => {
    // console.log('change setting --11111', setting)
        
      const oldData = myUtils.SHA1(JSON.stringify(oldSetting));
      const newData = myUtils.SHA1(JSON.stringify(setting));
      if(oldData != newData){
        // console.log('change setting --11111')
        setOldSetting(JSON.parse(JSON.stringify(setting)))
      }
      // setOldSetting(JSON.parse(JSON.stringify(newSetting)))
  }, [setting])

  const back = () => {
    newSetting.enabled = switchFunc
    newSetting.start = start
    newSetting.end = end
    newSetting.minSpeed = minSpeed
    newSetting.maxSpeed = maxSpeed
    newSetting.step = step
    newSetting.rhythm = myUtils.writeRhythm(rhythm)
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
        if (!validateSpeedRange(minSpeed, maxSpeed)) {
          return
        }
        try {
          // showLoading({title: 'Sending...'}) 

          await actions.feature_speed.set(newSetting.toWriteData())
          setTimeout(() => {
            router.back()
          }, 1000)
          return showToast({ title: Strings.getLang('featureSpeedSaveSuccess'), icon: 'success' })
        } catch (error) {
          console.log(error)
          hideLoading()
          // setSave(false)
          return showToast({ title: Strings.getLang('featureSpeedSaveFail'), icon: 'error' })
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
      <TopBar title={Strings.getLang('topBarFeatureSpeedSetting')} showBackBtn={true} smallFont={true} custom={true} onClick={back}/>
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
              console.log('Feature Speed Input Value:', value); 
              
              setSwitchFunc(value)
              console.log('Feature Speed setting.enable:', setting.enabled);
              console.log('Feature Speed switchFunc:', switchFunc); 

            }}
          />
        
          <RowSchedule
            className={`${styles.card} ${styles.vStackSpace}`}
            id={0}
            start={setting.start}
            end={setting.end}
            editable={switchFunc}
            // onEnabled={(value, index) => {}}
            onChange={(newStart, newEnd, index) => {
              handleScheduleChanged(newStart, newEnd);
            }} 
          />

          <View className={`${styles.card} ${styles.list} ${styles.vStackSpace}`}>
            <RowSlider
              className={`${styles.listDivider}`}
              title={Strings.getLang('maxSpeed')}
              value={maxSpeed}
              valUnit={Strings.getLang('speedUnit')}
              min={800}
              max={3400}
              step={10}
              // activeColor={secondaryColor}
              isDisable={!switchFunc}
              onChanging={(value) => { }}
              onChange={(value) => {
                validateSpeedRange(minSpeed, value)
                setMaxSpeed(value)
              }}
            />

            <RowSlider
              className={`${styles.listDivider}`}
              title={Strings.getLang('minSpeed')}
              value={minSpeed}
              valUnit={Strings.getLang('speedUnit')}
              min={800}
              max={3400}
              step={10}
              // activeColor={secondaryColor}
              isDisable={!switchFunc}
              onChanging={(value) => { }}
              onChange={(value) => {
                validateSpeedRange(value, maxSpeed)
                setMinSpeed(value)
              }}
            />

            <RowSlider
              className={`${styles.listDivider}`}
              title={Strings.getLang('steps')}
              value={step}
              valUnit={Strings.getLang('speedUnit')}
              min={10}
              max={500}
              step={1}
              isDisable={!switchFunc}
              onChanging={(value) => { }}
              onChange={(value) => { 
                setStep(value)
              }}
            />

            <RowSlider
              className={`${styles.listDivider}`}
              title={Strings.getLang('rhythm')}
              value={rhythm}
              valUnit={Strings.getLang('unitSec')}
              min={0.5}
              max={9.9}
              step={0.1}
              isDisable={!switchFunc}
              onChanging={(value) => { }}
              onChange={(value) => { 
                setRhythm(value)
              }}
            />
          </View>
        </View>
      </ScrollView>
      
      <SaveButton onClick={() => save()} />
    </View>
  );
}

export default Feature_Speed_Setting;