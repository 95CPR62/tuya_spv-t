import Strings from "@/i18n";

export const SYSTEM_INFO = 'SYSTEM_INFO';

export const vStackSpace = '16rpx';

export const powerGreen = '#78FF00';
export const secondaryColor = '#2670edd9';

export const GDefine = {
    screenW: 375,
    screenH: 640,
    appVersion: '0.0.15',
}

export const dpId = {
    pump_control: 101,
    feature_speed: 104,
    no_flow: 108,
    priming: 109,
    frozen: 110,
    running_status: 112,
    set_speed: 113,
    selected_program: 114,
    schedule_setting: 127,
    current_speed: 128,
}

export const FaultCode = {
    OverCurrent: 0,
    OverVoltage: 2,
    OverHeat: 10,
    UnderVoltage: 73,
    NoFlow: 74,
    SVRSDeteced: 75,
    LockRotorDetected: 76,
}

export const speedPrograms: string[] = [
    `${Strings.getLang('speed')} 1`,
    `${Strings.getLang('speed')} 2`,
    `${Strings.getLang('speed')} 3`,
]

export const runDurations: string[] = [
    `1 ${Strings.getLang('hrs')}`,
    `2 ${Strings.getLang('hrs')}`,
    `3 ${Strings.getLang('hrs')}`,
    `4 ${Strings.getLang('hrs')}`,
    `5 ${Strings.getLang('hrs')}`,
    `6 ${Strings.getLang('hrs')}`,
    `7 ${Strings.getLang('hrs')}`,
    `8 ${Strings.getLang('hrs')}`,
]