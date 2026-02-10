import { myUtils } from "@/utils"
import { utils } from "@ray-js/panel-sdk"
import { numToHexString } from "@ray-js/panel-sdk/lib/utils"

const commandId = '02' // Serial Command Control

export class PumpStatus {

    noOfSpeedPrograms: number
    noOfSchedulePrograms: number
    noOfVariableSpeedPrograms: number
    svrsSupported: number
    noFlowSupported: number
    primingSupported: number
    freezeprotectSupported: number
    noLoadSupported: number
    modelName: number
    
    constructor(dpState: string) {
        const dpStateData = dpState.length >= 11 ? dpState : this.getDummyData()
        const data = utils.partition(dpStateData.substring(2), 2)


        this.noOfSpeedPrograms = myUtils.hexToDec(data[0]) || 0
        this.noOfSchedulePrograms = myUtils.hexToDec(data[1]) || 0
        this.noOfVariableSpeedPrograms = myUtils.hexToDec(data[2]) || 0
        this.svrsSupported = myUtils.hexToDec(data[3]) || 0
        this.noFlowSupported = myUtils.hexToDec(data[4]) || 0
        this.primingSupported = myUtils.hexToDec(data[5]) || 0
        this.freezeprotectSupported = myUtils.hexToDec(data[6]) || 0
        this.noLoadSupported = myUtils.hexToDec(data[7]) || 0
        this.modelName = myUtils.hexToDec(`${data[8]}${data[9]}`)

    }

    getModelName() {
        let realName = ""

        // console.log("getModelName :  ", this.modelName)
        // if (this.modelName === 768) {   // 0x300
        //     realName = "ETV 1.25HP"
        // } else if (this.modelName === 769) {    // 0x301
        //     realName = "ETV 1.65HP"
        // } else if (this.modelName === 512) {   // 0x200
        //     realName = "SPV-T 1.25HP"
        // } else if (this.modelName === 513) {    // 0x201
        //     realName = "SPV-T 1.65HP"
        // } else {
        //     console.log("Unknown Model Name :  ", this.modelName)
        // }

        const lowerBytes = this.modelName & 0xFF;
        if (lowerBytes === 0) {   // 0x300, 0x200
            realName = "1.25HP"
        } else if (lowerBytes === 1) {    // 0x301, 0x201
            realName = "1.65HP"
        } 
        return realName
    }

    getDummyData() {
        var data = ""

        data += commandId
        data += "04" // Number of Speed Programs
        data += "04" // number of schedule programs
        data += "80" // Variable speed programs supported 0x50
        data += "112 " // SVRS supported 0x70
        data += "128" // No Flow supported 0x80
        data += "144" // Priming supported 0x90
        data += "160" // Freeze Protect supported 0xA0
        data += "176" // No Load supported 0xB0
        data += "03" // Model Name (Upper byte is 0x03, Lower byte is 0x00)
        data += "00" // Reserved
        return data
    }


}