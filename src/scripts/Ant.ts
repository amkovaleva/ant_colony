import Point from "./base/Point";
import Movable from "./base/Movable";

export default class Ant extends Movable{
    static maxAge = 50;

    constructor(age:number, position: Point, speed: number , destination: Point) {
        super(position, 'ant', speed, destination, age, Ant.maxAge);
    }
}
