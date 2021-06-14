import Point from "./Point";
import {TransformSettings} from "./Settings";

export default class Displayed {
    static defaultImageSize = 30;

    _position: Point;
    _transformSettings: TransformSettings = {
        rotateAngle: 0,
        isReflectHorizontal: false,
        isReflectVertical: false
    };

    _image: string;
    _size: Point = new Point(Displayed.defaultImageSize, Displayed.defaultImageSize);
    _extension: string = '.svg';
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

    set rotateInfo(info: TransformSettings) {
        this._transformSettings = info;
    }

    set imageCaption(str: string) {
        this._caption = str;
    }

    get isDefTransSet(): boolean {
        if(!this._transformSettings)
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
        console.log('drawImage ', this._transformSettings);
        let scale = new Point(this._transformSettings.isReflectHorizontal ? -1 : 1, this._transformSettings.isReflectVertical ? -1 : 1),
            x = this.position.x + this._size.x, y = this.position.y + this._size.y;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale.x, scale.y);
        ctx.rotate( this._transformSettings.rotateAngle);
        ctx.drawImage(img, -this._size.x, -this._size.y, this._size.x, this._size.y);
        ctx.restore();
    }

    drawCaption(ctx: CanvasRenderingContext2D): void {
        if (!this._caption.length)
            return;

        ctx.fillStyle = "Gray";
        ctx.font = `${Math.max(Math.ceil(this._size.y / 3), 15)}px serif`;
        ctx.fillText(this._caption, this.position.x + this._size.x, this.position.y);
    }

    draw(ctx: CanvasRenderingContext2D): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let img = new window.Image(), context = this;
            img.src = `./images/${this._image}${this._extension}`;
            img.onload = () => {
                context.drawImage(ctx, img);
                context.drawCaption(ctx);
                resolve(true);
            };
            img.onerror = reject;
        });
    }
}