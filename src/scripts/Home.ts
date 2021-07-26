import Point from "./base/Point";
import Mortal from "./base/Mortal";
import App from "./App";

export default class Home extends Mortal {

    static eatFoodPerTime:number = Infinity;
    totalCollectedFood:number = 0;

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

    storeFood(foodAmount:number):void{
        this.addResources(foodAmount);
        this.totalCollectedFood += foodAmount;
    }
}
