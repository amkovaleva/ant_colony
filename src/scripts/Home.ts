import Point from "./base/Point";
import Displayed from "./base/Displayed";

export default class Home extends Displayed {

    static foodAmount: number = 0;


    constructor(position: Point) {
        super('home', position);
    }

}
