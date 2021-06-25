import Displayed from "./base/Displayed";
import Point from "./base/Point";
import Food from "./Food";
import Ant from "./Ant";
import {AppTimer, AppTimerType, AppTimerTypes, getTime} from "./base/Settings";
import Home from "./Home";

export default class App {

    static newAntsDueTime: number = getTime(0, 10);
    static newFoodDueTime: number = getTime(0, 10);

    static canvas: HTMLCanvasElement;
    static canvasContext: CanvasRenderingContext2D;

    static home: Home;
    static foods: Food[] = [];
    static ants: Ant[] = [];
    static timers: AppTimer[] = [];

    constructor(settings: Map<string, any>) {

        Ant.maxAge =  +settings.get('maxAntAge');
        Ant.maxSpeed = +settings.get('maxAntSpeed');
        Ant.maxWeight = +settings.get('maxAntWeight');

        Ant.antVisibleDist = +settings.get('antVisibleDist');
        Ant.antHearDist = +settings.get('antHearDist');

        Home.eatFoodPerTime = +settings.get('eatFoodPerTime');

        App.newAntsDueTime = +settings.get('newAntsDueTime');
        App.newFoodDueTime = +settings.get('newFoodDueTime');

        App.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        App.canvasContext = App.canvas.getContext('2d');

        App.canvas.width = window.innerWidth;
        App.canvas.height = window.innerHeight;

        App.initialFill( +settings.get('initialFoodCount'),  +settings.get('initialAntCount'));
    }

    static initialFill(foodCount:number, antCount:number): void {
        App.home = new Home(new Point(25, 25));
        App.home.size = new Point(50, 50);

        let needGenerate = foodCount + antCount,
            availablePos = App.randPosDiapasons();
        /**
         * сначала еду - потом муравьев
         */
        while (needGenerate > 0) {
            let isFoodGeneration = needGenerate > antCount,
                point = Point.randomPoint(availablePos.x, availablePos.y),
                resource = Point.randomNumber(isFoodGeneration ? Food.maxAmount : Ant.maxAge, 1);

            if (isFoodGeneration) {
                App.foods.push(new Food(point, resource));
                needGenerate--;
                continue;
            }

            this.ants.push(new Ant(resource, point, Point.randomPoint(availablePos.x, availablePos.y)));
            needGenerate--;
        }

        Object.values(AppTimerTypes).forEach(type => {
            App.timers.push({type: <AppTimerType>type, value: new Date().getTime()});
        });

        App.draw();
    }

    static get width(): number {
        if (!this.canvas)
            return 0;
        return this.canvas.width;
    }

    static get height(): number {
        if (!this.canvas)
            return 0;
        return this.canvas.height;
    }

    static timer(name: string): AppTimer {
        return App.timers.find(t => t.type === <AppTimerType>name)
    }

    static randPosDiapasons(): Point {
        return new Point(
            App.width - Math.max(Food.foodSize, Displayed.defaultImageSize) - 20,
            App.height - Math.max(Food.foodSize, Displayed.defaultImageSize) - 20
        );
    }


    static newFood(f: Food): void {
        App.foods.push(f);
    }

    /**
     * У нас два таймера, которые нужно обновлять при отрисовке.
     * Таймер для движения муравьев: Вначале двигаются муравьи, нашедшие еду. Затем остальные.
     * Таймер траты еды дома: тратим еду в муравейнике
     */
    static move(): void {
        let newTime = new Date().getTime();

        [AppTimerTypes.move, AppTimerTypes.home].forEach(timerType =>{
            let timer = App.timer(timerType),
                timeDiff = newTime - timer.value;

            if(timerType === AppTimerTypes.home){
                let needEatFood  = Math.floor(timeDiff / Home.eatFoodPerTime );
                App.home.addResources(-Math.min(needEatFood, App.home.resources));
                timer.value += Home.eatFoodPerTime * needEatFood;
                return;
            }

            for (let ant of App.ants.filter(a => a.isFoundState))
                ant.move(timeDiff);

            for (let ant of App.ants.filter(a => !a.isFoundState))
                ant.move(timeDiff);

            timer.value = newTime;

        });
    }

    /**
     * убираем со страницы мертвых муравьев и закончившуюся еду
     */
    static clear(): void {
        App.foods = App.foods.filter(f => f.exists);
        App.ants = App.ants.filter(f => f.exists);
    }

    /**
     * По мере необходимости добавляем на страницу новых мыравьев и еду.
     * Новые муравьи не появляются если в муравейнике нет еды.
     * Муравьи идут из муравейника в случайном направлении.
     * Еда случайной величины располагается в случайном месте.
     */
    static add(): void {
        [AppTimerTypes.ant, AppTimerTypes.food].forEach(timerType => {

            let isAnt = timerType === AppTimerTypes.ant;
            if(isAnt && App.home.isColonyHungry)
                return;

            let nowTime = new Date().getTime(),
                timer = App.timer(timerType),
                timeToSpend = isAnt ? App.newAntsDueTime : App.newFoodDueTime,
                availablePos = App.randPosDiapasons(),
                count = Math.floor((nowTime - timer.value) / timeToSpend);

            while (count > 0) {
                let position = Point.randomPoint(availablePos.x, availablePos.y);

                if (isAnt)
                    App.ants.push(new Ant(0, App.home.position, position));
                 else
                    App.foods.push(new Food(position, Point.randomNumber(Food.maxAmount, 1)));

                count--;
                timer.value += timeToSpend;
            }
        });
    }

    /**
     * Перерисовываем.
     * Планируем слудующую итерауию только в случае, когда муравейник exists
     */
    static draw(): void {
        App.clear();
        App.add();
        App.move();

        let ctx = App.canvasContext;

        ctx.clearRect(0, 0, App.canvas.width, App.canvas.height);
        App.home.imageCaption = `${App.home.resources}`;
        App.home.draw(ctx);
        App.foods.forEach(f => f.draw(ctx));
        App.ants.forEach(f => f.draw(ctx));

        if(App.home.exists)
            window.requestAnimationFrame(App.draw);
    }
}
