import { myUtils } from "@/utils"
import { utils } from "@ray-js/panel-sdk"
import { numToHexString } from "@ray-js/panel-sdk/lib/utils"
import { Schedule } from "./schedule"

const commandId = '20' // Serial Command Control

export class ScheduleSetting {  
    
    schedules: Schedule[]
    // titleS1: string
    // titleS2: string
    // titleS3: string
    // titleS4: string

    constructor(dpState: string) {
        const dpStateData = dpState.length >= 50 ? dpState : this.getDummyData()
        const data = utils.partition(dpStateData.substring(2), 2)

        this.schedules = []
        // const scheduleData = utils.partition(dpStateData.slice(2, 58), 14)
        const scheduleData = utils.partition(dpStateData.slice(2, 50), 12)
        scheduleData.forEach((e, index) => {
            this.schedules.push(new Schedule(e, index))
        })
    }

    toWriteData() {
        var data = ""

        data += commandId
        this.schedules.forEach((e) => {
            data += e.toWriteData()
        })

        // data += "0000000000000000000000" // titleS1
        // data += "0000000000000000000000" // titleS2
        // data += "0000000000000000000000" // titleS3
        // data += "0000000000000000000000" // titleS4

        // console.log(data)

        return data
    }
    
    getDummyData() {
        var data = ""

        data += commandId
        data += '0100081E0E01' // enabled, 0800 -1430, 1
        data += '0000081E0E02'
        data += '0100081E0E03'
        data += '0000081E0E04'
        // data += "0000000000000000000000" // titleS1
        // data += "0000000000000000000000" // titleS2
        // data += "0000000000000000000000" // titleS3
        // data += "0000000000000000000000" // titleS4

        return data
    }
}