import { myUtils } from "@/utils"
import { utils } from "@ray-js/panel-sdk"
import { numToHexString } from "@ray-js/panel-sdk/lib/utils"

export class Schedule {  
    id: number
    enabled: boolean
    start: string
    end: string
    setSelectSpdProgram: number

    constructor(dpState: string, index: number) {
        const data = utils.partition(dpState, 2)

        this.id = index
        this.enabled = !!myUtils.hexToDec(data[0]) || false 
        this.start = `${myUtils.hexToDecStr(data[2], 2)}:${myUtils.hexToDecStr(data[1], 2)}`
        this.end = `${myUtils.hexToDecStr(data[4], 2)}:${myUtils.hexToDecStr(data[3], 2)}`
        this.setSelectSpdProgram = myUtils.hexToDec(data[5]) || 1
    }

    getProgramForList() {
        return this.setSelectSpdProgram - 1
    }

    toWriteData() {
        var data = ""

        const start = this.start.split(":")
        const end = this.end.split(":")

        data += this.enabled ? '01' : '00'
        data += numToHexString(parseInt(start[1]))
        data += numToHexString(parseInt(start[0]))
        data += numToHexString(parseInt(end[1]))
        data += numToHexString(parseInt(end[0]))
        data += numToHexString(this.setSelectSpdProgram)

        return data
    }
}