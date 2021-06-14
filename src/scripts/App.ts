import Displayed from "./base/Displayed";
import Point from "./base/Point";
import Food from "./Food";
import Ant from "./Ant";
import {Settings} from "./base/Settings";
import Home from "./Home";

export default class App {
    static settings: Settings;
    static canvas: HTMLCanvasElement;
    static canvasContext: CanvasRenderingContext2D;

    static home: Home;
    static foods: Food[] = [];
    static ants: Ant[] = [];
    static time: number;

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
        App.home = new Home(Point.zero);
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

        App.time = new Date().getTime();
        App.draw();
    }

    static newFood(f:Food): void {
        App.foods.push(f);
    }

    static move(): void {
        let newTime = new Date().getTime(),
            timeDiff = newTime - App.time;

        for(let ant of App.ants){
            ant.move(timeDiff);
        }
        App.time = newTime;
    }

    static clear():void{
        App.foods = App.foods.filter(f => f.exists);
        App.ants = App.ants.filter(f => f.exists );
    }

    static draw():void {
        App.clear();
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
