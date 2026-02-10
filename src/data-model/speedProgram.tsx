import { myUtils } from "@/utils"
import { utils } from "@ray-js/panel-sdk"
import { numToHexString } from "@ray-js/panel-sdk/lib/utils"

export class SpeedProgram {  
    id: number
    title: string
    speed: number
    delay: number

    constructor(index: number, title: string, speed: number, delay: number) {
        this.id = index
        this.title = title
        this.speed = speed
        this.delay = delay
    }

    toWriteData() {
        let title = "0000000000000000000000"
        let speed = numToHexString(this.speed, 4)
        let delay = numToHexString(this.delay)

        return {title, speed, delay}
    }
}