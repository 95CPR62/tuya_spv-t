import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, hideLoading, hideMenuButton, onDpDataChange, publishDps, router, showLoading, showToast, usePageEvent } from '@ray-js/ray';
import { TopBar, RowSwitch, RowSlider, SaveButton, RowRangeSlider, RowDropdownList } from '@/components';
import styles from './index.module.less';
import { useActions, useDevice, useProps, utils } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { dpId, powerGreen, runDurations, secondaryColor } from '@/constant';
import { Slider, DialogInstance, Dialog  } from '@ray-js/smart-ui';
import { Frozen } from '@/data-model';
import { myUtils } from '@/utils';

// type ElectrolysisDetailsProps = {
//   type: string
//   dpId: number
//   subtitle: string
// }

export function Freeze_Protection(props) {
  const actions = useActions();
  const dpState = useProps((dpState) => dpState)
  const [isListen, setListen] = useState(false);
  const [isSave, setSave] = useState(false); // 判断是否点击保存按钮
  const [isReq, setReq] = useState(false); // 判断是否请求成功

  const setting = new Frozen(dpState.frozen !== undefined ? dpState.frozen : '')
  const [newSetting, setNewSetting] = useState(setting)
  const [oldSetting, setOldSetting] = useState(JSON.parse(JSON.stringify(setting)))
  console.log('>>>>>>', props, dpState, setting)
  const [switchFunc, setSwitchFunc] = useState(false)
  const [runDuration, setRunDuration] = useState(1)
  const [speed, setSpeed] = useState(1000)
  const [temperature, setTemperature] = useState(8)
  const [temperatureUnit, setTemperatureUnit] = useState(false)
  const temperatureUnits: string[] = [
    Strings.getLang('unitCelsius'),
    Strings.getLang('unitFahrenheit'),
  ]

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
        if (cDpId === `${dpId.frozen}`) { // isSave &&
          const fSetting = new Frozen(`${res.dps[`${dpId.frozen}`]}`)
          initFromDpState(fSetting)
          setReq(true)
          // router.back()
        }
      }
    });
  }

  const writeDP = async () => {
    console.log('onClicked', newSetting.toWriteData());
    setSave(true);
    try {
      // showLoading({title: 'Sending...'}) 
      showLoading({title: `${Strings.getLang('Save')}...`}) 

      await actions.frozen.set(newSetting.toWriteData())
      setOldSetting(JSON.parse(JSON.stringify(newSetting)))
      return 
      // return showToast({ title: Strings.getLang('frozenSaveSuccess'), icon: 'success' })
    } catch (error) {
      console.log(error)
      hideLoading()
      setSave(false)
      return showToast({ title: Strings.getLang('frozenSaveFail'), icon: 'error' })
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
              showToast({ title: Strings.getLang('frozenSaveSuccess'), icon: 'success' })
            }else{
              showToast({ title: Strings.getLang('frozenSaveFail'), icon: 'error' })
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
        showToast({ title: Strings.getLang('frozenSaveSuccess'), icon: 'success' })
        setSave(false)
        setReq(false)
      }
  }, [isReq]);

  function save() {
    newSetting.enabled = switchFunc
    newSetting.runDuration = runDuration + 1
    newSetting.speed = speed
    newSetting.temperature = temperature
    // newSetting.temperatureUnit = temperatureUnit

    // newSetting.toWriteData()
    // setSave(true)
    writeDP()
  }

  function initFromDpState(setting: Frozen) {
    // setNewSetting(setting)

    setSwitchFunc(setting.enabled)
    setRunDuration(setting.getRunDurationForList())
    setSpeed(setting.speed)
    setTemperature(setting.temperature)
    // setTemperatureUnit(setting.temperatureUnit)
  }

  usePageEvent('onShow', () => {
    hideMenuButton()

    startListenDpDataChange()

    // init from dpState
    initFromDpState(new Frozen(dpState.frozen !== undefined ? dpState.frozen : ''))
  })

  useEffect(() => {
      const oldData = myUtils.SHA1(JSON.stringify(oldSetting));
      const newData = myUtils.SHA1(JSON.stringify(setting));
      if(oldData != newData){
        setOldSetting(JSON.parse(JSON.stringify(setting)))
      }
    }, [setting])

  // useEffect(() => {
  //   if(temperatureUnit){
  //     setTemperature((temperature*9)/5+32)
  //   }else {
  //     setTemperature(Math.round((temperature-32) * (5/9)))
  //   }
  // }, [temperatureUnit])

  const back = () => {
    newSetting.enabled = switchFunc
    newSetting.runDuration = runDuration + 1
    newSetting.speed = speed
    newSetting.temperature = temperature
    // newSetting.temperatureUnit = temperatureUnit

    // console.log(oldSetting, newSetting)
    // console.log(myUtils.SHA1(JSON.stringify(oldSetting)))
    // console.log(myUtils.SHA1(JSON.stringify(newSetting)))
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
          await actions.frozen.set(newSetting.toWriteData())
          setTimeout(() => {
            router.back()
          }, 1000)
          return showToast({ title: Strings.getLang('frozenSaveSuccess'), icon: 'success' })
        } catch (error) {
          console.log(error)
          hideLoading()
          // setSave(false)
          return showToast({ title: Strings.getLang('frozenSaveFail'), icon: 'error' })
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
      <TopBar title={Strings.getLang('topBarFreezeProtection')} showBackBtn={true} custom={true} onClick={back}/>
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
            // state={switchFunc}
            state={setting.enabled}
            tintColor={powerGreen}
            stateTextType={1}
            styleType='secondary'
            onChange={(value) => {
              setSwitchFunc(value)
            }}
          />

          <View className={`${styles.card} ${styles.list} ${styles.vStackSpace}`}>
            <RowDropdownList
              className={`${styles.listDivider}`}
              title={`${Strings.getLang('runDuration')}`}
              value={runDuration}
              // value={item.getProgramForList()}
              modes={runDurations}
              editable={switchFunc}
              onChange={(value) => {
                setRunDuration(value)
              }}
            />
            {/* <RowDropdownList
              className={`${styles.listDivider}`}
              title={`${Strings.getLang('temperatureUnit')}`}
              value={temperatureUnit ? 1 : 0}
              // value={item.getProgramForList()}
              modes={temperatureUnits}
              editable={switchFunc}
              onChange={(index) => {
                setTemperatureUnit(index === 1)
              }}
            /> */}

            <RowSlider
              className={`${styles.listDivider}`}
              title={Strings.getLang('speed')}
              value={speed}
              valUnit={Strings.getLang('speedUnit')}
              min={800}
              max={3400}
              step={10}
              // activeColor={secondaryColor}
              isDisable={!switchFunc}
              onChanging={(value) => { }}
              onChange={(value) => { 
                setSpeed(value)
              }}
            />

            <RowSlider
              className={`${styles.listDivider}`}
              title={Strings.getLang('ttemperature')}
              value={temperature}
              valUnit={temperatureUnit ? '°F' : '°C'}
              min={0}
              max={10}
              step={ 1}
              // min={temperatureUnit ? 32 : 0}
              // max={temperatureUnit ? 50 : 10}
              // step={ temperatureUnit ? 1.8 : 1}
              isDisable={!switchFunc}
              onChanging={(value) => { }}
              onChange={(value) => { 
                setTemperature(value)
              }}
            />
          </View>
        </View>
      </ScrollView>
      
      <SaveButton onClick={() => save()} />
    </View>
  );
}

export default Freeze_Protection;