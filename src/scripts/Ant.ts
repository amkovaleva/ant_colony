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
    _state: AntStatus = 'search';
    _foodAmount: number = 0;

    constructor(age:number, position: Point, destination: Point) {
        super(position, 'ant', age, Ant.maxAge);
        this.destination = destination;
    }

    /**
     * Если нужно, меняем направление движения.
     * Сдвигаемся в новую точку по пути.
     * Если мы достигли цели, то обрабатываем это.
     * @param time - время движения
     */
    move(time:number): void{
        this.resources += time;
        if(this._state === AntStatuses.search)
            this.tryNewDirection();

        this.position = this.position.findPointOnLineTo(this._destination, time * this.speed);

        if(this._destination.isNearWith(this.position, this.size))
            this.destinationReached()
    }

    /**
     * "Смотрим по сторонам" и если видим еду меняем конечную точку пути.
     */
    tryNewDirection():void{
        let spaces = App.foods.map(f => f.position.distTo(this.position)), minDist = Math.min(...spaces);
        if(minDist > Ant.antVisibleDist)
            return;

        this.destination = App.foods[spaces.indexOf(minDist)].position;
        this._state = <AntStatus>AntStatuses.take;
    }

    /**
     * При достижении конечной точки:
     * - либо берем случайным образом новую целевую точку,
     * - либо забираем еду и идем домой
     */
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

    /**
     * настройки для поворота муравья: угол и нужно ли отразить по горизонтали
     */
    get transformSettings():TransformSettings{
        let isRight = this._destination.isRighterThen(this.position),
            topPoint = new Point(this.position.x, this.position.y - 50), // так как на картинке муравей идет вверх
            angle = this.position.angleFromTo(topPoint, this._destination);

        return {
            rotateAngle: angle,
            isReflectHorizontal: isRight
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

    /**
     * Меняем значение конечкой точки.
     * Обновляем информацию об отображении картинки муравья.
     * @param destination - новая конечная точка пути
     */
    set destination(destination: Point){
        this._destination = destination;
        this.rotateInfo = this.transformSettings;
    }

    /**
     * Добавляем еду в муравейник и убираем со "спины" муравья
     */
    dropFood():void{
        Home.foodAmount += this._foodAmount;
        this._foodAmount = 0;
    }
}
