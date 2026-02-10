import { myUtils } from "@/utils"
import { utils } from "@ray-js/panel-sdk"
import { numToHexString } from "@ray-js/panel-sdk/lib/utils"
import { SpeedProgram } from "./speedProgram"
import Strings from "@/i18n"

const commandId = '01' // Serial Command Control

export class PumpControl {  
    
    runCtrl: number
    setSpeed: number
    setSelectSpdProgram: number
    programs: SpeedProgram[]

    // speedP1: number
    // speedP2: number
    // speedP3: number
    // speedP4: number
    // titleP1: string
    // titleP2: string
    // titleP3: string
    // titleP4: string
    // spdDelayP1: number
    // spdDelayP2: number
    // spdDelayP3: number
    // spdDelayP4: number

    constructor(dpState: string) {
        const dpStateData = dpState.length >= 34 ? dpState : this.getDummyData()
        const data = utils.partition(dpStateData.substring(2), 2)

        this.runCtrl = myUtils.hexToDec(data[0]) || 1
        this.setSpeed = myUtils.hexToDec(`${data[1]}${data[2]}`) || 800
        this.setSelectSpdProgram = myUtils.hexToDec(data[3]) || 1
        
        this.programs = [
            new SpeedProgram(
                1,
                `${Strings.getLang('speed')} 1`,
                (myUtils.hexToDec(`${data[4]}${data[5]}`) || 800),
                (myUtils.hexToDec(data[12]) || 5)
            ),
            new SpeedProgram(
                2,
                `${Strings.getLang('speed')} 2`,
                (myUtils.hexToDec(`${data[6]}${data[7]}`) || 800),
                (myUtils.hexToDec(data[13]) || 5)
            ),
            new SpeedProgram(
                3,
                `${Strings.getLang('speed')} 3`,
                (myUtils.hexToDec(`${data[8]}${data[9]}`) || 800),
                (myUtils.hexToDec(data[14]) || 5)
            ),
            // new SpeedProgram(
            //     4,
            //     `${Strings.getLang('speed')} 4`,
            //     (myUtils.hexToDec(`${data[10]}${data[11]}`) || 800),
            //     (myUtils.hexToDec(data[15]) || 5)
            // ),
        ]

        // this.speedP1 = myUtils.hexToDec(`${data[4]}${data[5]}`) || 800
        // this.speedP2 = myUtils.hexToDec(`${data[6]}${data[7]}`) || 800
        // this.speedP3 = myUtils.hexToDec(`${data[8]}${data[9]}`) || 800
        // this.speedP4 = myUtils.hexToDec(`${data[10]}${data[11]}`) || 800
        // this.spdDelayP1 = myUtils.hexToDec(data[56]) || 5
        // this.spdDelayP2 = myUtils.hexToDec(data[57]) || 5
        // this.spdDelayP3 = myUtils.hexToDec(data[58]) || 5
        // this.spdDelayP4 = myUtils.hexToDec(data[59]) || 5
    }

    toWriteData() {
        var data = ""

        data += commandId
        data += numToHexString(this.runCtrl)
        data += numToHexString(this.setSpeed, 4)
        data += numToHexString(this.setSelectSpdProgram)

        var speeds = ""
        // var titles = ""
        var delays = ""
        this.programs.forEach((e) => {
            const program = e.toWriteData()
            speeds += program.speed
            // titles += program.title
            delays += program.delay
        })

        data += speeds
        // data += titles
        data += delays

        // data += numToHexString(this.speedP1, 4)
        // data += numToHexString(this.speedP2, 4)
        // data += numToHexString(this.speedP3, 4)
        // data += numToHexString(this.speedP4, 4)
        // data += "0000000000000000000000"
        // data += "0000000000000000000000"
        // data += "0000000000000000000000"
        // data += "0000000000000000000000"
        // data += numToHexString(this.spdDelayP1, 4)
        // data += numToHexString(this.spdDelayP2, 4)
        // data += numToHexString(this.spdDelayP3, 4)
        // data += numToHexString(this.spdDelayP4, 4)

        // console.log(data)

        return data
    }
    
    getDummyData() {
        var data = ""

        data += commandId
        data += "01" // runCtrl
        data += "0320" // setSpeed
        data += "01" // setSelectSpdProgram
        data += "0320" // speedP1
        data += "0320" // speedP2
        data += "0320" // speedP3
        data += "0320" // speedP4
        // data += "0000000000000000000000" // titleP1
        // data += "0000000000000000000000" // titleP2
        // data += "0000000000000000000000" // titleP3
        // data += "0000000000000000000000" // titleP4
        data += "05" // spdDelayP1
        data += "05" // spdDelayP2
        data += "05" // spdDelayP3
        data += "05" // spdDelayP4

        return data
    }
}