import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, hideLoading, hideMenuButton, onDpDataChange, publishDps, router, showLoading, showToast, usePageEvent, Button } from '@ray-js/ray';
import { TopBar, RowSwitch, RowSlider, SaveButton, RowRangeSlider, RowSchedule, RowDropdownList, RowSpeedSetting } from '@/components';
import styles from './index.module.less';
import { useActions, useDevice, useProps, utils } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { dpId, powerGreen, secondaryColor, speedPrograms } from '@/constant';
import { Slider, DialogInstance, Dialog } from '@ray-js/smart-ui';
import { dateFormat, parseHour12, stringToSecond } from '@ray-js/panel-sdk/lib/utils';
import { PumpControl } from '@/data-model';
import { myUtils } from '@/utils';

// type ElectrolysisDetailsProps = {
//   type: string
//   dpId: number
//   subtitle: string
// }

export function Speed_Setting(props) {
  const devInfo = useDevice(device => device.devInfo)
  const actions = useActions();
  const dpState = useProps((dpState) => dpState)
  const [isListen, setListen] = useState(false);
  const [isSave, setSave] = useState(false); // 判断是否点击保存按钮
  const [isReq, setReq] = useState(false); // 判断是否请求成功

  const pumpControl = new PumpControl(dpState.pump_control !== undefined ? dpState.pump_control : '')
  const [newPumpControl, setNewPumpControl] = useState(pumpControl)
  const [oldPumpControl, setOldPumpControl] = useState(JSON.parse(JSON.stringify(pumpControl)))

  const [currentTime, setCurrentTime] = useState(dateFormat('hh:mm', new Date()))


  function handleProgramChanged(value: number, index: number) {
    newPumpControl.programs[index].speed = value
    // console.log(pumpControl.programs[index])
  }

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
        if (cDpId === `${dpId.pump_control}`) { // isSave &&
          const pcSetting = new PumpControl(`${res.dps[`${dpId.pump_control}`]}`)
          initFromDpState(pcSetting)
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

      await actions.pump_control.set(newPumpControl.toWriteData())
      setOldPumpControl(JSON.parse(JSON.stringify(newPumpControl)))
      return 
      // return showToast({ title: Strings.getLang('pumpControlSaveSuccess'), icon: 'success' })
    } catch (error) {
      console.log(error)
      hideLoading()
      setSave(false)
      return showToast({ title: Strings.getLang('pumpControlSaveFail'), icon: 'error' })
    }
  }

  const [loadingTimeout, setLoadingTimeout] = useState(null);
  useEffect(() => {
    if(isSave){
      setLoadingTimeout(setTimeout(() => {
        // if(isSave && isReq){
          hideLoading()
          const oldData = myUtils.SHA1(JSON.stringify(oldPumpControl));
          const newData = myUtils.SHA1(JSON.stringify(pumpControl));
          if(oldData == newData){
            showToast({ title: Strings.getLang('pumpControlSaveSuccess'), icon: 'success' })
          }else{
            showToast({ title: Strings.getLang('pumpControlSaveFail'), icon: 'error' })
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
      showToast({ title: Strings.getLang('pumpControlSaveSuccess'), icon: 'success' })
      setSave(false)
      setReq(false)
    }
  }, [isReq]);

  function save() {
    // newPumpControl.toWriteData()
    // // setSave(true)
    writeDP()
  }

  function initFromDpState(pcSetting: PumpControl) {
    setNewPumpControl(pcSetting)
    setOldPumpControl(JSON.parse(JSON.stringify(pcSetting)))
  }

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     const newTime = dateFormat('hh:mm', new Date())
  //     // setCurrentTime(newTime)
  //     // setTime24Picker(newTime.slice(0, -3))
  //     // setTime12Picker(parseHour12(stringToSecond(newTime)))
  //     setCurrentTime(newTime)
  //   }, 1000)

  //   return () => {
  //     clearInterval(intervalId)
  //   }
  // }, [])

  usePageEvent('onShow', () => {
    hideMenuButton()

    startListenDpDataChange()

    // init from dpState
    initFromDpState(new PumpControl(dpState.pump_control !== undefined ? dpState.pump_control : ''))
  })

 useEffect(() => {
          const oldData = myUtils.SHA1(JSON.stringify(oldPumpControl));
          const newData = myUtils.SHA1(JSON.stringify(pumpControl));
          if(oldData != newData){
            // console.log('change setting --11111')
            setOldPumpControl(JSON.parse(JSON.stringify(pumpControl)))
          }
          // setOldSetting(JSON.parse(JSON.stringify(newSetting)))
    }, [pumpControl])

  const back = () => {
    // console.log(oldPumpControl.programs, newPumpControl.programs)
    // console.log(myUtils.SHA1(JSON.stringify(oldPumpControl.programs)))
    // console.log(myUtils.SHA1(JSON.stringify(newPumpControl.programs)))
    const oldData = myUtils.SHA1(JSON.stringify(oldPumpControl.programs));
    const newData = myUtils.SHA1(JSON.stringify(newPumpControl.programs));
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
          await actions.pump_control.set(newPumpControl.toWriteData())
          setTimeout(() => {
            router.back()
          }, 1000)
          return showToast({ title: Strings.getLang('pumpControlSaveSuccess'), icon: 'success' })
        } catch (error) {
          console.log(error)
          hideLoading()
          return showToast({ title: Strings.getLang('pumpControlSaveFail'), icon: 'error' })
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
      <TopBar title={Strings.getLang('topBarSpeedSetting')} showBackBtn={true} custom={true} onClick={back}/>
      <ScrollView
        className={`${styles.scrollContainer}`}
        scrollY
        refresherTriggered={false}
      >
        <Dialog id="smart-dialog" />
        <View className={`${styles.contentContainer}`} style={{ marginTop: 0 }} >
          <View className={`${styles.contentFlexCol}`}>
            
          
            <View className={`${styles.card} ${styles.list}`} style={{ background: '#a1ccdf !important'}}>
              {
                newPumpControl.programs.map((item, index) => {
                  return <RowSpeedSetting
                    className={`${styles.listDivider}`}
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    value={item.speed}
                    valUnit={Strings.getLang('speedUnit')}
                    min={800}
                    max={3400}
                    step={10}
                    // activeColor={secondaryColor}
                    onChanging={(value) => { }}
                    onChange={(value) => {
                      handleProgramChanged(value, index)
                    }}
                  />
                })
              }
            </View>
          </View>
        </View>
      </ScrollView>
      
      <SaveButton onClick={() => save()} />
    </View>
  );
}

export default Speed_Setting;