import Displayed from "./base/Displayed";
import Point from "./base/Point";
import Food from "./Food";
import Ant from "./Ant";
import {AppTimer, AppTimerType, AppTimerTypes, Settings} from "./base/Settings";
import Home from "./Home";

export default class App {
    static settings: Settings;
    static canvas: HTMLCanvasElement;
    static canvasContext: CanvasRenderingContext2D;

    static home: Home;
    static foods: Food[] = [];
    static ants: Ant[] = [];
    static timers: AppTimer[] = [];
    static timer(name: string): AppTimer {
        return App.timers.find(t => t.type === <AppTimerType>name)
    }

    constructor(settings: Settings) {
        App.settings = settings;
        Ant.maxAge = settings.maxAntAge;
        Ant.maxSpeed = settings.maxAntSpeed;
        Ant.maxWeight = settings.maxAntWeight;
        Ant.antVisibleDist = settings.antVisibleDist;
        App.canvas = <HTMLCanvasElement>document.getElementById('canvas');
        App.canvasContext = App.canvas.getContext('2d');

        App.canvas.width = window.innerWidth;
        App.canvas.height = window.innerHeight;

        App.initialFill();
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

    static randPosDiapasons():Point{
        return new Point(
            App.width - Math.max(Food.foodSize, Displayed.defaultImageSize) - 20,
            App.height - Math.max(Food.foodSize, Displayed.defaultImageSize) - 20
        );
    }

    static initialFill():void{
        App.home = new Home(new Point(25, 25));
        App.home.size = new Point(50, 50);

        let needGenerate = App.settings.initialFoodCount + App.settings.initialAntCount,
            availablePos = App.randPosDiapasons();
        /**
         * сначала еду - потом муравьев
         */
        while (needGenerate > 0) {
            let isFoodGeneration = needGenerate > App.settings.initialAntCount,
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

        Object.values(AppTimerTypes).forEach(type =>{
            App.timers.push({type: <AppTimerType>type, value: new Date().getTime()});
        });

        App.draw();
    }

    static newFood(f:Food): void {
        App.foods.push(f);
    }

    static move(): void {
        let newTime = new Date().getTime(), timer = App.timer(AppTimerTypes.move),
            timeDiff = newTime - timer.value;

        for(let ant of App.ants){
            ant.move(timeDiff);
        }
        timer.value = newTime;
    }

    static clear():void{
        App.foods = App.foods.filter(f => f.exists);
        App.ants = App.ants.filter(f => f.exists );
    }

    static add():void{
        App.timers.forEach(t=> {
            if(t.type === <AppTimerType>AppTimerTypes.move)
                return;

            let isAnt = t.type === <AppTimerType>AppTimerTypes.ant, nowTime = new Date().getTime(), timePast = nowTime - t.value,
                needPast = isAnt ? App.settings.newAntsDueTime :  App.settings.newFoodDueTime,
                availablePos = App.randPosDiapasons(), count = Math.ceil(timePast / needPast);

            while(count > 0){
                if(isAnt){
                    App.ants.push(new Ant(0, App.home.position, Point.randomPoint(availablePos.x, availablePos.y)) );
                }else{
                    App.foods.push(new Food(Point.randomPoint(availablePos.x, availablePos.y), Point.randomNumber(Food.maxAmount, 1)));
                }
                count--;
                t.value += needPast;
            }
        });
    }

    static draw():void {
        App.clear();
        App.add();
        App.move();
        let ctx = App.canvasContext;

        ctx.clearRect(0,0,App.canvas.width, App.canvas.height);
        App.home.imageCaption = `${Home.foodAmount}`;
        App.home.draw(ctx);
        App.foods.forEach(f => f.draw(ctx));
        App.ants.forEach(f => f.draw(ctx));

        window.requestAnimationFrame(App.draw);
    }
}
