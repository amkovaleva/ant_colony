import Point from "./base/Point";
import {AntStatus, TransformSettings, AntStatuses} from "./base/Settings";
import Mortal from "./base/Mortal";
import App from "./App";
import Food from "./Food";
import Home from "./Home";

export default class Ant extends Mortal{
    static maxAge = 50;
    static maxSpeed = 1;
    static maxWeight = 3;
    static antVisibleDist = Food.foodSize * 3;
    _destination: Point;
    _initialSpeed: number;
    _state: AntStatus = 'search';
    _foodAmount: number = 0;

    constructor(age:number, position: Point, speed: number , destination: Point) {
        super(position, 'ant', age, Ant.maxAge);
        this._initialSpeed = speed;
        this.destination = destination;
    }

    move(time:number): void{
        this.resources += time/1000;
        if(this._state === AntStatuses.search)
            this.tryNewDirection();

        this.position = this.position.findPointOnLineTo(this._destination, time * this.speed);

        if(this._destination.isNearWith(this.position, this.size))
            this.destinationReached()
    }

    tryNewDirection():void{
        let spaces = App.foods.map(f => f.position.distTo(this.position)), minDist = Math.min(...spaces);
        if(minDist > Ant.antVisibleDist)
            return;

        this.destination = App.foods[spaces.indexOf(minDist)].position;
        this._state = <AntStatus>AntStatuses.take;
    }

    destinationReached():void{
        if(this._state !== AntStatuses.take){
            if(this._state === AntStatuses.home)
                this.dropFood();
            let availablePos = App.randPosDiapasons()
            this.destination = Point.randomPoint(availablePos.x, availablePos.y);
            this._state = <AntStatus>AntStatuses.search;
            return;
        }
        let food = null;
        for(let f of App.foods) {
            if (this.position.isNearWith(f.position, this.size)) {
                food = f;
                break;
            }
        }
        if(!food)
            return;

        this._foodAmount = food.takeFood(Ant.maxWeight);
        this.destination = Point.zero;
        this._state =  <AntStatus>AntStatuses.home;
    }

    get transformSettings():TransformSettings{
        let isRight = this._destination.isRighterThen(this.position),
            topPoint = new Point(this.position.x, this.position.y - 50), // так как на картинке муравей идет вверх
            angle = this.position.angleFromTo(topPoint, this._destination);

        return {
            rotateAngle: angle,
            isReflectHorizontal: isRight,
            isReflectVertical: false
        }
    }

    /**
     * Скорость с возрастом ведет себя как прямоугольная трапеция. На последней пятой убывает от Movable.maxSpeed до нуля.
     * this.resources - это возраст.
     * this.diffResources - сколько осталось жить
     */
    get speed():number{
        let fifth = this.maxResources / 5, maxSpeed = Ant.maxSpeed/10;
        if(this.resources <= 4 * fifth)
            return maxSpeed;

        let point = (Point.zero).findPointOnLineTo(new Point(fifth, maxSpeed), this.diffResources, false);
        return Math.abs(point.y);
    }

    set destination(destination: Point){
        this._destination = destination;
        this.rotateInfo = this.transformSettings;
    }

    dropFood():void{
        Home.foodAmount += this._foodAmount;
        this._foodAmount = 0;
    }
}
