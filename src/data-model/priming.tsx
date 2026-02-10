import { myUtils } from "@/utils"
import { utils } from "@ray-js/panel-sdk"
import { numToHexString } from "@ray-js/panel-sdk/lib/utils"

const commandId = '90' // Serial Command Control

export class Priming {  
    
    enabled: boolean
    time: number
    speed: number

    constructor(dpState: string) {
        const dpStateData = dpState.length >= 10 ? dpState : this.getDummyData()
        console.log('dpStateData', dpStateData);
        const data = utils.partition(dpStateData.substring(2), 2)


        console.log('data[0]:', data[0]);

        this.enabled = !!myUtils.hexToDec(data[0]) || false
        this.time = myUtils.hexToDec(data[1]) || 1
        this.speed = myUtils.hexToDec(`${data[2]}${data[3]}`) || 2900
    }

    toWriteData() {
        var data = ""

        data += commandId
        data += this.enabled ? '01' : '00'
        data += numToHexString(this.time)
        data += numToHexString(this.speed, 4)

        // console.log(data)

        return data
    }
    
    getDummyData() {
        var data = ""

        data += commandId
        data += "01" // enabled
        data += "01" // time
        data += "0B54" // speed

        return data
    }
}