
import React, { useEffect, useState } from 'react';
import { Loading } from '@ray-js/smart-ui';
import { RowDropdownList, RowScheduleDisplay, SpeedInput, SpeedPicker, TopBar, SpeedWave } from '@/components';
// import { IconFont } from '@/components/icon-font';
import styles from './index.module.less';
// import Svg from '@ray-js/svg';
import { useInterval } from 'ahooks'
import Strings from '@/i18n';
import { LampCirclePicker } from '@ray-js/components-ty-lamp';

import {
  router, Button, Image, Icon, Text, View, Input, PickerView, showMenuButton,
  PickerViewColumn, getDpsInfos, hideMenuButton, navigateTo, onDpDataChange, publishDps,
  queryDps, showToast, showLoading, hideLoading, getAppInfo, usePageEvent, map,
  onDeviceOnlineStatusUpdate, authorizeStatus, Slider, ScrollView,
  stopPullDownRefresh
} from '@ray-js/ray';

import { useActions, useDevice, useProps } from '@ray-js/panel-sdk';
import { dpId, GDefine, secondaryColor, speedPrograms, vStackSpace } from '@/constant';
import { Display } from 'react-7-segment-display';
import { myUtils } from '@/utils';
import { PumpControl, ScheduleSetting, PumpStatus, FeatureSpeed } from '@/data-model';
import { values } from 'lodash-es';
import { RotatingFaultDisplay } from '@/components/rotating-fault-display';

// import { Display } from "react-7-segment-display";

export function Home() {
  const actions = useActions();

  const devInfo = useDevice(device => device.devInfo);
  const dpState = useProps((dpState) => dpState);
  const [devIsOnline, setDevIsOnline] = useState(true)

  const featureSpeed =  new FeatureSpeed(dpState.feature_speed !== undefined ? dpState.feature_speed : '')
    // console.log('featureSpeed', featureSpeed)
  const sSetting = new ScheduleSetting(dpState.schedule_setting !== undefined ? dpState.schedule_setting : '')
  const pumpControl = new PumpControl(dpState.pump_control !== undefined ? dpState.pump_control : '')

  const pumpStatus = new PumpStatus(dpState.device_supported_function !== undefined ? dpState.device_supported_function : '')

  const [selectedSpeedProgram, setSelectedButton] = useState(null); // State for selected button

  const [powerState, setPowerState] = useState(false); // Default state is OFF

  const percent = React.useRef(0)
  const [stroke, setStroke] = React.useState(0)
  const [isListen, setListen] = useState(false);
  const [writeDpData, setWriteDpData] = useState('AA11BB22');


  // ---------------------------------------------------------
  //                  Circular Slider view
  // ---------------------------------------------------------

  // Non-used, not available to get screen size
  // function getRadius(): number {
  //   const radius = GDefine.screenW * 0.37
  //   // console.log(parseInt(radius.toFixed(0)))
  //   return parseInt(radius.toFixed(0))
  // }
  // function getInnerRadius(): number {
  //   const radius = getRadius() * 0.87
  //   // console.log(parseInt(radius.toFixed(0)))
  //   return parseInt(radius.toFixed(0))
  // }

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [delayedLoading, setDelayedLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(true);

  const [isSlideOnChange, setIsSlideOnChange] = useState(false);
  // const [speedValue, setSpeedValue] = useState(dpState.current_speed);
  const [speedValue, setSpeedValue] = useState(0);
  const [lastSpeedValue, setLastSpeedValue] = useState(dpState.set_speed);

  // Terence
  const [newSpeedValue, setNewSpeedValue] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0); // Separate state for current speed
  const [currentPowerConsumption, setPowerConsumption] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSlider, setIsSlider] = useState(false);

  const handleStart = (v: number) => {
    setIsSlider(true)
    if (!dpState.running_status) return;
    const mappedValue = Math.round((Math.round((v*2.6) / 10) * 10)  + 800);
    setSpeedValue(mappedValue);
    // const mappedValue = Math.round(v * 2.6 + 800);
    // console.log('handleMove', v);
    // setSpeedValue(mappedValue);
  }
  const handleMove = (v: number) => {
    // setIsSlider(true)
    if (!dpState.running_status) return;
    // const mappedValue = Math.round(v * 2.6 + 800);
    // console.log('handleMove', v);
    // setSpeedValue(mappedValue);
    // 移动的间距为10
    if(isSlider) {
            const mappedValue = Math.round((Math.round((v*2.6) / 10) * 10)  + 800);
    
          //  console.log('handleMove--end', v, Math.round((v*2.6) / 10) * 10);
            setSpeedValue(mappedValue);
        // }
          }
  };
  const handleEnd = (v: number) => {
    setTimeout(() => {
      setIsSlider(false)
       const mappedValue = Math.round((Math.round((v*2.6) / 10) * 10)  + 800);

      //  console.log('handleMove--end', v, Math.round((v*2.6) / 10) * 10);
      setSpeedValue(mappedValue);
    },500)
    // if (dpState.running_status === false) return;
    // const mappedValue = v;
    // // console.log('handleEnd', mappedValue);
    // // console.log('outputValue=', currentSpeed);
    // setSpeedValue(mappedValue);

    // // Calculate the transformed speed and update currentSpeed
    // const transformedSpeed = transformSpeedValue(v);
    // console.log('--end--', transformedSpeed)
    // setCurrentSpeed(transformedSpeed); // Set current speed for later use

    // writeDP(113, transformedSpeed);   // Cannot make function call for getting 113 DPID otherwise it fail to complete the call
  };

  // function handleSpdInputChanged(value: string) {
  //   const newSpeed = parseInt(value)
  //   if (newSpeed < 800 || newSpeed > 3400) {
  //     setSpeedValue(lastSpeedValue)
  //     return showToast({ title: Strings.getLang('errSpdInputNotValidRange'), icon: 'error' })
  //   }
  //   setSpeedValue(newSpeed)
  //   setLastSpeedValue(newSpeed)
  // }


  const speedRange = Array.from(Array(3400 - 800 + 1).keys()).map(num => `${num + 800}`)
  function handleSpdInputChanged(value: string) {
    var newSpeed = parseInt(value) || 800
    console.log(convertDisplayToValue(newSpeed))
    console.log('Input - ', newSpeed)
    console.log('origin - ', newSpeedValue)
    if (newSpeed < 800 && newSpeed !== 0 || newSpeed > 3400 && newSpeed !== 0) {

      if (newSpeed < 800 && newSpeed !== 0) {
        newSpeed = 800;
      } else if (newSpeed > 3400 && newSpeed !== 0) {
        newSpeed = 3400;
      }
      // return showToast({ title: Strings.getLang('errPoolSizeNotValidRange'), icon: 'error' })
      // setSpeedValue(newSpeedValue) // original
      // return showToast({ title: 'errSpdInputNotValidRange', icon: 'error' })
    }
    setSpeedValue(convertDisplayToValue(newSpeed))
  }

  function convertValueToDisplay(value: number) { // for picker
    const display = Math.floor((value / 1000) * (3400 - 800)) + 800
    return speedRange.indexOf(`${display}`)
  }
  function convertDisplayToValue(value: number) {
    const newValue = Math.floor((value - 800) / 2600 * 1000)
    return newValue < 1 ? 1 : newValue
  }




  const mapWattageToScale = (wattage) => {
    const minWatt = 800;
    const maxWatt = 3400;
    const minScale = 1;
    const maxScale = 1000;

    // Bound the wattage within the range
    const boundedWattage = Math.max(minWatt, Math.min(wattage, maxWatt));

    // Linear mapping
    return Math.round(((boundedWattage - minWatt) / (maxWatt - minWatt)) * (maxScale - minScale) + minScale);
  };


  // Separate function to call writeDP
  const updateDevice = (speed) => {
    console.log('Updating device with speed:', speed);
    // writeDP(dpId.current_speed, speed);
    writeDP(113, speed);
  };



  onDeviceOnlineStatusUpdate((res) => {
    // console.log('devInfo.online - onDeviceOnlineStatusUpdate open area', res);
    if (res.deviceId == devInfo.devId) {
      setDevIsOnline(res.online)
    }
  })


  const startContinuousTimeout = () => {
    const runTimeout = () => {
      // console.log("Timeout executed. Performing an action...");
      // setDevIsOnline(devInfo.isOnline)
      try {
        // Perform your desired action here (e.g., fetch data, log, etc.)
        onDeviceOnlineStatusUpdate((res) => {
          // console.log('onDeviceOnlineStatusUpdate within usePageEvent', res);
          if (res.deviceId == devInfo.devId) {
            setDevIsOnline(res.online)
            // console.log('devInfo.online usePageEvent-onDeviceOnlineStatusUpdate  =', devInfo.isOnline);
          }
        })
      } catch (error) {
        console.error('Error in runTimeout:', error);
      }
      // Perform your desired action here (e.g., fetch data, log, etc.)
      // Set the timeout again for continuous execution
      setTimeout(runTimeout, 5000);
    };
    // Start the first timeout
    setTimeout(runTimeout, 5000);
  };


  // Effect to trigger writeDP when currentSpeed changes
  // useEffect(() => {
  //   startContinuousTimeout();
  //   // console.log('console log useEffect - powerValue=',powerState);
  //   // console.log('console log useEffect - currentSpeed changed:', currentSpeed);
  //   if (dpState.running_status) {
  //     updateDevice(currentSpeed);
  //   }
  // }, [currentSpeed, powerState]);
