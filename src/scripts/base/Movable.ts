import Point from "./Point";
import Mortal from "./Mortal";

export default class Movable extends Mortal{
    static maxSpeed = 4;
    _destination: Point;
    _initialSpeed: number;

    constructor(position: Point, image:string, speed: number , destination: Point, resources:number, maxResources:number) {
        super(position, image, resources, maxResources);
        this._destination = destination;
        this._initialSpeed = speed;
    }

    move(time:number): void{
        this.position = this.position.findPointOnLineTo(this._destination, time * this.speed);
    }

    /**
     * Скорость с возрастом ведет себя как равнобедренная трапеция. На первой трети возрастает до Movable.maxSpeed, а в последней трети убывает до нуля.
     * this.resources - это возраст.
     * this.diffResources - сколько осталось жить
     */
    get speed():number{
        let third = this.maxResources / 3;
        if(third >= this.resources && this.resources <= 2 * third)
            return Movable.maxSpeed;

        let point = this.position.findPointOnLineTo(this._destination, this.resources < third? this.resources : this.diffResources, false);
        return point.y;
    }

    set destination(destination: Point){
        this._destination = destination;
    }

}
