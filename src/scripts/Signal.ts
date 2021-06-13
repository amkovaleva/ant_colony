import Point  from "./base/Point";
import Mortal from "./base/Mortal";

export default class Signal extends Mortal{
    static actTime = 2;
    static actingDist = 2;

    constructor(position: Point) {
        super(position, 'signal', 0, Signal.actTime);
    }

    /**
     * убывает экспонениально с значения Signal.actingDist.
     */
    get actingDist():number{
        return Math.exp(- this.resources) + Signal.actingDist - 1;
    }
}
