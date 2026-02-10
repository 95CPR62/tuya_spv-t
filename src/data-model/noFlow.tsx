import { myUtils } from "@/utils"
import { utils } from "@ray-js/panel-sdk"
import { numToHexString } from "@ray-js/panel-sdk/lib/utils"

const commandId = '80' // Serial Command Control

export class NoFlow {  
    
    enabled: boolean
    alarmTime: number
    sensitivity: number

    constructor(dpState: string) {
        const dpStateData = dpState.length >= 8 ? dpState : this.getDummyData()
        const data = utils.partition(dpStateData.substring(2), 2)

        this.enabled = !!myUtils.hexToDec(data[0]) || false
        this.alarmTime = myUtils.hexToDec(data[1]) || 1
        this.sensitivity = myUtils.hexToDec(data[2]) || 1
    }

    toWriteData() {
        var data = ""

        data += commandId
        data += this.enabled ? '01' : '00'
        data += numToHexString(this.alarmTime)
        data += numToHexString(this.sensitivity)

        // console.log(data)

        return data
    }
    
    getDummyData() {
        var data = ""

        data += commandId
        data += "01" // enabled
        data += "01" // alarmTime
        data += "01" // sensitivity

        return data
    }
}