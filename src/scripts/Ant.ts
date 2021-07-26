import Point from "./base/Point";
import {AntStatus, AntStatuses, TransformSettings} from "./base/Settings";
import Mortal from "./base/Mortal";
import App from "./App";
import Food from "./Food";

export default class Ant extends Mortal {
    static maxAge = 50;
    static maxSpeed = 0.1;
    static maxWeight = 3;
    static antVisibleDist: number = Food.foodSize * 3;
    static antHearDist: number = Ant.antVisibleDist * 3;
    _foodAmount: number = 0;

    constructor(age: number, position: Point, destination: Point) {
        super(position, 'ant', age, Ant.maxAge);
        this.destination = destination;
        this.state = AntStatuses.search;
    }

    _destination: Point;

    get destination(): Point {
        if (this.isFoundState)
            return this._food.position;
        if (this.isFollowState)
            return this._followAnt.destination;

        return this._destination;
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

    _state: AntStatus;

    /**
     * Меняем состояние муравья.
     * Меняем и картинку.     *
     * @param str - строка с названием нового состояния.
     */
    set state(str: string) {
        this._state = <AntStatus>str;

        let imgName = 'ant';

        if (this.isHomeState || this.isActiveSearchState) {
            this._food = null;
            this._followAnt = null;
        }

        if(this.isHomeState){
            imgName += '-home';
            this.destination = this.homePosition;
        }
        else if (this.isActiveSearchState)
            this.rotateInfo = this.transformSettings;

        else if (this.isShareState)
            imgName += '-found';

        else if (this.isFollowState)
            imgName += '-follow';

        else if (this.isDeadState) {
            imgName += '-dead';
            this.die();
        }

        this.image = imgName;
    }

    _food: Food | null = null;

    /**
     * муравей начинает идти к найденной еде.
     * @param food - найденная еда
     */
    set food(food: Food) {
        this._food = food;
        this._followAnt = null;
        this.state = AntStatuses.found;
        this.destination = food.position;
    }

    _followAnt: Ant | null = null;

    /**
     * начинаем двигаться в одну точку с другим муравьем в сторону найденной им еды.
     * @param ant - муравей, которому нужна помощь со сбором еды.
     */
    set followAnt(ant: Ant) {
        this._followAnt = ant;
        this._food = null;
        this.state = AntStatuses.follow;
        this.destination = ant.destination;
    }

    get nearestFood(): { dist: number, object: Food } | null {
        return this._nearestFromList(App.foods, Ant.antVisibleDist);
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

        defaultSet.isReflectHorizontal = this.destination.isRighterThen(this.position);
        defaultSet.rotateAngle = this.position.angleFromTo(topPoint, this.destination);

        return defaultSet;
    }

    /**
     * Скорость с возрастом ведет себя как прямоугольная трапеция. На последней пятой убывает от Movable.maxSpeed до нуля.
     * this.resources - это возраст.
     * this.diffResources - сколько осталось жить
     */
    get speed(): number {
        let fifth = this.maxResources / 5, maxSpeed = Ant.maxSpeed;

        if (this.resources <= 4 * fifth)
            return maxSpeed;

        let point = (Point.zero).findPointOnLineTo(new Point(fifth, maxSpeed), this.diffResources, false);
        return Math.abs(point.y);
    }

    get homePosition(): Point {
        return App.home.position;
    }

    /**
     * статус, когда нужно осуществлять поиск. Так как по пути может встрериться еда.
     */
    get isSearchState(): boolean {
        return this._state === AntStatuses.search || this._state === AntStatuses.follow;
    }

    /**
     * статус, когда не найдена ни еда, ни муравей, которому нужна помощь
     */
    get isActiveSearchState(): boolean {
        return this._state === AntStatuses.search;
    }

    /**
     * в зоне видимости найдена еда и муравей идет к ней
     */
    get isFoundState(): boolean {
        return this._state === AntStatuses.found;
    }

    /**
     * в зоне слышимости есть муравей, к которому идем на помощь
     */
    get isFollowState(): boolean {
        return this._state === AntStatuses.follow;
    }

    /**
     * муравей собрал еду и несет ее в муравейник
     */
    get isHomeState(): boolean {
        return this._state === AntStatuses.home;
    }

    /**
     * Муравей мертв. Отображается могилка
     */
    get isDeadState(): boolean {
        return this._state === AntStatuses.dead;
    }

    /**
     * этот статус отвечает за то, что муравей нашел еду и одному ему не унести
     */
    get isShareState(): boolean {
        return this._state === AntStatuses.found && this._food.diffResources > Ant.maxWeight;
    }

    /**
     * В случае если время вышло, то особь умирает и показывается могилка (на несколько секунд).
     * Для живой:
     * Если нужно, меняем направление движения.
     * Сдвигаемся в новую точку по пути.
     * Если мы достигли цели, то обрабатываем это.
     * @param liveTime - время движения / жизни
     */
    move(liveTime: number): void {
        this.tryDie(liveTime);
        this.addResources(liveTime);
        this._clearFollowingAnts();

        if (this.isDeadState)
            return;

        if (this.isSearchState)
            this.tryNewDirection();

        let eps = this.isActiveSearchState ? this.size.x : Food.foodSize; // с какой точностью мы приближаемся к destination

        if (this.destination.isNearWith(this.position, eps / 2)) {
            this._destinationReached();
            return;
        }
        this.position = this.position.findPointOnLineTo(this.destination, liveTime * this.speed);
    }

    tryDie(liveTime: number): void {
        if (this.isDeadState || this.diffResources > liveTime)
            return;

        this.addResources(-5000);// время, которое показывается могилка - 5 sec.
        this.state = AntStatuses.dead;
    }

    /**
     * "Смотрим по сторонам" и если видим еду или слышим другого муравья, меняем конечную точку пути.
     */
    tryNewDirection(): void {
        let nearestVisibleFood = this.nearestFood,
            nearestAntToFollow = this._nearestAnt(nearestVisibleFood);

        if (!nearestVisibleFood && !nearestAntToFollow)
            return;

        let isGoToFood = nearestVisibleFood !== null;

        if(isGoToFood && nearestAntToFollow)
            isGoToFood = nearestVisibleFood.dist < nearestAntToFollow.dist;

        if (isGoToFood)
            this.food = nearestVisibleFood.object;
        else
            this.followAnt = nearestAntToFollow.object;
    }


    /**
     * находим ближайший объект и рассотние до него
     * @param list - список, из которого производится выборка
     * @param maxDist - радиус поиска
     */
    _nearestFromList(list: any[], maxDist: number): { dist: number, object: any } | null {
        if (!list.length)
            return null;

        let spacesTo = list.map(f => f.position.distTo(this.position)),
            minDistTo = Math.min(...spacesTo);

        if (minDistTo > maxDist)
            return null;

        let index = spacesTo.indexOf(minDistTo),
            object = list[index];

        return {
            dist: minDistTo,
            object: object
        }
    }

    /**
     * Ищем ближайшего муравья, которому нужна помощь и который не направляется к ближайшей еде данного муравья.
     * @param nearestFood - еда, к которой мы потенциально направляемся.
     */
    _nearestAnt(nearestFood: { dist: number, object: Food } | null): { dist: number, object: Ant } | null {
        if (this.isFoundState)
            return null;
        let list = App.ants.filter(f => f.isShareState && f !== this);
        if (nearestFood)
            list = list.filter(f => f.destination.distTo(nearestFood.object.position) > 0);

        return this._nearestFromList(list, Ant.antHearDist);
    }

    /**
     * оцищаем связь между муравьем и теми, которые за ним следуют
     */
    _clearFollowingAnts(): void {
        if (this.isFoundState)
            return;

        let followingAnts = App.ants.filter(f => f._followAnt === this && f !== this);

        for (let ant of followingAnts)
            ant.state = AntStatuses.search;

    }


    /**
     * При достижении конечной точки:
     * - либо берем случайным образом новую целевую точку,
     * - либо забираем еду и идем домой
     */
    _destinationReached(): void {
        if (this.isHomeState)
            this.storeFood();

        if (this.isActiveSearchState || this.isHomeState) {
            this.newSearchDirection();
            return;
        }

        let food = null;
        for (let f of App.foods) {
            if (this.position.isNearWith(f.position, Food.foodSize)) {
                food = f;
                break;
            }
        }
        if (!food) {
            this.newSearchDirection();
            return;
        }

        this._foodAmount = food.takeFood(Ant.maxWeight);
        this.state = AntStatuses.home;
    }

    /**
     * задаем новую точку конечного пути случайным образом
     */
    newSearchDirection() {
        let availablePos = App.randPosDiapasons()
        this.destination = Point.randomPoint(availablePos.x, availablePos.y);
        this.state = AntStatuses.search;
    }

    /**
     *  Если муравей умер с едой, то добавляем еду на землю.
     *  Подправляем параметры рисования
     */
    die(): void {
        this.rotateInfo = this.transformSettings;

        if (!this._foodAmount)
            return;

        let f = new Food(new Point(this.position.x + this.size.x, this.position.y + this.size.y), this._foodAmount);
        App.newFood(f);
        this._foodAmount = 0;
    }

    /**
     * Добавляем еду в муравейник и убираем со "спины" муравья
     */
    storeFood(): void {
        App.home.storeFood(this._foodAmount);
        this._foodAmount = 0;
    }
}
