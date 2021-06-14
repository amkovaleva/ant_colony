import Displayed from "./base/Displayed";
import Point from "./base/Point";
import Food from "./Food";
import Ant from "./Ant";
import Movable from "./base/Movable";
import {Settings} from "./base/Settings";

export default class App {
    _settings: Settings;
    _canvas: HTMLCanvasElement;
    _canvasContext: CanvasRenderingContext2D;

    _home: Displayed;
    _foods: Food[] = [];
    _ants: Ant[] = [];

    constructor(settings: Settings) {
        this._settings = settings;
        Ant.maxAge = settings.maxAntAge;
        Movable.maxSpeed = settings.maxAntSpeed;

        window.addEventListener('resize', this.resize, true);

        this.init();
    }

    resize():void{
        if(!this._canvas)
            return;

        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
    }

    get width(): number {
        if (!this._canvas)
            return 0;
        return this._canvas.width;
    }

    get height(): number {
        if (!this._canvas)
            return 0;
        return this._canvas.height;
    }

    init(): void {
        this._canvas = <HTMLCanvasElement>document.getElementById('canvas');
        this._canvasContext = this._canvas.getContext('2d');

        this.resize();

        this._home = new Displayed('home', new Point(0, 0))
        this._home.size = new Point(50, 50);

        let needGenerate = this._settings.initialFoodCount + this._settings.initialAntCount,
            width = this.width - Math.max(Food.foodSize, Displayed.defaultImageSize) - 20, height = this.height - Math.max(Food.foodSize, Displayed.defaultImageSize) - 20;
        /**
         * сначала еду - потом муравьев
         */
        while (needGenerate > 0) {
            let isFoodGeneration = needGenerate > this._settings.initialAntCount,
                point = Point.randomPoint(width, height),
                resource = Point.randomNumber(isFoodGeneration ? Food.maxAmount : Ant.maxAge);

            if (isFoodGeneration) {
                this._foods.push(new Food(point, resource));
                needGenerate--;
                continue;
            }

            this._ants.push(new Ant(resource, point, Point.randomNumber(Movable.maxSpeed),
                Point.randomPoint(width, height)));
            needGenerate--;
        }

        this.draw();
    }

    move(): void {

    }

    async draw(): Promise<any> {
        this.move();
        let ctx = this._canvasContext;

        await this._home.draw(ctx);
        this._foods.forEach(f => f.draw(ctx));
        for(let ant of this._ants){
            await ant.draw(ctx);

        }


        //window.requestAnimationFrame(this.draw);
    }
}
