import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, hideLoading, hideMenuButton, onDpDataChange, publishDps, router, showLoading, showToast, usePageEvent, Button } from '@ray-js/ray';
import { TopBar, RowSwitch, RowSlider, SaveButton, RowRangeSlider, RowSchedule, RowDropdownList } from '@/components';
import styles from './index.module.less';
import { useActions, useDevice, useProps, utils } from '@ray-js/panel-sdk';
import Strings from '@/i18n';
import { dpId, powerGreen, secondaryColor, speedPrograms } from '@/constant';
import { Slider, DialogInstance, Dialog } from '@ray-js/smart-ui';
import { ScheduleSetting } from '@/data-model';
import { dateFormat, parseHour12, stringToSecond } from '@ray-js/panel-sdk/lib/utils';
import { myUtils } from '@/utils';
// type ElectrolysisDetailsProps = {
//   type: string
//   dpId: number
//   subtitle: string
// }

export function Schedule_Setting(props) {
  const actions = useActions();
  const dpState = useProps((dpState) => dpState)
  const [isListen, setListen] = useState(false);
  const [isSave, setSave] = useState(false); // 判断是否点击保存按钮
  const [isReq, setReq] = useState(false); // 判断是否请求成功

  const setting = new ScheduleSetting(dpState.schedule_setting !== undefined ? dpState.schedule_setting : '')
  const [newSetting, setNewSetting] = useState(setting)
  const [oldSetting, setOldSetting] = useState(JSON.parse(JSON.stringify(setting)))

  const [speedP1, setSpeedP1] = useState(setting.schedules[0].getProgramForList())
  const [speedP2, setSpeedP2] = useState(setting.schedules[1].getProgramForList())
  const [speedP3, setSpeedP3] = useState(setting.schedules[2].getProgramForList())
  const [speedP4, setSpeedP4] = useState(setting.schedules[3].getProgramForList())

  // const [currentTime, setCurrentTime] = useState(dateFormat('hh:mm', new Date()))

  function handleSwitchFuncChanged(value: boolean, index: number) {
    newSetting.schedules[index].enabled = value
  }
  function getSpeedProgram(index: number): number {
    switch (index) {
      case 1:
        return speedP2
      case 2:
        return speedP3
      default:
        return speedP1
    }
  }
  function handleProgramChanged(value: number, index: number) {
    switch (index) {
      case 1:
        setSpeedP2(value)
        break
      case 2:
        setSpeedP3(value)
        break
      default:
        setSpeedP1(value)
        break
    }
    newSetting.schedules[index].setSelectSpdProgram = value + 1
    console.log(newSetting.schedules)
  }
  function handleScheduleChanged(newStart: string, newEnd: string, index: number) {
    newSetting.schedules[index].start = newStart
    newSetting.schedules[index].end = newEnd
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
        if (cDpId === `${dpId.schedule_setting}`) { // isSave &&
          const sSetting = new ScheduleSetting(`${res.dps[`${dpId.schedule_setting}`]}`)
          initFromDpState(sSetting)
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

      await actions.schedule_setting.set(newSetting.toWriteData())
      setOldSetting(JSON.parse(JSON.stringify(newSetting)))
      return 
      // return showToast({ title: Strings.getLang('scheduleSettingSaveSuccess'), icon: 'success' })
    } catch (error) {
      console.log(error)
      hideLoading()
      setSave(false)
      return showToast({ title: Strings.getLang('scheduleSettingSaveFail'), icon: 'error' })
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
            showToast({ title: Strings.getLang('scheduleSettingSaveSuccess'), icon: 'success' })
          }else{
            showToast({ title: Strings.getLang('scheduleSettingSaveFail'), icon: 'error' })
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
      showToast({ title: Strings.getLang('scheduleSettingSaveSuccess'), icon: 'success' })
      setSave(false)
      setReq(false)
    }
  }, [isReq]);

  // Helper function to convert time (HH:MM) to minutes
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  // Function to check for time overlaps
function hasOverlaps(schedule) {
  // Filter only enabled schedules
  const enabledSchedules = schedule.filter((s) => s.enabled);

  // Convert time strings to minutes
  const intervals = enabledSchedules.map(({ start, end, id }) => ({
    id, // Keep track of the schedule ID
    start: timeToMinutes(start),
    end: timeToMinutes(end),
  }));

  // Compare each interval with every other interval
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      if (
        intervals[i].start < intervals[j].end &&
        intervals[j].start < intervals[i].end
      ) {
        console.log(
          `Overlap found between Schedule ${intervals[i].id} and Schedule ${intervals[j].id}`
        );
        return true; // Overlap found
      }
    }
  }

  return false; // No overlaps
}

  function save() {
    // newSetting.toWriteData()
    // setSave(true)

    if(hasOverlaps(newSetting.schedules)) {
      return showToast({ title: Strings.getLang('scheduleSettingSaveFailOverlap'), icon: 'error' })
    } else {
      writeDP()
    }
  }

  function initFromDpState(sSetting: ScheduleSetting) {
    setNewSetting(sSetting)

    setSpeedP1(sSetting.schedules[0].getProgramForList())
    setSpeedP2(sSetting.schedules[1].getProgramForList())
    setSpeedP3(sSetting.schedules[2].getProgramForList())


    // console.log('initFromDpState schedules1 timing:', sSetting.schedules[0])
    // console.log('initFromDpState schedules2 timing:', sSetting.schedules[1])
    // console.log('initFromDpState schedules3 timing:', sSetting.schedules[2])

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
    initFromDpState(new ScheduleSetting(dpState.schedule_setting !== undefined ? dpState.schedule_setting : ''))
  })

  useEffect(() => {
      const oldData = myUtils.SHA1(JSON.stringify(oldSetting));
      const newData = myUtils.SHA1(JSON.stringify(setting));
      if(oldData != newData){
        setOldSetting(JSON.parse(JSON.stringify(setting)))
      }
    }, [setting])

  const back = () => {
    // console.log(oldSetting, newSetting)
    // console.log(myUtils.SHA1(JSON.stringify(oldSetting.schedules)))
    // console.log(myUtils.SHA1(JSON.stringify(newSetting.schedules)))
    const oldData = myUtils.SHA1(JSON.stringify(oldSetting.schedules));
    const newData = myUtils.SHA1(JSON.stringify(newSetting.schedules));
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
        if(hasOverlaps(newSetting.schedules)) {
          return showToast({ title: Strings.getLang('scheduleSettingSaveFailOverlap'), icon: 'error' })
        } else {
          // writeDP()
          try {
            // showLoading({title: 'Sending...'}) 

            await actions.schedule_setting.set(newSetting.toWriteData())
            setTimeout(() => {
              router.back()
            }, 1000)
            return showToast({ title: Strings.getLang('scheduleSettingSaveSuccess'), icon: 'success' })
          } catch (error) {
            console.log(error)
            hideLoading()
            // setSave(false)
            return showToast({ title: Strings.getLang('scheduleSettingSaveFail'), icon: 'error' })
          }
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
      <TopBar title={Strings.getLang('topBarScheduleSetting')} showBackBtn={true} custom={true} onClick={back}/>
      <ScrollView
        className={`${styles.scrollContainer}`}
        scrollY
        refresherTriggered={false}
      >
          <Dialog id="smart-dialog" />
          <View className={`${styles.contentContainer}`} style={{ marginTop: 0 }} >

            {/* <View className={`${styles.card} ${styles.cardSecondColor} ${styles.list}`}>
              <View className={`${styles.contentFlexRow}`} style={{ height: '13vh', minHeight: '174rpx', justifyContent: 'space-between' }}>
                <View className={`${styles.contentFlexCol}`}>
                  <Text className={`${styles.desText1}`} style={{ fontWeight: 'bold' }}>{Strings.getLang('topBarSpeedSetting')}</Text>
                  <Text className={`${styles.desText3}`}>{Strings.getLang('syncClockDes')}</Text>
                  <Text className={`${styles.desText3}`}>{`${Strings.getLang('localTime')}: ${currentTime}`}</Text>
                </View>
                <Button
                  className={`${styles.capsuleBtnLarge}`}
                  style={{ width: '25vw' }}
                  onClick={() => {}}
                >
                  {Strings.getLang('Sync')}
                </Button>
              </View>
            </View> */}

          {
            newSetting.schedules.map((item, index) => {
              return <>
                <View className={`${styles.contentFlexCol}`}>
                  <View className={`${styles.mergeCardUpper}`}>
                    <RowSwitch
                      className={`${styles.list} ${styles.listDivider}`}
                      title={`${Strings.getLang('sschedule')} ${item.id + 1}`}
                      state={item.enabled}
                      tintColor={powerGreen}
                      stateTextType={1}
                      onChange={(value) => handleSwitchFuncChanged(value, index)}
                    />
                  </View>
                  
                  <View className={`${styles.mergeCardLower}`}>
                    <RowDropdownList
                      className={`${styles.list} ${styles.listDivider} ${styles.switchExpand}`}
                      title={`${Strings.getLang('speedProgram')}`}
                      value={getSpeedProgram(index)}
                      // value={item.getProgramForList()}
                      modes={speedPrograms}
                      onChange={(value) => handleProgramChanged(value, index)}
                    />

                    <RowSchedule
                      className={`${styles.listDivider}`}
                      id={item.id}
                      start={item.start}
                      end={item.end}
                      onChange={(newStart, newEnd, _) => {
                        handleScheduleChanged(newStart, newEnd, index);
                      }} 
                    />
                  </View>
                </View>
              </>
            })
          }
          </View>
      </ScrollView>
      
      <SaveButton onClick={() => save()} />
    </View>
  );
}

export default Schedule_Setting;