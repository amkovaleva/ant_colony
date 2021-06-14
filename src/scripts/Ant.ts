import Point from "./base/Point";
import {AntStatus, AntStatuses, TransformSettings} from "./base/Settings";
import Mortal from "./base/Mortal";
import App from "./App";
import Food from "./Food";
import Home from "./Home";

export default class Ant extends Mortal {
    static maxAge = 50;
    static maxSpeed = 1;
    static maxWeight = 3;
    static antVisibleDist = Food.foodSize * 3;
    _destination: Point;
    _state: AntStatus;
    _foodAmount: number = 0;

    constructor(age: number, position: Point, destination: Point) {
        super(position, 'ant', age, Ant.maxAge);
        this.destination = destination;
        this.state = AntStatuses.search;
    }

    /**
     * В случае если время вышло, то особь умирает и показывается могилка (на несколько секунд).
     * Для живой:
     * Если нужно, меняем направление движения.
     * Сдвигаемся в новую точку по пути.
     * Если мы достигли цели, то обрабатываем это.
     * @param time - время движения / жизни
     */
    move(time: number): void {

        if (!this.isDeadState && this.diffResources < time) {
            this.resources -= 5000;// время, которое показывается могилка
            this.state = AntStatuses.dead;
        }

        this.resources += time;
        if (this.isDeadState)
            return;

        if (this.isSearchState)
            this.tryNewDirection();

        this.position = this.position.findPointOnLineTo(this._destination, time * this.speed);

        if (this._destination.isNearWith(this.position, this.size))
            this.destinationReached()
    }

    /**
     * "Смотрим по сторонам" и если видим еду меняем конечную точку пути.
     */
    tryNewDirection(): void {
        let spaces = App.foods.map(f => f.position.distTo(this.position)), minDist = Math.min(...spaces);
        if (minDist > Ant.antVisibleDist)
            return;

        this.destination = App.foods[spaces.indexOf(minDist)].position;
        this.state = AntStatuses.take;
    }

    /**
     * При достижении конечной точки:
     * - либо берем случайным образом новую целевую точку,
     * - либо забираем еду и идем домой
     */
    destinationReached(): void {
        if (this.isHomeState || this.isSearchState) {
            if (this.isHomeState)
                this.storeFood();
            this.newSearchDirection();
            return;
        }
        let food = null;
        for (let f of App.foods) {
            if (this.position.isNearWith(f.position, this.size)) {
                food = f;
                break;
            }
        }
        if (!food) {//еду уже собрал другой муравей
            this.newSearchDirection();
            return;
        }

        this._foodAmount = food.takeFood(Ant.maxWeight);
        this.destination = Point.zero;
        this.state = AntStatuses.home;
    }

    newSearchDirection() {
        let availablePos = App.randPosDiapasons()
        this.destination = Point.randomPoint(availablePos.x, availablePos.y);
        this.state = AntStatuses.search;
    }

    /**
     * Настройки для поворота муравья: угол и нужно ли отразить по горизонтали
     * Для мертвого - настройки по умолчанию.
     */
    get transformSettings(): TransformSettings {
        let defaultSet = {
            rotateAngle: 0,
            isReflectHorizontal: false
        };
        if (this.isDeadState)
            return defaultSet
        let topPoint = new Point(this.position.x, this.position.y - 50); // так как на картинке муравей идет вверх
        defaultSet.isReflectHorizontal = this._destination.isRighterThen(this.position);
        defaultSet.rotateAngle = this.position.angleFromTo(topPoint, this._destination);
        return defaultSet;
    }

    /**
     * Скорость с возрастом ведет себя как прямоугольная трапеция. На последней пятой убывает от Movable.maxSpeed до нуля.
     * this.resources - это возраст.
     * this.diffResources - сколько осталось жить
     */
    get speed(): number {
        let fifth = this.maxResources / 5, maxSpeed = Ant.maxSpeed / 10;
        if (this.resources <= 4 * fifth)
            return maxSpeed;

        let point = (Point.zero).findPointOnLineTo(new Point(fifth, maxSpeed), this.diffResources, false);
        return Math.abs(point.y);
    }

    /**
     * Меняем значение конечкой точки.
     * Обновляем информацию об отображении картинки муравья.
     * @param destination - новая конечная точка пути
     */
    set destination(destination: Point) {
        this._destination = destination;
        this.rotateInfo = this.transformSettings;
    }

    /**
     * Меняем состояние муравья.
     * Меняем и картинку.
     * Если муравей умер с едой, то добавляем еду на землю.
     * @param str - строка с названием нового состояния.
     */
    set state(str: string) {
        this._state = <AntStatus>str;
        let imgName = 'ant';
        if (this.isHomeState)
            imgName += '-home';
        if (this.isDeadState) {
            imgName += '-dead';
            this.rotateInfo = this.transformSettings;
            if (this._foodAmount > 0) {
                let f = new Food(new Point(this.position.x + this.size.x, this.position.y + this.size.y), this._foodAmount);
                App.newFood(f);
                this._foodAmount = 0;
            }
        }

        this.image = imgName;
    }

    get isSearchState(): boolean {
        return this._state === AntStatuses.search;
    }

    get isHomeState(): boolean {
        return this._state === AntStatuses.home;
    }

    get isTakeState(): boolean {
        return this._state === AntStatuses.take;
    }

    get isDeadState(): boolean {
        return this._state === AntStatuses.dead;
    }

    /**
     * Добавляем еду в муравейник и убираем со "спины" муравья
     */
    storeFood(): void {
        Home.foodAmount += this._foodAmount;
        this._foodAmount = 0;
    }
}
