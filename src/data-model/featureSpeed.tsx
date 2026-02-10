import { myUtils } from "@/utils"
import { utils } from "@ray-js/panel-sdk"
import { numToHexString } from "@ray-js/panel-sdk/lib/utils"

const commandId = '50' // Serial Command Control

export class FeatureSpeed {  
    
    enabled: boolean
    start: string
    end: string
    minSpeed: number
    maxSpeed: number
    step: number
    rhythm: number

    constructor(dpState: string) {
        const dpStateData = dpState.length >= 26 ? dpState : this.getDummyData()
        const data = utils.partition(dpStateData.substring(2), 2)

        // console.log('data[0]:', data[0]);

  

        this.enabled = !!myUtils.hexToDec(data[0]) || false
        this.start = `${myUtils.hexToDecStr(data[2], 2)}:${myUtils.hexToDecStr(data[1], 2)}`
        this.end = `${myUtils.hexToDecStr(data[4], 2)}:${myUtils.hexToDecStr(data[3], 2)}`
        this.minSpeed = myUtils.hexToDec(`${data[5]}${data[6]}`) || 800
        this.maxSpeed = myUtils.hexToDec(`${data[7]}${data[8]}`) || 1000
        this.step = myUtils.hexToDec(`${data[9]}${data[10]}`) || 10
        this.rhythm = myUtils.hexToDec(data[11]) || 5

        // console.log('raw start 2', data[2]);
        // console.log('raw start 1', data[1]);
        // console.log('raw end 4', data[4]);
        // console.log('raw end 3', data[3]);
        // console.log('feature construct start', this.start);
        // console.log('feature construct end', this.end);

    }

    toWriteData() {
        var data = ""

        const start = this.start.split(":")
        const end = this.end.split(":")

        console.log('Enabled Status:', this.enabled); // This will print true or false


        data += commandId
        data += this.enabled ? '01' : '00'
        data += numToHexString(parseInt(start[1]))
        data += numToHexString(parseInt(start[0]))
        data += numToHexString(parseInt(end[1]))
        data += numToHexString(parseInt(end[0]))
        data += numToHexString(this.minSpeed, 4)
        data += numToHexString(this.maxSpeed, 4)
        data += numToHexString(this.step, 4)
        data += numToHexString(this.rhythm)

        // console.log(data)

        return data
    }
    
    getDummyData() {
        var data = ""

        data += commandId
        data += "01" // enabled
        data += "0008" // start
        data += "1E0E" // end
        data += "0320" // minSpeed 800 
        data += "03E8" // maxSpeed 
        data += "000A" // step
        data += "05" // rhythm

        return data
    }
}