import { myUtils } from "@/utils"
import { utils } from "@ray-js/panel-sdk"
import { numToHexString } from "@ray-js/panel-sdk/lib/utils"

const commandId = 'A0' // Serial Command Control

export class Frozen {  
    
    enabled: boolean
    runDuration: number
    speed: number
    temperature: number
    // temperatureUnit: boolean

    constructor(dpState: string) {
        console.log('----***', dpState)
        const dpStateData = dpState.length >= 12 ? dpState : this.getDummyData()
        const data = utils.partition(dpStateData.substring(2), 2)

        this.enabled = !!myUtils.hexToDec(data[0]) || false
        this.runDuration = myUtils.hexToDec(data[1]) || 1
        this.speed = myUtils.hexToDec(`${data[2]}${data[3]}`) || 1000
        this.temperature = myUtils.hexToDec(data[4]) || 0
        // this.temperatureUnit = !!myUtils.hexToDec(data[5]) || false
    }

    getRunDurationForList() {
        return this.runDuration - 1
    }

    toWriteData() {
        var data = ""

        data += commandId
        data += this.enabled ? '01' : '00'
        data += numToHexString(this.runDuration)
        data += numToHexString(this.speed, 4)
        data += numToHexString(this.temperature)
        // data += this.temperatureUnit ? '01' : '00'

        // console.log(data)

        return data
    }

    getDummyData() {
        var data = ""

        data += commandId
        data += "01" // enabled
        data += "01" // runDuration
        data += "03E8" // speed
        data += "00" // temperature
        // data += "00" // temperatureUnit

        return data
    }
}