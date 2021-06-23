import Point from "./base/Point";
import Mortal from "./base/Mortal";
import App from "./App";
import {getTime} from "./base/Settings";

export default class Home extends Mortal {

    static eatFoodPerTime:number = getTime(0, 10);

    constructor(position: Point) {
        super(position, 'home', 0, Infinity);
    }

    /**
     * Голодна ли колония. То есть есть ли еда в муравейнике.
     */
    get isColonyHungry():boolean{
        return this.resources <= 0;
    }

    /**
     * Живой ли муравейник / есть ли в нем жильцы или хотябы еда для создания новых муравьем
     */
    get exists():boolean{
        return !this.isColonyHungry || App.ants.length > 0;
    }

}
