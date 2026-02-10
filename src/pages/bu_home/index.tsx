
import React, { useEffect, useState } from 'react';
// import { Button } from '@ray-js/smart-ui';
import { RowDropdownList, SpeedInput, SpeedPicker, TopBar } from '@/components';
// import { IconFont } from '@/components/icon-font';
import styles from './index.module.less';
// import Svg from '@ray-js/svg';
import {useInterval} from 'ahooks'
import Strings from '@/i18n';
import { LampCirclePicker } from '@ray-js/components-ty-lamp';

import { router, Button, Image, Icon, Text, View, Input, PickerView, showMenuButton, PickerViewColumn, getDpsInfos, hideMenuButton, navigateTo, onDpDataChange, publishDps, queryDps, showToast, showLoading, hideLoading, getAppInfo, usePageEvent, map, authorizeStatus, Slider } from '@ray-js/ray';

import { useActions, useDevice, useProps } from '@ray-js/panel-sdk';
import { dpId, GDefine, secondaryColor, vStackSpace } from '@/constant';
import { Display } from 'react-7-segment-display';

// import { Display } from "react-7-segment-display";
         
export function BUHome() {
  // const actions = useActions();

  const devInfo = useDevice(device => device.devInfo);
  const dpState = useProps((dpState) => dpState);

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

  // Terence
  const [newSpeedValue, setSpeedValue] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0); // Separate state for current speed
  const [currentPowerConsumption, setPowerConsumption] = useState(0);
  
  const handleMove = (v: number) => {
    const mappedValue = v;
    console.log('handleMove', v);
    setSpeedValue(mappedValue);
  };
  const handleEnd = (v: number) => {
    const mappedValue = v;
    console.log('handleEnd', mappedValue);
    console.log('outputValue=', currentSpeed);
    setSpeedValue(mappedValue);

    // Calculate the transformed speed and update currentSpeed
    const transformedSpeed = transformSpeedValue(v);
    // setCurrentSpeed(transformedSpeed); // Set current speed for later use

    // writeDP(113, transformedSpeed);   // Cannot make function call for getting 113 DPID otherwise it fail to complete the call
  }; 

  // const speedRange = Array.from(Array(3400 - 800 + 1).keys()).map(num => `${num + 800}`) // SpeedPicker
  function handleSpdInputChanged(value: string) {
    const newSpeed = parseInt(value) || 800
    console.log(convertDisplayToValue(newSpeed))
    console.log('Input - ', newSpeed)
    console.log('origin - ', newSpeedValue)
    if (newSpeed < 800 || newSpeed > 3400) {
      // return showToast({ title: Strings.getLang('errPoolSizeNotValidRange'), icon: 'error' })
      setSpeedValue(newSpeedValue) // original
      return showToast({ title: 'errSpdInputNotValidRange', icon: 'error' })
    }
    setSpeedValue(convertDisplayToValue(newSpeed)) // for LampCircleSlider
  }

  // // for LampCircleSlider
  function convertValueToDisplay(value: number) { 
    const display = Math.floor((value / 1000) * (3400 - 800)) + 800
    // return speedRange.indexOf(`${display}`) // SpeedPicker
    return `${display}`
  }
  function convertDisplayToValue(value: number) { // for SpeedPicker
    const newValue = Math.floor((value-800) / 2600 * 1000)
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
  // const updateDevice = (speed) => {
  //     console.log('Updating device with speed:', speed);
  //     // writeDP(dpId.current_speed, speed);
  //     writeDP(113, speed);
  // };

  // Effect to trigger writeDP when currentSpeed changes
  // useEffect(() => {
  //   console.log('useEffect - powerValue=',powerState);
  //   console.log('useEffect - currentSpeed changed:', currentSpeed);
  //   // if(powerState) {
  //   //   // updateDevice(currentSpeed);
  //   // }  
  // }, [currentSpeed, powerState]);


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
    authorizeStatus({scope: 'scope.userLocation',
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
    {id: 1, color: '#ffdead', imagePath: '', currentSpeedValue:0},
  ]

  const currentSpeedTextGp = [
    {id: 2, color: '#ffdead', imagePath: '', currentSpeedValue:0},
  ]

  const powerGp = [
    {id: 3, color: '#ffdead', imagePath: 'public/images/ic/ic_power.png', padding: '28rpx', label: 'Pow', powerValue:powerState},
  ]

  const selectSpeedProgramGp1 = [
    {id: 4, color: '#ffdead', imagePath: '', padding: '16rpx', label: 'Speed  1', selectSpeedProgramValue:1},  // Program 1
    {id: 5, color: '#ffdead', imagePath: '', padding: '16rpx', label: 'Speed 2', selectSpeedProgramValue:2},  // Program 2
  ]
  
  const selectSpeedProgramGp2 = [
    {id: 6, color: '#ffdead', imagePath: '', padding: '16rpx', label: 'Speed 3', selectSpeedProgramValue:3},  // Program 3
    {id: 7, color: '#ffdead', imagePath: '', padding: '16rpx', label: 'Speed 4', selectSpeedProgramValue:4},  // Program 4
  ]

  // const changeSelectedSpeed = (newSpeed) => {
  //   setSelectedSpeed(newSpeed);
  // }

  // const togglePower = () => {
  //   let newStatus = !powerValue;
  //   setPowerStatus(newStatus);
  //   // setPowerStatus(powerValue => !powerValue);  // Toggle the boolean value
  //   console.log('afterTogglePower =', newStatus);
  // }


  let isPowerHighlighted = false;
  let pValue=dpState.running_status;
  if (pValue === true) {
    isPowerHighlighted = true;
    // console.log('initial value of isPowerHighlighted=',isPowerHighlighted);
  }

  const handlePowerToggle = () => {
    // Toggle between 'ON' and 'OFF'
    let newState = false;
    console.log('pow state', newState );
    if(isPowerHighlighted){
      newState = false;
      isPowerHighlighted = false;
    } else {
      newState = true;
      isPowerHighlighted = true;
    }
    setPowerState(newState); // Update the state
    writeDP(dpId.running_status, newState);
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

  const writeDP = async (dpId, value) => {
    startListenDpDataChange();

    console.log('onClicked');
    showToast({ title: "onClicked" });

    try {
      showLoading({title: 'Sending...'}) 

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

  function startListenDpDataChange() {
    if (isListen) {
      return console.log('already started listening');
    }
    setListen(true);
    console.log('Init listening');
    return onDpDataChange((res) => {
      hideLoading()
      console.log('onDpDataChange');
      const time = new Date().toLocaleTimeString();
      console.log('[', time, ']', res.dps);
      console.log(res.dps);
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
    if (type === 'powerStatus') {
      let pValue = dpState.running_status;
      console.log('get Power value =', pValue);
      console.log('isPowerHighlighted =', isPowerHighlighted);
      if (pValue === true){
        isPowerHighlighted = true;
        // return styles.highlighted
        return styles.on
      } else {
        isPowerHighlighted = false;
        return styles.off
      }
      // return ''
    }
    return '';
  }

  usePageEvent('onShow', () => {
    console.log('>>>>> onShow');
    showMenuButton()
    checkLocationPermission()
    
    // fetchDP()
  })

// Option 1
// 涂鸦风格滑动条
// https://www.npmjs.com/package/@ray-js/components-ty-slider/v/0.2.37

// Option 2
// React Native component for creating circular slider.
// https://www.npmjs.com/package/react-native-circular-slider

// option 3 (from official tuya site )
// https://developer.tuya.com/material/library_oHEKLjj0/component?code=ComponentsTyLamp&subCode=LampCirclePicker

// Get mcu inforation to determine which layout should be display
const [currentLayout, setCurrentLayout] = useState('A'); // 'A', 'B', or 'C'

  return (
    <View className={styles.safeArea}>
      <TopBar title={devInfo.name} />

      <View className={`${styles.contentContainer}`} style={{ marginTop: 0 }}>
        {
          currentLayout === 'A' && (<>
            <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-between', }}>
              <View className={styles.contentFlexCol} style={{ width: '100%', alignItems: 'flex-start' }}>
                <View className={`${styles.contentFlexRow}`}>
                  <Image 
                    style={{ width: '34rpx', height: '34rpx'}}
                    mode="aspectFit"
                    src={require('public/images/ic/ic_wifi_signal_3.svg')}
                  />
                  <Text className={styles.desText2} >{Strings.getLang('CONNECTED')}</Text>
                </View>
                <View className={`${styles.contentFlexRow}`} style={{ width: '100%', justifyContent: 'space-between' }}>
                  {
                    countryName == "Unknown" && (
                      <Text className={styles.desText2}>25°C</Text>
                    )
                  }
                  {
                    countryName !== "Unknown" && (
                      <Text className={styles.desText2}>{`${countryName} | 25°C`}</Text>
                    )
                  }
                </View>
              </View>

              <Button style={{ width: '80rpx', height: '80rpx'}} onClick={() => { router.push('/setting') }}>
                  <Image 
                    style={{ width: '100%', height: '100%'}}
                    mode="aspectFit"
                    src={require('public/images/ic/ic_setting_circled.svg')}
                  />
                </Button>
            </View>
            
            {/* LampCirclePicker */}
            <View className={`${styles.contentFlexCol} ${styles.card}`} 
              style={{ 
                alignItems: 'center', 
                marginTop: '24rpx', 
                marginBottom: '10rpx',
                padding: '20rpx',
                display: 'none',
              }}
            >    
              <View className={`${styles.contentFlexCol}`} style={{ alignItems: 'center', width: '100%' }}>
                {/* LegendText - Wattage */}
                <Text className={`${styles.legendText}`} style={{ marginBottom: '1vh' }}>
                  {/* {powerState ? dpState.current_watt : 0} W</label> */}
                  {dpState.running_status ? dpState.current_watt : 0} W
                </Text>
                
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
                  style={{
                    zIndex: 0,    // below level of power key and make it clickable
                    width: '1500rpx',
                    height: '1500rpx',
                  }}
                  innerBorderStyle={{
                    width: 2,
                    color: 'white',
                  }}
                  descText="Speed (RPM)"
                  descStyle={{
                    color: 'white',
                  }}
                  titleStyle={{
                    opacity: 0,   // Transparent the % value because the library is not allow to be removed
                  }}
                  touchCircleLineWidth={15}
                  touchCircleStrokeStyle={'#0056b3'}
                  useEventChannel
                  onTouchMove={handleMove}
                  onTouchEnd={handleEnd}
                />

                <SpeedInput
                  value={`${convertValueToDisplay(newSpeedValue)}`}
                    // value={{powerState ? dpState.current_speed : 0}}
                  // value={{dpState.running_status ? dpState.current_speed : 0}}
                  maxLength={4}
                  onTapBg={(value) => handleSpdInputChanged(value)}
                  onConfirm={(value) => handleSpdInputChanged(value)}
                />

                {/* <SpeedPicker
                  value={convertValueToDisplay(newSpeedValue)}
                  modes={speedRange}
                  // editable={true}
                  onChange={(index) => {
                    console.log("SpeedPicker - ", speedRange[index])
                    handleSpdInputChanged(speedRange[index])
                  }}
                /> */}

                <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-evenly', width: '100%', marginTop: '-5vh' }}>
                  <Button
                    className={`${styles.circleBtn} ${selectedCSS('powerStatus', powerState)}`}
                    onClick={() => {
                      handlePowerToggle();
                      console.log('onClick powerValue=', powerState);
                    }}
                  >
                    <Image 
                      className={``}
                      style={{ width: '100%', height: '100%' }}
                      mode="aspectFit"
                      src={
                        powerState ? require('public/images/ic/ic_power_blue.png')
                        : require('public/images/ic/ic_power_white.png')
                      }
                    />
                  </Button>
                  
                  {/* LegendText - Min and Max for Speed */}
                  <View className={`${styles.contentFlexRow}`}
                    style={{ width: '41vw', justifyContent: 'space-between', position: 'absolute', top: '85%',}}
                  >
                    <Text className={`${styles.legendText}`}>800</Text>
                    <Text className={`${styles.legendText}`}>3400</Text>
                  </View>

                  <Text className={`${styles.legendText}`}
                    style={{ 
                      fontSize: '16px', 
                      color: 'red', 
                      marginBottom: '80px',
                      position: 'absolute',
                      top: '30%',                // Center vertically
                      left: '50%',               // Center horizontally
                      transform: 'translate(-50%, -50%)', // Offset to center the text
                      fontWeight: 'bold',
                    }}
                  >
                    {dpState.priming_status && 'Priming'}
                  </Text>

                  <Text className={`${styles.legendText}`}
                    style={{ 
                      fontSize: '16px', 
                      color: 'red', 
                      marginBottom: '80px',
                      position: 'absolute',
                      top: '30%',                // Center vertically
                      left: '50%',               // Center horizontally
                      transform: 'translate(-50%, -50%)', // Offset to center the text
                      fontWeight: 'bold',
                    }}
                  >
                    {dpState.fault_flag && (
                      dpState.fault_code === 1 ? Strings.getLang('overCurrent') :
                      'Unknown Fault' // Optional: fallback for other fault codes
                    )}
                  </Text>
                </View>
              </View>
            </View>
                
            {/* Speed buttons */}
            <View className={`${styles.contentFlexCol}`} style={{ marginTop: 0 }}>
              <View className={`${styles.contentFlexRow}`} style={{justifyContent: 'space-between', width: '100%'}}>
                {
                  selectSpeedProgramGp1.map((item) => {
                    return <Button
                      className={`${styles.roundedBtn} ${selectedCSS('selectedSpeedProgram', item.selectSpeedProgramValue)} ${styles.buttonStyle}`}
                      key={item.id}
                      onClick={() => {
                        // onClicked
                        // changeSelectedSpeed(item.selectSpeedProgramValue)
                        setSelectedButton(item.selectSpeedProgramValue);
                        console.log('item.selectSpeedProgramValue', item.selectSpeedProgramValue);
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
              <View className={`${styles.contentFlexRow}`} style={{justifyContent: 'space-between', width: '100%'}}>
                {
                  selectSpeedProgramGp2.map((item) => {
                    return <Button
                      className={`${styles.roundedBtn} ${selectedCSS('selectedSpeedProgram', item.selectSpeedProgramValue)} ${styles.buttonStyle}`}
                      key={item.id}
                      onClick={() => {
                        // onClicked
                        // changeSelectedSpeed(item.selectSpeedProgramValue)
                        setSelectedButton(item.selectSpeedProgramValue);
                        console.log('item.selectSpeedProgramValue', item.selectSpeedProgramValue);
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
          </>)
        }
      

        {
          currentLayout === 'B' && (<>
            <View className={`${styles.contentFlexRow}`} style={{ justifyContent: 'space-between', marginTop: vStackSpace, }}>
              <View className={styles.contentFlexCol} style={{ alignItems: 'flex-start', gap: '8rpx' }}>
                <View className={`${styles.contentFlexRow}`}>
                  <Image 
                    style={{ width: '34rpx', height: '34rpx'}}
                    mode="aspectFit"
                    src={require('public/images/ic/ic_wifi_signal_3.svg')}
                  />
                  <Text className={styles.desText2} >{Strings.getLang('CONNECTED')}</Text>
                </View>
                <Text className={styles.desText2}>{`${countryName} | 25°C`}</Text>
              </View>
            </View>

            <Display height={100} value="1234" count={4} color='red' skew={true}/>

            <View className={`${styles.contentContainer} ${styles.card}`} 
              style={{ 
                alignItems: 'center', 
                gap: '20rpx', 
                marginBottom: '5px', 
                height: '520px',
                backgroundColor: 'lightblue',
                
                }} >    
                <Text>Rendering Display Component</Text>
                <Display height={100} value="1234" count={4} color='red' skew={true}/>
            </View>
          </>)
        }
      </View>
    </View>  
  );
}

export default BUHome;