// const updateValue;
const [isUp, setIsUp] = useState(true);
  useEffect(() => {
    // console.log('222', speedValue)
    // startContinuousTimeout();
    // console.log('console log useEffect - powerValue=',powerState);
    // console.log('console log useEffect - currentSpeed changed:', currentSpeed);
    if (dpState.running_status && !isInputFocused && dpState.feature_speed_status) {
      
      //  console.log('666666', speedValue, currentSpeed, dpState.current_speed, isUp)
      setTimeout(() => {
        var a, b;
        // var v = (3400 - 800) / featureSpeed.step;
        var v = 1000 * (featureSpeed.step / (3400 - 800) );
          // if(speedValue < featureSpeed.maxSpeed || speedValue === 0 ){
          if(isUp){
            a = JSON.parse(JSON.stringify(speedValue + featureSpeed.step));
            b = ((speedValue - 800) / 2.6) + v;
            if(a > featureSpeed.maxSpeed || a == featureSpeed.maxSpeed){
              // console.log('进入')
              setIsUp(false)
            }
          }else {
            a = JSON.parse(JSON.stringify(speedValue - featureSpeed.step));
            b = ((speedValue - 800) / 2.6) -  v;
            if(a < featureSpeed.minSpeed || a == featureSpeed.minSpeed){
              setIsUp(true)
            }
          }
          setSpeedValue(speedValue < 800 ? 800 + a  : a);
          setCurrentSpeed(b < 0 ? 0 : b > 1000 ? 1000 : b);
        
      }, featureSpeed.rhythm * 100)
      
    }
    if (dpState.running_status && !isSlider && !isInputFocused && !dpState.feature_speed_status) {
      setSpeedValue(dpState.set_speed);
      setCurrentSpeed((dpState.set_speed - 800) / 2.6);
      
    }
    if(dpState.running_status && isSlider) {
      updateDevice(speedValue);
    }
    if (!dpState.running_status) {
        setSpeedValue(0);
        setCurrentSpeed(0);
    }
  }, [speedValue, dpState.set_speed, powerState, dpState.running_status,isInputFocused, dpState.feature_speed_status]);

  // useEffect(() => {
  //   // console.log('9999', dpState.feature_speed_status, featureSpeed)
  //   getSpeed()
  // }, [powerState, dpState.running_status]);

  // useEffect(() => {

  //  getSpeed()
  // }, [isInputFocused, dpState.feature_speed_status]);

  // function getSpeed() {
    
  // }
  
  // writeDP(dpId.current_speed, currentSpeed);
  //   const mapValue = (inputValue) => {
  //     const minInput = 0;
  //     const maxInput = 1000;
  //     const minOutput = 800;
  //     const maxOutput = 3400;

  //     return minOutput + ((inputValue - minInput) * (maxOutput - minOutput)) / (maxInput - minInput);
  // };


  // Transform the newSpeedValue into the desired range and apply resolution
  const transformSpeedValue = (value) => {
    // Map value from [0, 1000] to [800, 3400]
    const mappedValue = 800 + ((value / 1000) * (3400 - 800));
    // Round to nearest 10
    return Math.round(mappedValue / 10) * 10;
  };

  // const currentSpeed = transformSpeedValue(newSpeedValue);



  // ---------------------------------------------------------


  const { getLocation } = map;
  const [countryName, setCountryName] = useState('Unknown')

  const checkLocationPermission = () => {
    authorizeStatus({
      scope: 'scope.userLocation',
      success: () => {
        getLocation({
          type: 'wgs84',
          altitude: false,
          isHighAccuracy: true,
          highAccuracyExpireTime: 3000,
          success: ((location) => {
            if (location.countryName !== undefined) {
              return setCountryName(location.countryName)
            } else if (location.cityName !== undefined) {
              return setCountryName(location.cityName)
            } else if (location.province !== undefined) {
              return setCountryName(location.province)
            } else if (location.district !== undefined) {
              return setCountryName(location.district)
            }
            showToast({ title: JSON.stringify(location), icon: 'error' })
            return setCountryName('Unknown')
          }),
          fail: ((error) => {
            console.log('Unknown Location')
            console.log(error)
            // showToast({ title: JSON.stringify(error), icon: 'error' })
            showToast({ title: Strings.getLang('errLocationPermission'), icon: 'error' })
            return setCountryName('Unknown')
          })
        })
      },
      fail: () => {
        showToast({ title: Strings.getLang('errLocationPermission'), icon: 'error' })
        return setCountryName('Unknown')
      }
    })
  }


  // 'id' must be unique, and the value is the application data value



  const currentSpeedGp = [
    { id: 1, color: '#ffdead', imagePath: '', currentSpeedValue: 0 },
  ]

  const currentSpeedTextGp = [
    { id: 2, color: '#ffdead', imagePath: '', currentSpeedValue: 0 },
  ]

  const powerGp = [
    { id: 3, color: '#ffdead', imagePath: 'public/images/ic/ic_power.png', padding: '28rpx', label: 'Pow', powerValue: powerState },
  ]

  const selectSpeedProgramGp1 = [
    { id: 4, color: '#ffdead', imagePath: '', padding: '16rpx', label: 'Speed  1', selectSpeedProgramValue: 1 },  // Program 1
    { id: 5, color: '#ffdead', imagePath: '', padding: '16rpx', label: 'Speed 2', selectSpeedProgramValue: 2 },  // Program 2
    { id: 6, color: '#ffdead', imagePath: '', padding: '16rpx', label: 'Speed 3', selectSpeedProgramValue: 3 },  // Program 3
  ]
  // const selectSpeedProgramGp2 = [

  //   {id: 7, color: '#ffdead', imagePath: '', padding: '16rpx', label: 'Speed 4', selectSpeedProgramValue:4},  // Program 4
  // ]

  const schedules = [
    { id: 1, program: 'PROG 1', start: '08:00', end: '14:00', enable: true },
    { id: 2, program: 'Speed 2', start: '08:00', end: '14:00', enable: false }
  ]

  // const changeSelectedSpeed = (newSpeed) => {
  //   setSelectedSpeed(newSpeed);
  // }

  const handlePowerToggle = () => {
    setIsLoading(true);
    setPowerState(!dpState.running_status); // Update the state
    writeDP(dpId.running_status, !dpState.running_status);
  };

  // const scope = 330
  // useInterval(() => {
  //   if (percent.current >= 0 && percent.current < 100) {
  //     percent.current = percent.current + 1
  //     setStroke(percent.current / 100 * scope)
  //   } else {
  //     percent.current = 0
  //     setStroke(0)
  //   }
  // }, 1000)

  function handleWriteDpDataInput(e: any) {
    setWriteDpData(e.value);
  }

  function settingOnClick() {
    if (dpState.running_status) {
      return showToast({ title: Strings.getLang('preventGoToSetting'), icon: 'error' })
    }
    return router.push('/setting')
  }

  function handleSetSpdOnClick(newSpeedValue) {
    if (!dpState.running_status) {
      return showToast({ title: Strings.getLang('preventSetSpeed'), icon: 'error' })
    }
    // setSpeedValue(newSpeedValue);
    console.log('handleSetSpdOnClick - speedValue', newSpeedValue);
    return writeSetSpeed(newSpeedValue)
  }

  const writeSetSpeed = async (setSpeed) => {
    startListenDpDataChange();

    console.log('onClicked');

    try {
      // showLoading({title: 'Sending...'}) 

      await actions.set_speed.set(setSpeed)
      setIsSlideOnChange(false)

      return showToast({ title: Strings.getLang('setSpeedSuccess'), icon: 'success' })

    } catch (error) {
      console.log(error)
      hideLoading()
      return showToast({ title: Strings.getLang('setSpeedfailed'), icon: 'error' })
    }
  }

  const writeDP = async (dpId, value) => {
    startListenDpDataChange();

    console.log('onClicked');

    try {
      // showLoading({title: 'Sending...'}) 

      // await actions.main_page.set(stateSummary.preparePacket())
      // await actions.main_page.set(stateSummary.randomValue())
      // await publishDps({ '109': '112233AABBCC' })
      // await publishDps({ [range[dpPickerValue]]: writeDpData })

      // return showToast({ title: "publishDps success", icon: 'success' })

      await publishDps({ [dpId]: value })
      return
    } catch (error) {
      console.log(error)
      hideLoading()
      return showToast({ title: 'publishDps failed', icon: 'error' })
    }
  }

  const fetchDP = async () => {
    try {
      await publishDps({
        101: '01',  // pump_control
        104: '50',  // feature_speed
        108: '80',  // no_flow
        109: '90',  // priming
        110: 'A0',  // frozen
        127: '20',  // schedule_setting
      })
      // return showToast({ title: "publishDps success", icon: 'success' })
      return
    } catch (error) {
      console.log(error)
      hideLoading()
      return showToast({ title: Strings.getLang('fetchDpfailed'), icon: 'error' })
    }
  }

  function startListenDpDataChange() {
    if (isListen) {
      return console.log('already started listening');
    }
    setListen(true);
    console.log('Init listening');
    return onDpDataChange((res) => {
      hideLoading()
      console.log('onDpDataChange');
      if(res.dps['113'] || res.dps['112']){
        setIsLoading(false);
      }
      const time = new Date().toLocaleTimeString();
      // console.log('[', time, ']', res.dps);
      // console.log(res.dps);
    });
  }


  function selectedCSS(type, keyId) {
    if (type === 'selectedSpeedProgram') {
      let value = dpState.selected_program;
      if (value === keyId) {
        return styles.highlighted;
      }
      return '';
    }
    return '';
  }

  function powerStateCSS() {
    return dpState.running_status ? styles.on : styles.off
  }

  // 监听 dpState 变化，结束 isLoading 状态
  useEffect(() => {
    setIsLoading(false);
  }, [dpState.selected_program, dpState.running_status]);

  const [loadingTime, setLoadingTime] = useState(null);
  
  // 监听 isLoading 变化，设置或清除定时器
   useEffect(() => {
    if(isLoading){
      setLoadingTime(setTimeout(() => {
          setIsLoading(false);
          showToast({ title: Strings.getLang('fetchDpfailed'), icon: 'error' })
        }, 30000)
      )
    // console.log('---***0', loadingTime)
    }else{
      clearTimeout(loadingTime)
      // console.log('---***1', loadingTime)
    }
  }, [isLoading]);

  usePageEvent('onShow', () => {
    console.log('>>>>> onShow');
    showMenuButton()
    checkLocationPermission()
    setDevIsOnline(devInfo.isOnline)
    console.log('devInfo.online - usePageEvent=', devInfo.isOnline);

    onDeviceOnlineStatusUpdate((res) => {
      console.log('onDeviceOnlineStatusUpdate within usePageEvent', res);
      if (res.deviceId == devInfo.devId) {
        setDevIsOnline(res.online)
        console.log('devInfo.online usePageEvent-onDeviceOnlineStatusUpdate  =', devInfo.isOnline);
      }
    })
    handleRefresh()
  })

  const handleRefresh = async () => {
    // console.log('------------1')
    // console.log('---handleRefresh--- Starting handleRefresh...');
    setLoading(true);
    setDelayedLoading(true);

    // Add timeout to force disable loading after 3 seconds
    const timeoutId = setTimeout(() => {
      // console.log('------------2')
      // console.log('---handleRefresh--- Timeout reached, forcing loading disable');
      setLoading(false);
      hideLoading();
      stopPullDownRefresh();
    }, 3000);

    try {
      await fetchDP();
      // console.log('------------3')
      // console.log('---handleRefresh--- fetchDP completed in handleRefresh');
    } catch (error) {
      // console.log('------------4')
      // console.error('---handleRefresh--- Error in handleRefresh:', error);
      showToast({ title: 'Failed to fetch data', icon: 'error' });
    } finally {
      // console.log('------------5')
      // console.log('---handleRefresh--- Disabling loading states...');
      clearTimeout(timeoutId); // Clear the timeout if fetch completes before 3 seconds
      setLoading(false);
      hideLoading();
      stopPullDownRefresh();

      // Add 2-second delay before hiding the message
      setTimeout(() => {
        setDelayedLoading(false);
      }, 2000);
    }
  };



  function applyStyleCSS() {
    return styles.cardSecondColor
  }

  const [startY, setStartY] = useState(0); // 下拉的初始位置

  // 内容滚动触发
  const scroll = (e) => {
    // console.log('scroll', e)
    // 判断是否已滚动到最顶部，是则可以触发下拉刷新
    if(e.detail.scrollTop == 0){
      if(!isRefresh) setIsRefresh(true)
    }else {
      if(isRefresh) setIsRefresh(false)
    }
  }
  // 触摸开始
  const touchStart  = (e) => {
    // console.log('touchStart', e.changedTouches[0].pageY, isRefresh)
    if(isRefresh){
      setStartY(e.changedTouches[0].pageY)
    }
  }
  // 触摸移动
  const touchMove = (e) => {
    // console.log('touchStart', startY, e.changedTouches[0].pageY)
    if(isRefresh){
      let endY = e.changedTouches[0].pageY
      let startY2 = startY
      let dis = endY - startY2

      // console.log('touchMove',dis)
      // 判断下拉值超60启动下拉刷新加载
      if (dis >= 60) {
        setLoading(true);     
      }
    }
  }
  // 触摸结束
  const touchEnd = (e) => {
    // 判断是启动下拉刷新加载，是触发handleRefresh
    if (loading && isRefresh) {
      handleRefresh()
    }
  }

  // Option 1
  // 涂鸦风格滑动条
  // https://www.npmjs.com/package/@ray-js/components-ty-slider/v/0.2.37

  // Option 2
  // React Native component for creating circular slider.
  // https://www.npmjs.com/package/react-native-circular-slider

  // option 3 (from official tuya site )
  // https://developer.tuya.com/material/library_oHEKLjj0/component?code=ComponentsTyLamp&subCode=LampCirclePicker

  // Get mcu inforation to determine which layout should be display


  {/* Sony XQ-CC72: 2400 pixels
iPhone SE: 1136 pixels
iPhone 13 Pro: 2532 pixels */}

  const [currentLayout, setCurrentLayout] = useState('LampCirclePicker'); // 'A', 'B', or 'C'
  return (
    <View className={styles.safeArea}>
      {isLoading && (
        <View className={styles.emaux_loadBox}>
          <Loading color="#ffffff"   size="35px" textSize="16px" customClass={styles.emaux_loading} vertical>
            loading
          </Loading>
        </View>
      )}
      <TopBar title={devInfo.name} />
      <View className={`${styles.contentContainer}`} style={{
        marginTop: 0, marginBottom: 0, height: ' 100%',
        boxSizing: 'border-box', overflow: 'hidden'
      }}>
        <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-between', }}>
          <View className={styles.contentFlexCol} style={{ width: '100%', alignItems: 'flex-start' }}>
            <View className={`${styles.contentFlexRow}`}>
              <Image
                style={{ width: '34rpx', height: '28rpx', marginRight: '1.5vw' }}
                mode="aspectFit"
                src={devInfo.isOnline
                  ? require('public/images/ic/ic_wifi_signal_3.svg')
                  : require('public/images/ic/ic_wifi_signal_3_off.svg')}
              />

              {
                devInfo.isOnline ? (
                  <Text className={styles.desText2} >{Strings.getLang('CONNECTED')}</Text>
                ) : (
                  <Text className={styles.desText2} >{Strings.getLang('DISCONNECTED')}</Text>
                )
              }


            </View>
            <View className={`${styles.contentFlexRow}`} style={{ width: '100%', justifyContent: 'space-between' }}>
              {/* {
                countryName == "Unknown" && (
                  <Text className={styles.desText2}>25°C</Text>
                )
              }
              {
                countryName !== "Unknown" && (
                  <Text className={styles.desText2}>{`${countryName} | 25°C`}</Text>
                )
              } */}
              {
                countryName !== "Unknown" && (
                  <Text className={styles.desText2}>{`${countryName}`}</Text>
                )
              }
            </View>
          </View>

          <Button style={{ width: '80rpx', height: '80rpx' }} onClick={() => { settingOnClick() }}>
            <Image
              style={{ width: '100%', height: '100%' }}
              mode="aspectFit"
              src={require('public/images/ic/ic_setting_circled.svg')}
            />
          </Button>
        </View>

        {
          currentLayout === 'LampCirclePicker' && (
            // <View className={styles.container}>
              <ScrollView
                // className={`${styles.scrollContainer}`}
                // style={{ marginTop: 0, paddingBottom: '0', marginBottom: 0 }}
                className={styles.container}
                scrollY
                onScroll={scroll}
                onTouchStart={touchStart}
                onTouchEnd={touchEnd}
                onTouchMove={touchMove}
                refresherEnabled={true}
                refresherTriggered={loading}
                refresherDefaultStyle="none"
                refresherBackground="transparent"
                // onRefresherRefresh={(e) => {
                //   // console.log('------------6', e.detail.isTrusted)
                //    if(e.detail.isTrusted != undefined && e.detail.isTrusted){
                //     // console.log('------------9')
                //     // setLoading(true);
                //     handleRefresh();
                //   }
                //   // console.log('---handleRefresh--- onRefresherRefresh - starting refresh');
                  
                // }}
                // onRefresherPulling={(e) => {
                //   // console.log('------------7', e)
                 
                  
                //   // console.log('---handleRefresh--- onRefresherPulling - user is pulling');
                //   // setLoading(true);
                // }}
                // onRefresherRestore={() => {
                //   // console.log('------------8')
                //   // console.log('---handleRefresh--- onRefresherRestore - refresh cancelled');
                //   setLoading(false);
                //   stopPullDownRefresh();
                // }}
              >
                {delayedLoading && (
                  <View style={{
                    position: 'fixed',
                    top: '120rpx',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: '20rpx 40rpx',
                    borderRadius: '20rpx',
                    boxShadow: '0 4rpx 8rpx rgba(0, 0, 0, 0.2)'
                  }}>
                    <Text style={{
                      color: '#FFFFFF',
                      fontSize: '32rpx',
                      fontWeight: '500'
                    }}>
                      {Strings.getLang('refreshingData')}
                    </Text>
                  </View>
                )}
                {dpState.fault_flag && (
                  <View className={`${styles.contentFlexCol}`} style={{ width: '100%', alignItems: 'left', padding: '0', marginTop: dpState.fault_flag ? '-10rpx' : '0', marginBottom: dpState.fault_flag ? '-20rpx' : '0' }}>
                    <View style={{ marginBottom: dpState.priming_status || dpState.feature_speed_status || dpState.no_flow_status || dpState.frozen_status ? '20rpx' : '0' }}>

                      <RotatingFaultDisplay
                        fault_flag={dpState.fault_flag}
                        fault_code={dpState.fault_code}
                      />
                    </View>
                  </View>
                )}
                {dpState.priming_status && (
                  <View className={`${styles.contentFlexCol}`} style={{ width: '100%', alignItems: 'left', padding: '0' }}>
                    <View className={styles.faultDisplayContainer}>
                      <Text className={`${styles.textStatePrimingFeatureSpeed} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.priming_status ? 'transparent !important' : '' }}>
                        {(Strings.getLang('primingIsProcess'))}
                      </Text>
                    </View>
                  </View>
                )}
                {dpState.feature_speed_status && (
                  <View className={`${styles.contentFlexCol}`} style={{ width: '100%', alignItems: 'left', padding: '0' }}>
                    <View className={styles.faultDisplayContainer}>
                      <Text className={`${styles.textStatePrimingFeatureSpeed} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.feature_speed_status ? 'transparent !important' : '' }}>
                        {(Strings.getLang('featureSpeedEnabled'))}
                      </Text>
                    </View>
                  </View>
                )}
                {dpState.frozen_status && (
                  <View className={`${styles.contentFlexCol}`} style={{ width: '100%', alignItems: 'left', padding: '0' }}>
                    <View className={styles.faultDisplayContainer}>
                      <Text className={`${styles.textStatePrimingFeatureSpeed} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.frozen_status ? 'transparent !important' : '' }}>
                        {(Strings.getLang('freezeProtectionEnabled'))}
                      </Text>
                    </View>
                  </View>
                )}
                {dpState.no_flow_status && (
                  <View className={`${styles.contentFlexCol}`} style={{ width: '100%', alignItems: 'left', padding: '0' }}>
                    <View className={styles.faultDisplayContainer}>
                      <Text className={`${styles.textStateAlert} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.no_flow_status ? 'transparent !important' : '' }}>
                        {(Strings.getLang('noFlowDetected'))}
                      </Text>
                    </View>
                  </View>
                )}
                {/* <View className={`${styles.contentFlexCol}`} style={{ height: '35', width: '100%', alignItems: 'left', padding: '0', marginTop: dpState.fault_flag ? '0' : '-20rpx', marginBottom: dpState.fault_flag ? '0' : '-20rpx'}}>
              <RotatingFaultDisplay 
                fault_flag={dpState.fault_flag} 
                fault_code={dpState.fault_code}
              />
              <Text className={`${styles.textStatePrimingFeatureSpeed} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.priming_status ? 'transparent !important': '' }}>
                {(Strings.getLang('primingIsProcess'))}
              </Text>
              <Text className={`${styles.textStatePrimingFeatureSpeed} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.feature_speed_status ? 'transparent !important': '' }}>
                {(Strings.getLang('featureSpeedEnabled'))}
              </Text>
              <Text className={`${styles.textStatePrimingFeatureSpeed} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.frozen_status ? 'transparent !important': '' }}>
                {(Strings.getLang('freezeProtectionEnabled'))}
              </Text>
              <Text className={`${styles.textStateAlert} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.no_flow_status ? 'transparent !important': '' }}>
                {(Strings.getLang('noFlowDetected'))}
              </Text>
            </View> */}

                <View className={`${styles.contentFlexCol}`} style={{
                  alignItems: 'center',
                  width: '100%',
                  position: 'relative',
                  height: '650rpx',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '32rpx',
                  padding: '40rpx',
                  marginTop: '10rpx',
                  marginBottom: '20rpx'
                }}>
                  <View className={`${styles.contentFlexRow}`} style={{
                    width: '100%',
                    justifyContent: 'space-between',
                    marginBottom: '40rpx'
                  }}>
                    <Text className={`${styles.legendText}`} style={{
                      // color: '#FFFFFF',
                      // fontSize: '32rpx',
                      opacity: 0.8
                    }}>
                      {pumpStatus.getModelName()}
                    </Text>
                   { !dpState.running_status || (dpState.running_status && !dpState.feature_speed_status) ? 
                    <Text className={`${styles.legendText}`} style={{
                      opacity: 0.8
                    }}>
                      {dpState.running_status ? dpState.current_watt : 0} Watt
                    </Text>
                    : ''
                  }
                  </View>

                  <View style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
                    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                       <Text style={{ color: '#FFFFFF', fontSize: '28rpx', marginBottom: '20rpx', opacity: 0.8 }}>SPEED</Text>
                      
                        <View style={{
                          // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '40rpx',
                          padding: '16rpx 60rpx',
                          marginBottom: '20rpx'
                        }}>

                          <Button style={{ width: '66rpx', height: '100rpx', position: 'absolute', right: '60rpx', top: '50%',  paddingRight: '10px', zIndex: 10, transform: 'translateY(-50%)' }}
                             onClick={() => handleSetSpdOnClick(speedValue)}>
                            <Image
                              style={{ width: '23px', height: '23px', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                              mode="aspectFit"
                              src={require('public/images/ic/ic_play.svg')}
                            />
                          </Button>

                          {/* <Text style={{ color: '#FFFFFF', fontSize: '64rpx', fontWeight: '500' }}>{dpState.running_status ? mapWattageToScale(dpState.current_speed) : 0}</Text> */}
                          <Input
                            className={`${styles.textInputField} ${styles.headerSpeedValue}`}
                            // style={{ position: 'absolute', top : '48%', left: '30%', textAlign: 'center', width: '35vw', zIndex: 5, }}
                            style={{ textAlign: 'center', padding: '5px 35px 5px 15px', width: '35vw', zIndex: 5, }}
                            // value={speedValue}
                            // value={isInputFocused ? speedValue : dpState.running_status ? dpState.current_speed : 0}
                            value={isInputFocused ? newSpeedValue : dpState.running_status ?speedValue : 0}
                            type='number'
                            maxLength={4}
                            confirmType='send'
                            disabled={!dpState.running_status || dpState.feature_speed_status? true : false}

                            onFocus={() => {
                              setIsInputFocused(true);
                              // setSpeedValue(dpState.current_speed);
                            }} // Set focus state
                            onBlur={() => {
                              setIsInputFocused(false);   // Reset focus state

                            }}
                            onInput={(value) => {
                              if (isInputFocused) {
                                var n = Math.round(value.detail.value / 10) * 10
                                // setSpeedValue(parseInt(value));
                                setTimeout(() => {
                                  setNewSpeedValue(n);
                                  setSpeedValue(n);
                                }, 2000)
                              }
                            }}
                            onConfirm={(value) => {
                              if (isInputFocused) {
                                console.log('handleSetSpdOnClick - onConfirm', value);
                                var n = Math.round(value.detail.value / 10) * 10
                                // handleSpdInputChanged(value);
                                // setSpeedValue(parseInt(value));
                                // setSpeedValue(value.detail.value);
                                setNewSpeedValue(n);
                                setSpeedValue(n);
                                handleSetSpdOnClick(n)
                                // handleSpdInputChanged(value);
                                // setSpeedValue(parseInt(value));
                                // setSpeedValue(value.detail.value);
                              }
                            }}
                          />
                        </View>
                        <Text style={{ color: '#FFFFFF', fontSize: '28rpx', opacity: 0.8 }}>RPM</Text>
                    </View>
                  </View>
                  {/* <LampCirclePicker value={1000} innerRingRadius={80} onTouchEnd={handleEnd} /> */}
                    <LampCirclePicker
                      key={dpState.running_status ? "on" : "off"}
                      value={currentSpeed}
                      radius={140}
                      innerRingRadius={120}
                      colorList={[
                        { offset: 0, color: dpState.running_status ? '#0056b3' : '#FFFFFF' },
                        { offset: 1, color: dpState.running_status ? '#0056b3' : '#FFFFFF' }
                      ]}
                      innerBorderStyle={{
                        width: 2,
                        color: '#0056b3',
                      }}
                      descText=" "
                      descStyle={{ color: 'transparent' }}
                      titleStyle={{ opacity: 0 }}
                      touchCircleLineWidth={15}
                      touchCircleStrokeStyle={'#0056b3'}
                      useEventChannel
                      onTouchStart={handleStart}
                      onTouchMove={handleMove}
                      onTouchEnd={handleEnd}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1
                      }}
                    />
                  
                  {/* {dpState.running_status && <SpeedWave mode={'medium'} title={dpState.set_speed}/> } */}
                  <Button
                    className={`${styles.circleBtn} ${powerStateCSS()}`}
                    style={{
                      position: 'absolute',
                      bottom: '10rpx',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 2,
                      // backgroundColor: '#FFFFFF',
                      backgroundColor: dpState.running_status ? '#0056b3' : '#FFFFFF',
                      borderRadius: '50%',
                      width: '100rpx',
                      height: '100rpx',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4rpx 8rpx rgba(0, 0, 0, 0.1)'
                    }}
                    onClick={handlePowerToggle}
                  >
                    <Image
                      style={{ width: '100%', height: '100%' }}
                      mode="aspectFit"
                      src={dpState.running_status ? require('public/images/ic/ic_power_white.png') : require('public/images/ic/ic_power_blue.png')}
                    />
                  </Button>

                  <View style={{
                    position: 'absolute',
                    bottom: '40rpx',
                    left: '120rpx',
                    zIndex: 2
                  }}>
                    <Text style={{ color: '#FFFFFF', fontSize: '32rpx', opacity: 0.8 }}>800</Text>
                  </View>
                    <View style={{
                      position: 'absolute',
                      bottom: '40rpx',
                      right: '120rpx',
                      zIndex: 2
                    }}>
                      <Text style={{ color: '#FFFFFF', fontSize: '32rpx', opacity: 0.8 }}>3400</Text>
                    </View>
                  <View style={{
                    height: '570rpx', width: '100%',
                    zIndex: 1,
                    position: 'absolute',
                    opacity: 0,
                    '-webkit-user-select': 'none',
                    userSelect: 'none',
                    '-moz-user-select': 'none',
                    '-ms-user-select': 'none',
                    '-webkit-touch-callout': 'none',
                    display: dpState.running_status && !dpState.feature_speed_status? "none" : "block"
                  }}></View>
                </View>


                {/* Speed buttons */}
                <View className={`${styles.contentFlexCol} ${styles.vStackSpace}`}>
                  <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-between', width: '100%' }}>
                    {
                      selectSpeedProgramGp1.map((item) => {
                        return <Button
                          className={`${styles.roundedBtn} ${selectedCSS('selectedSpeedProgram', item.selectSpeedProgramValue)} ${styles.buttonStyle}`}
                          key={item.id}
                          onClick={() => {
                            if(dpState.selected_program !== item.selectSpeedProgramValue){
                              setIsLoading(true);
                            }
                            // onClicked
                            // changeSelectedSpeed(item.selectSpeedProgramValue)
                            setSelectedButton(item.selectSpeedProgramValue);
                            // console.log('item.selectSpeedProgramValue', item.selectSpeedProgramValue);
                            writeDP(dpId.selected_program, item.selectSpeedProgramValue);
                          }}
                        >
                          <Text className={styles.labelStyle}>
                            {item.label} {/* Optional: Change to a different label if needed */}
                          </Text>
                        </Button>
                      })
                    }
                  </View>
                </View>
                <View style={{ height: 'auto', marginBottom: '20rpx' }}>
                {/* <View style={{ height: '40vh', maxHeight: '284rpx' }}>
                <ScrollView 
                        className={`${styles.scrollContainer}`}
                        style={{ marginTop: 0 }}  
                        scrollY
                        refresherTriggered={false}
                  >*/}
                {/* Pump Schedule */}
                <View className={`${styles.contentFlexCol} ${styles.card} ${styles.list} ${styles.vStackSpace}`}>
                  <Text className={`${styles.desText1} ${styles.subtitleC}`}>{Strings.getLang('pumpSchedule')}</Text>
                  {sSetting.schedules
                    // .slice(0, 3) // Only take first 3 schedules
                    .filter(item => {
                      // console.log('Schedule item:', item);
                      // console.log('Enabled status:', item.enabled);
                      return item.enabled === true;
                    })
                    .map((item) => {
                      // console.log('Processing enabled schedule:', item);
                      const programIndex = item.getProgramForList();
                      // console.log('Program index:', programIndex);
                      const program = pumpControl.programs?.[programIndex];
                      // console.log('Program:', program);
                      const speedValue = program?.speed ?? 0;
                      // console.log('Speed value:', speedValue);

                      return (
                        <RowScheduleDisplay
                          className={`${styles.listDivider}`}
                          key={item.id}
                          id={item.id}
                          name={`${Strings.getLang('sch')} ${item.id + 1}`}
                          speedValue={speedValue}
                          enable={true}
                          start={item.start}
                          end={item.end}
                          editable={false}
                          onEnabled={() => { }}
                        />
                      );
                    })
                  }
                  </View>
                {/* </ScrollView> */}
                </View>
              </ScrollView>
            // </View>
          )
        }




        {
          currentLayout === 'A' && (<>
            {/* Speed Slider */}
            <View className={`${styles.contentFlexCol} ${styles.card}`} style={{ alignItems: 'center' }}>
              <Text className={`${styles.legendText}`} style={{ marginBottom: '1vh', }}>
                {dpState.running_status ? dpState.current_watt : 0} W
              </Text>


              <View className={`${styles.contentFlexCol}`} style={{ height: '35', width: '100%', alignItems: 'center', padding: '0 4rpx' }}>
                <Text className={`${styles.textStateAlert} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.fault_flag ? 'transparent !important' : '' }}>
                  {myUtils.getFaultCodeLabel(dpState.fault_code)}
                </Text>

                <Text className={`${styles.textStatePrimingFeatureSpeed} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.priming_status ? 'transparent !important' : '' }}>
                  {(Strings.getLang('primingIsProcess'))}
                </Text>
                <Text className={`${styles.textStatePrimingFeatureSpeed} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.feature_speed_status ? 'transparent !important' : '' }}>
                  {(Strings.getLang('featureSpeedEnabled'))}
                </Text>
                <Text className={`${styles.textStatePrimingFeatureSpeed} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.frozen_status ? 'transparent !important' : '' }}>
                  {(Strings.getLang('freezeProtectionEnabled'))}
                </Text>
                <Text className={`${styles.textStateAlert} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.no_flow_status ? 'transparent !important' : '' }}>
                  {(Strings.getLang('noFlowDetected'))}
                </Text>
              </View>

              <View style={{ display: 'flex', alignItems: 'center', justifyItems: 'end' }}>
                {
                  isSlideOnChange && (
                    <View className={`${styles.sliderSetSpeed}`}>
                      <Text className={`${styles.header2}`} style={{ fontSize: '60rpx', fontWeight: '600' }}>
                        {speedValue}
                      </Text>
                    </View>
                  )
                }
                <SpeedInput
                  className={`${styles.speedInputMargin}`}
                  value={dpState.running_status ? dpState.current_speed : 0}
                  maxLength={4}
                  editable={dpState.running_status ? true : false}
                  onInput={(value) => setSpeedValue(parseInt(value))}
                  onTapBg={(value) => handleSpdInputChanged(value)}
                  onConfirm={(value) => handleSpdInputChanged(value)}
                />
                <Button style={{ width: '46rpx', height: '46rpx', position: 'absolute', left: '60%', zIndex: 5 }}
                  onClick={() => handleSetSpdOnClick(speedValue)}>
                  <Image
                    style={{ width: '100%', height: '100%' }}
                    mode="aspectFit"
                    src={require('public/images/ic/ic_play.svg')}
                  />
                </Button>
              </View>

              <Button
                className={`${styles.circleBtn} ${powerStateCSS()}`}
                onClick={() => {
                  handlePowerToggle();
                }}
              >
                <Image
                  className={``}
                  style={{ width: '100%', height: '100%' }}
                  mode="aspectFit"
                  src={
                    dpState.running_status ? require('public/images/ic/ic_power_white.png')
                      : require('public/images/ic/ic_power_blue.png')
                  }
                />
              </Button>

              <View className={`${styles.contentFlexCol}`} style={{ width: '100%', padding: '0 4rpx' }}>
                <Slider
                  style={{ padding: '30rpx 20rpx' }}
                  step={10}
                  activeColor={secondaryColor}
                  blockSize={24}
                  min={800}
                  max={3400}
                  value={dpState.running_status ? dpState.set_speed : 0}
                  disabled={dpState.running_status ? false : true}
                  onChanging={(e) => {
                    setIsSlideOnChange(true)
                    setSpeedValue(e.value)
                  }}
                  onChange={(e) => {
                    setSpeedValue(e.value)
                    writeSetSpeed(e.value)
                  }}
                />
                <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-between', width: '100%' }}>
                  <Text className={styles.desText3}>{800}</Text>
                  <Text className={styles.desText3}>{3400}</Text>
                </View>
              </View>
            </View>

            {/* Speed buttons */}
            <View className={`${styles.contentFlexCol} ${styles.vStackSpace}`}>
              <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-between', width: '100%' }}>
                {
                  selectSpeedProgramGp1.map((item) => {
                    return <Button
                      className={`${styles.roundedBtn} ${selectedCSS('selectedSpeedProgram', item.selectSpeedProgramValue)} ${styles.buttonStyle}`}
                      key={item.id}
                      onClick={() => {
                        // onClicked
                        // changeSelectedSpeed(item.selectSpeedProgramValue)
                        setSelectedButton(item.selectSpeedProgramValue);
                        // console.log('item.selectSpeedProgramValue', item.selectSpeedProgramValue);
                        writeDP(dpId.selected_program, item.selectSpeedProgramValue);
                      }}
                    >
                      <Text className={styles.labelStyle}>
                        {item.label} {/* Optional: Change to a different label if needed */}
                      </Text>
                    </Button>
                  })
                }
              </View>

            </View>

            <View style={{ height: '40vh', maxHeight: '284rpx' }}>
              <ScrollView
                className={`${styles.scrollContainer}`}
                style={{ marginTop: 0 }}
                scrollY
                refresherTriggered={false}
              >
                {/* Pump Schedule */}
                <View className={`${styles.contentFlexCol} ${styles.card} ${styles.list} ${styles.vStackSpace}`}>
                  <Text className={`${styles.desText1} ${styles.subtitleC}`}>{Strings.getLang('pumpSchedule')}</Text>
                  {
                    sSetting.schedules.map((item) => {
                      if (!item.enabled) {
                        return
                      }
                      return <RowScheduleDisplay
                        className={`${styles.listDivider}`}
                        key={item.id}
                        id={item.id}
                        name={`${Strings.getLang('sch')} ${item.id + 1}`}
                        speedValue={pumpControl.programs[item.getProgramForList()].speed}
                        enable={item.enabled}
                        start={item.start}
                        end={item.end}
                        editable={false}
                        onEnabled={(value) => { }}
                      />
                    })
                  }
                </View>
              </ScrollView>
            </View>
          </>)
        }


        {
          currentLayout === 'B' && (<>

            {/* <View className={`${styles.contentContainer} ${styles.card}`} 
                style={{ 
                  alignItems: 'center', 
                  gap: '20rpx', 
                  marginBottom: '5px', 
                  height: '520px',
                  backgroundColor: 'lightblue',
                  
                  }} >    
                  <Text>Rendering Display Component</Text>
                  <Display height={100} value="1234" count={4} color='red' skew={true}/>
              </View> */}
            <View className={`${styles.contentFlexCol} ${styles.card}`} style={{ alignItems: 'center' }}>
              <Text className={`${styles.legendText}`} style={{ marginBottom: '1vh', }}>
                {dpState.running_status ? dpState.current_watt : 0} W
              </Text>
              <Text className={`${styles.legendText}`} >
                {pumpStatus.getModelName()}
              </Text>


              <View className={`${styles.contentFlexCol}`} style={{ height: '35', width: '100%', alignItems: 'center', padding: '0 4rpx' }}>
                <Text className={`${styles.textStateAlert} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.fault_flag ? 'transparent !important' : '' }}>
                  {myUtils.getFaultCodeLabel(dpState.fault_code)}
                </Text>

                <Text className={`${styles.textStatePrimingFeatureSpeed} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.priming_status ? 'transparent !important' : '' }}>
                  {(Strings.getLang('primingIsProcess'))}
                </Text>
                <Text className={`${styles.textStatePrimingFeatureSpeed} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.feature_speed_status ? 'transparent !important' : '' }}>
                  {(Strings.getLang('featureSpeedEnabled'))}
                </Text>
                <Text className={`${styles.textStatePrimingFeatureSpeed} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.frozen_status ? 'transparent !important' : '' }}>
                  {(Strings.getLang('freezeProtectionEnabled'))}
                </Text>
                <Text className={`${styles.textStateAlert} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.no_flow_status ? 'transparent !important' : '' }}>
                  {(Strings.getLang('noFlowDetected'))}
                </Text>
              </View>

              <View style={{ display: 'flex', alignItems: 'center', justifyItems: 'end' }}>
                {
                  isSlideOnChange && (
                    <View className={`${styles.sliderSetSpeed}`}>
                      <Text className={`${styles.header2}`} style={{ fontSize: '60rpx', fontWeight: '600' }}>
                        {speedValue}
                      </Text>
                    </View>
                  )
                }
                <SpeedInput
                  className={`${styles.speedInputMargin}`}
                  value={dpState.running_status ? dpState.current_speed : 0}
                  maxLength={4}
                  editable={dpState.running_status ? true : false}
                  onInput={(value) => setSpeedValue(parseInt(value))}
                  onTapBg={(value) => handleSpdInputChanged(value)}
                  onConfirm={(value) => handleSpdInputChanged(value)}
                />
                <Button style={{ width: '46rpx', height: '46rpx', position: 'absolute', left: '60%', zIndex: 5 }}
                  onClick={() => handleSetSpdOnClick()}>
                  <Image
                    style={{ width: '100%', height: '100%' }}
                    mode="aspectFit"
                    src={require('public/images/ic/ic_play.svg')}
                  />
                </Button>
              </View>

              <Button
                className={`${styles.circleBtn} ${powerStateCSS()}`}
                onClick={() => {
                  handlePowerToggle();
                }}
              >
                <Image
                  className={``}
                  style={{ width: '100%', height: '100%' }}
                  mode="aspectFit"
                  src={
                    dpState.running_status ? require('public/images/ic/ic_power_white.png')
                      : require('public/images/ic/ic_power_blue.png')
                  }
                />
              </Button>

              <View className={`${styles.contentFlexCol}`} style={{ width: '100%', padding: '0 4rpx' }}>
                <Slider
                  style={{ padding: '30rpx 20rpx' }}
                  step={10}
                  activeColor={secondaryColor}
                  blockSize={24}
                  min={800}
                  max={3400}
                  value={dpState.running_status ? dpState.set_speed : 0}
                  disabled={dpState.running_status ? false : true}
                  onChanging={(e) => {
                    setIsSlideOnChange(true)
                    setSpeedValue(e.value)
                  }}
                  onChange={(e) => {
                    setSpeedValue(e.value)
                    writeSetSpeed(e.value)
                  }}
                />
                <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-between', width: '100%' }}>
                  <Text className={styles.desText3}>{800}</Text>
                  <Text className={styles.desText3}>{3400}</Text>
                </View>
              </View>
            </View>

            {/* Speed buttons */}
            <View className={`${styles.contentFlexCol} ${styles.vStackSpace}`}>
              <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-between', width: '100%' }}>
                {
                  selectSpeedProgramGp1.map((item) => {
                    return <Button
                      className={`${styles.roundedBtn} ${selectedCSS('selectedSpeedProgram', item.selectSpeedProgramValue)} ${styles.buttonStyle}`}
                      key={item.id}
                      onClick={() => {
                        // onClicked
                        // changeSelectedSpeed(item.selectSpeedProgramValue)
                        setSelectedButton(item.selectSpeedProgramValue);
                        // console.log('item.selectSpeedProgramValue', item.selectSpeedProgramValue);
                        writeDP(dpId.selected_program, item.selectSpeedProgramValue);
                      }}
                    >
                      <Text className={styles.labelStyle}>
                        {item.label} {/* Optional: Change to a different label if needed */}
                      </Text>
                    </Button>
                  })
                }
              </View>

            </View>

            <View style={{ height: '40vh', maxHeight: '284rpx' }}>
              <ScrollView
                className={`${styles.scrollContainer}`}
                style={{ marginTop: 0 }}
                scrollY
                refresherTriggered={false}
              >
                {/* Pump Schedule */}
                <View className={`${styles.contentFlexCol} ${styles.card} ${styles.list} ${styles.vStackSpace}`}>
                  <Text className={`${styles.desText1} ${styles.subtitleC}`}>{Strings.getLang('pumpSchedule')}</Text>
                  {
                    sSetting.schedules.map((item) => {
                      if (!item.enabled) {
                        return
                      }
                      return <RowScheduleDisplay
                        className={`${styles.listDivider}`}
                        key={item.id}
                        id={item.id}
                        name={`${Strings.getLang('sch')} ${item.id + 1}`}
                        speedValue={pumpControl.programs[item.getProgramForList()].speed}
                        enable={item.enabled}
                        start={item.start}
                        end={item.end}
                        editable={false}
                        onEnabled={(value) => { }}
                      />
                    })
                  }
                </View>
              </ScrollView>
            </View>



          </>)
        }


        {
          currentLayout === 'C' && (<>

            {/* <View className={`${styles.contentContainer} ${styles.card}`} 
                style={{ 
                  alignItems: 'center', 
                  gap: '20rpx', 
                  marginBottom: '5px', 
                  height: '520px',
                  backgroundColor: 'lightblue',
                  
                  }} >    
                  <Text>Rendering Display Component</Text>
                  <Display height={100} value="1234" count={4} color='red' skew={true}/>
              </View> */}

            {/* Sony XQ-CC72: 2400 pixels
iPhone SE: 1136 pixels
iPhone 13 Pro: 2532 pixels */}
            <View className={styles.scrollContainer}>
              <ScrollView
                className={`${styles.scrollContainer}`}
                style={{ marginTop: 0 }}
                scrollY
                refresherTriggered={false}
              >

                <View className={`${styles.contentFlexCol} ${styles.card}`} style={{ alignItems: 'center' }}>

                  <View className={`${styles.contentFlexRow}`} style={{ height: '35px', width: '100%', padding: '0 4rpx', justifyContent: 'space-between' }}>
                    <Text className={`${styles.legendText}`} style={{ textAlign: 'left', marginLeft: '10px' }}>
                      {pumpStatus.getModelName()}
                    </Text>
                    <Text className={`${styles.legendText}`} style={{ textAlign: 'right', marginRight: '20px' }}>
                      {dpState.running_status ? dpState.current_watt : 0} W
                    </Text>
                  </View>

                  <View className={`${styles.contentFlexCol}`} style={{ height: '35', width: '100%', alignItems: 'center', padding: '0 4rpx' }}>
                    <Text className={`${styles.textStateAlert} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.fault_flag ? 'transparent !important' : '' }}>
                      {myUtils.getFaultCodeLabel(dpState.fault_code)}
                    </Text>

                    <Text className={`${styles.textStatePrimingFeatureSpeed} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.priming_status ? 'transparent !important' : '' }}>
                      {(Strings.getLang('primingIsProcess'))}
                    </Text>
                    <Text className={`${styles.textStatePrimingFeatureSpeed} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.feature_speed_status ? 'transparent !important' : '' }}>
                      {(Strings.getLang('featureSpeedEnabled'))}
                    </Text>
                    <Text className={`${styles.textStatePrimingFeatureSpeed} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.frozen_status ? 'transparent !important' : '' }}>
                      {(Strings.getLang('freezeProtectionEnabled'))}
                    </Text>
                    <Text className={`${styles.textStateAlert} ${styles.blinking}`} style={{ position: 'absolute', color: !dpState.no_flow_status ? 'transparent !important' : '' }}>
                      {(Strings.getLang('noFlowDetected'))}
                    </Text>
                  </View>

                  <View className={`${styles.contentFlexCol}`}
                    style={{
                      alignItems: 'center',
                      width: '100%',
                    }}>

                    <LampCirclePicker
                      // value = {powerState ? dpState.current_speed : 0}
                      // value={powerState ? mapWattageToScale(dpState.current_speed) : 0}

                      value={dpState.running_status ? mapWattageToScale(dpState.current_speed) : 0}

                      radius={140}
                      innerRingRadius={120}
                      // radius={getRadius()}
                      // innerRingRadius={getInnerRadius()}
                      colorList={[
                        { offset: 0, color: '#FFFFFF' },
                        { offset: 1, color: '#FFFFFF' },
                        // { offset: 1, color: '#00ff00' },
                      ]}

                      innerBorderStyle={{
                        width: 2,
                        color: 'white',
                      }}
                      descText=" "
                      descStyle={{ color: 'white' }}
                      titleStyle={{ opacity: 0 }}  // Transparent the % value because the library is not allow to be removed
                      touchCircleLineWidth={15}
                      touchCircleStrokeStyle={'#0056b3'}
                      useEventChannel
                      onTouchMove={handleMove}
                      onTouchEnd={handleEnd}
                      style={{ zIndex: 1 }}
                    />
                  </View>

                  <Text className={`${styles.desText1}`}
                    style={{ alignItems: 'center', width: '46rpx', height: '46rpx', position: 'absolute', top: '40%', left: '40%', zIndex: 5, }}
                  >{`${Strings.getLang('speed')}`}</Text>


                  <Button style={{ width: '46rpx', height: '46rpx', position: 'absolute', left: '62%', top: '55%', zIndex: 10, transform: 'translateY(-50%)' }}
                    onClick={() => handleSetSpdOnClick(speedValue)}>
                    <Image
                      style={{ width: '100%', height: '100%' }}
                      mode="aspectFit"
                      src={require('public/images/ic/ic_play.svg')}
                    />
                  </Button>

                  {/* <View className={`${styles.contentFlexRow} ${styles.singleRow} ${applyStyleCSS()}`} style={{ justifyContent: 'space-between', width: '15vw' }}> */}
                  <Input
                    className={`${styles.textInputField} ${styles.header2}`}
                    style={{ position: 'absolute', top: '48%', left: '30%', textAlign: 'center', width: '35vw', zIndex: 5, }}
                    value={dpState.running_status ? dpState.current_speed : 0}
                    type='number'
                    maxLength={4}
                    confirmType='send'
                    disabled={!dpState.running_status ? true : false}

                    onFocus={() => setIsInputFocused(true)} // Set focus state
                    onBlur={() => {
                      setIsInputFocused(false); // Reset focus state

                    }}
                    onInput={(value) => {
                      if (isInputFocused) {
                        // setSpeedValue(parseInt(value));
                        setSpeedValue(value.detail.value);
                      }
                    }}
                    onConfirm={(value) => {
                      if (isInputFocused) {
                        console.log('handleSetSpdOnClick - onConfirm', value);
                        // handleSpdInputChanged(value);
                        // setSpeedValue(parseInt(value));
                        setSpeedValue(value.detail.value);
                      }
                    }}


                  // onInput={(value) => setSpeedValue(parseInt(value))}
                  // onBlur={(value) => handleSpdInputChanged(value)}
                  // onConfirm={(value) => handleSpdInputChanged(value)}
                  />
                  {/* </View> */}

                  {/* <Input
            className={`${styles.textInputField} ${styles.header2}`}
            style={{ position: 'absolute', top: '40%', left: '30%', textAlign: 'center', width: '35vw', zIndex: 10 }}
            value={currentSpeed.toString()}
            editable={false} // Make it non-editable to force the dialog
            onTouchStart={handleInputClick} // Use touch event to capture clicks
          /> */}



                  <Text className={`${styles.desText1}`}
                    style={{ alignItems: 'center', width: '46rpx', height: '46rpx', position: 'absolute', top: '62%', left: '43%', zIndex: 5, }}
                  >{`${Strings.getLang('speedUnit')}`}</Text>

                  {/* <SpeedInput
                    className={`${styles.speedInputMargin}`}
                    value={dpState.running_status ? dpState.current_speed : 0}
                    maxLength={4}
                    editable={dpState.running_status ? true : false}
                    onInput={(value) => setSpeedValue(parseInt(value))}
                    onTapBg={(value) => handleSpdInputChanged(value)}
                    onConfirm={(value) => handleSpdInputChanged(value)}
                  /> */}

                  {/* <NumericInputDialog
                     visible={dialogVisible}
                    onClose={() => setDialogVisible(false)}
                    onConfirm={handleSpeedChange}
                    currentSpeed={currentSpeed}
                    /> */}

                  {/* LegendText - Min and Max for Speed */}
                  <View className={`${styles.contentFlexRow}`}
                    style={{ width: '50vw', justifyContent: 'space-between', position: 'absolute', top: '87%', }}
                  >
                    <Text className={`${styles.legendText}`}>800</Text>
                    <Text className={`${styles.legendText}`}>3400</Text>
                  </View>

                  <View className={`${styles.contentFlexRow}`}
                    style={{ width: '50vw', justifyContent: 'center', position: 'absolute', top: '84%', }}
                  >
                    <Button
                      className={`${styles.circleBtn} ${powerStateCSS()}`}
                      style={{ zIndex: 5 }}
                      onClick={() => {
                        handlePowerToggle();
                      }}
                    >
                      <Image
                        className={``}
                        style={{ width: '100%', height: '100%' }}
                        mode="aspectFit"
                        src={
                          dpState.running_status ? require('public/images/ic/ic_power_white.png')
                            : require('public/images/ic/ic_power_blue.png')
                        }
                      />
                    </Button>
                  </View>
                </View>

                {/* Speed buttons */}
                <View className={`${styles.contentFlexCol} ${styles.vStackSpace}`}>
                  <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-between', width: '100%' }}>
                    {
                      selectSpeedProgramGp1.map((item) => {
                        return <Button
                          className={`${styles.roundedBtn} ${selectedCSS('selectedSpeedProgram', item.selectSpeedProgramValue)} ${styles.buttonStyle}`}
                          key={item.id}
                          onClick={() => {
                            // onClicked
                            // changeSelectedSpeed(item.selectSpeedProgramValue)
                            setSelectedButton(item.selectSpeedProgramValue);
                            // console.log('item.selectSpeedProgramValue', item.selectSpeedProgramValue);
                            writeDP(dpId.selected_program, item.selectSpeedProgramValue);
                          }}
                        >
                          <Text className={styles.labelStyle}>
                            {item.label} {/* Optional: Change to a different label if needed */}
                          </Text>
                        </Button>
                      })
                    }
                  </View>

                </View>

                {/* <View style={{ height: '40vh', maxHeight: '284rpx'}}>
                <ScrollView
                  className={`${styles.scrollContainer}`}
                  style={{ marginTop: 0 }}
                  scrollY
                  refresherTriggered={false}
                > */}
                {/* Pump Schedule */}
                <View className={`${styles.contentFlexCol} ${styles.card} ${styles.list} ${styles.vStackSpace}`}>
                  <Text className={`${styles.desText1} ${styles.subtitleC}`}>{Strings.getLang('pumpSchedule')}</Text>
                  {
                    sSetting.schedules.map((item) => {
                      if (!item.enabled) {
                        return
                      }
                      return <RowScheduleDisplay
                        className={`${styles.listDivider}`}
                        key={item.id}
                        id={item.id}
                        name={`${Strings.getLang('sch')} ${item.id + 1}`}
                        speedValue={pumpControl.programs[item.getProgramForList()].speed}
                        enable={item.enabled}
                        start={item.start}
                        end={item.end}
                        editable={false}
                        onEnabled={(value) => { }}
                      />
                    })
                  }
                  {/* </View>
                </ScrollView> */}
                </View>

              </ScrollView>
            </View>
          </>)
        }


      </View>

    </View>

  );
}

export default Home;
// function useSafeAreaInsets() {
//   throw new Error('Function not implemented.');
// }

