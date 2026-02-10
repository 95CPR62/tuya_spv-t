import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, hideLoading, hideMenuButton, onDpDataChange, publishDps, router, showLoading, showToast, usePageEvent } from '@ray-js/ray';
import { TopBar, RowSwitch, RowSlider, SaveButton, RowRangeSlider } from '@/components';
import styles from './index.module.less';
import { useActions, useDevice, useProps, utils } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { dpId, powerGreen, secondaryColor } from '@/constant';
import { Slider, DialogInstance, Dialog } from '@ray-js/smart-ui';
import { NoFlow } from '@/data-model';
import { myUtils } from '@/utils';

// type ElectrolysisDetailsProps = {
//   type: string
//   dpId: number
//   subtitle: string
// }

export function No_Flow_Setting(props) {
  const devInfo = useDevice(device => device.devInfo)
  const actions = useActions();
  const dpState = useProps((dpState) => dpState)
  const [isListen, setListen] = useState(false);
  const [isSave, setSave] = useState(false); // 判断是否点击保存按钮
  const [isReq, setReq] = useState(false); // 判断是否请求成功

  const setting = new NoFlow(dpState.no_flow !== undefined ? dpState.no_flow : '')
  const [newSetting, setNewSetting] = useState(setting)
  const [oldSetting, setOldSetting] = useState(JSON.parse(JSON.stringify(setting)))

  const [switchFunc, setSwitchFunc] = useState(false)
  const [sensitivity, setSensitivity] = useState(75)
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
        if (cDpId === `${dpId.no_flow}`) { // isSave &&
          const nfSetting = new NoFlow(`${res.dps[`${dpId.no_flow}`]}`)
          initFromDpState(nfSetting)
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

      await actions.no_flow.set(newSetting.toWriteData())
      setOldSetting(JSON.parse(JSON.stringify(newSetting)))
      return 
      // return showToast({ title: Strings.getLang('noFlowSaveSuccess'), icon: 'success' })
    } catch (error) {
      console.log(error)
      hideLoading()
      setSave(false)
      return showToast({ title: Strings.getLang('noFlowSaveFail'), icon: 'error' })
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
            showToast({ title: Strings.getLang('noFlowSaveSuccess'), icon: 'success' })
          }else{
            showToast({ title: Strings.getLang('noFlowSaveFail'), icon: 'error' })
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
      showToast({ title: Strings.getLang('noFlowSaveSuccess'), icon: 'success' })
      setSave(false)
      setReq(false)
    }
  }, [isReq]);

  function save() {
    newSetting.enabled = switchFunc
    newSetting.alarmTime = time
    newSetting.sensitivity = sensitivity

    // newSetting.toWriteData()
    // setSave(true)
    writeDP()
  }

  function initFromDpState(setting: NoFlow) {
    // setNewSetting(setting)

    setSwitchFunc(setting.enabled)
    setTime(setting.alarmTime)
    setSensitivity(setting.sensitivity)
  }

  usePageEvent('onShow', () => {
    hideMenuButton()

    startListenDpDataChange()

    // init from dpState
    initFromDpState(new NoFlow(dpState.no_flow !== undefined ? dpState.no_flow : ''))
  })

  useEffect(() => {
    
      const oldData = myUtils.SHA1(JSON.stringify(oldSetting));
      const newData = myUtils.SHA1(JSON.stringify(setting));
      if(oldData != newData){
        setOldSetting(JSON.parse(JSON.stringify(setting)))
      }
    }, [setting])

  const back = () => {
    newSetting.enabled = switchFunc
    newSetting.alarmTime = time
    newSetting.sensitivity = sensitivity
  
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

            await actions.no_flow.set(newSetting.toWriteData())
             setTimeout(() => {
              router.back()
            }, 1000)
            return showToast({ title: Strings.getLang('noFlowSaveSuccess'), icon: 'success' })
          } catch (error) {
            console.log(error)
            hideLoading()
            // setSave(false)
            return showToast({ title: Strings.getLang('noFlowSaveFail'), icon: 'error' })
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
      <TopBar title={Strings.getLang('topBarNoFlowSetting')} showBackBtn={true} custom={true} onClick={back}/>
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
            <RowSlider
              className={`${styles.listDivider}`}
              title={Strings.getLang('alarmMin')}
              value={time}
              valUnit={Strings.getLang('mins')}
              min={1}
              max={90}
              step={1}
              isDisable={!switchFunc}
              onChanging={(value) => { }}
              onChange={(value) => { 
                setTime(value)
              }}
            />

            <RowSlider
              className={`${styles.listDivider}`}
              title={Strings.getLang('sensitivity')}
              value={sensitivity}
              valUnit={'%'}
              min={1}
              max={100}
              step={1}
              isDisable={!switchFunc}
              onChanging={(value) => { }}
              onChange={(value) => { 
                setSensitivity(value)
              }}
            />
          </View>
        </View>
      </ScrollView>
      
      <SaveButton onClick={() => save()} />
    </View>
  );
}

export default No_Flow_Setting;