import Point from "./Point";
import {TransformSettings} from "./Settings";

export default class Displayed {
    static defaultImageSize = 30;
    static imagesToLoad: string[] = ['ant', 'signal', 'home', 'cherries', 'grapes', 'peach', 'apple', 'pineapple', 'watermelon'];
    static loadedImages: object[] = [];
    static loadedImagesCount: number = 0;

    static async loadImages(): Promise<any> {
        return new  Promise( (resolve, reject) => {
            for (let imgName of Displayed.imagesToLoad) {
                let img = new window.Image();
                img.src = `./images/${imgName}.svg`;
                img.onload = () => {
                    Displayed.loadedImagesCount++
                    if(Displayed.loadedImagesCount === Displayed.imagesToLoad.length)
                        resolve(true);
                };
                img.onerror = () => reject(new Error('could not load image'))
                Displayed.loadedImages.push(img);
            }
        });
    }

    static getImage(name: string): object {
        let index = Displayed.imagesToLoad.indexOf(name);
        if (index < 0)
            return null;
        return Displayed.loadedImages[index];
    }

    _position: Point;
    _transformSettings: TransformSettings = {
        rotateAngle: 0,
        isReflectHorizontal: false,
        isReflectVertical: false
    };

    _image: string;
    _size: Point = new Point(Displayed.defaultImageSize, Displayed.defaultImageSize);
    _caption: string = '';


    constructor(img: string, position: Point) {
        this._position = position;
        this._image = img;

    }

    set position(position: Point) {
        this._position = position;
    }

    get position(): Point {
        return this._position;
    }

    set image(img: string) {
        this._image = img;
    }

    set size(size: Point) {
        this._size = size;
    }

    get size(): Point {
        return this._size;
    }

    set rotateInfo(info: TransformSettings) {
        this._transformSettings = info;
    }

    get imageCaption(): string {
        return this._caption;
    }
    set imageCaption(str: string) {
        this._caption = str;
    }

    get isDefTransSet(): boolean {
        if (!this._transformSettings)
            return true;

        if (this._transformSettings.rotateAngle)
            return false;

        if (this._transformSettings.isReflectHorizontal)
            return false;

        return !this._transformSettings.isReflectVertical;

    }

    drawImage(ctx: CanvasRenderingContext2D, img: any): void {
        if (this.isDefTransSet) {
            ctx.drawImage(img, this.position.x, this.position.y, this._size.x, this._size.y);
            return;
        }
        let scale = new Point(this._transformSettings.isReflectHorizontal ? -1 : 1, this._transformSettings.isReflectVertical ? -1 : 1),
            x = this.position.x + this._size.x, y = this.position.y + this._size.y;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale.x, scale.y);
        ctx.rotate(this._transformSettings.rotateAngle);
        ctx.drawImage(img, -this._size.x, -this._size.y, this._size.x, this._size.y);
        ctx.restore();
    }

    drawCaption(ctx: CanvasRenderingContext2D): void {
        if (!this.imageCaption.length)
            return;

        ctx.fillStyle = "Gray";
        let fSize = Math.max(Math.ceil(this._size.y / 3), 15);
        ctx.font = `${fSize}px serif`;
        ctx.fillText(this.imageCaption, this.position.x + this._size.x, this.position.y + fSize);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        let img = Displayed.getImage(this._image);
        if (!img)
            return;

        this.drawImage(ctx, img);
        this.drawCaption(ctx);
    }
}