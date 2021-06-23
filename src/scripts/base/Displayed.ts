import Point from "./Point";
import {TransformSettings} from "./Settings";

export default class Displayed {
    static defaultImageSize = 30;
    static imagesToLoad: string[] = ['ant', 'ant-home', 'ant-dead', 'ant-found', 'ant-follow', 'home', 'cherries', 'grapes', 'peach', 'apple', 'pineapple', 'watermelon'];
    static loadedImages: object[] = [];
    static loadedImagesCount: number = 0;
    _transformSettings: TransformSettings = {
        rotateAngle: 0,
        isReflectHorizontal: false
    };
    _caption: string = '';

    constructor(img: string, position: Point) {
        this._position = position;
        this._image = img;

    }

    _position: Point;

    get position(): Point {
        return this._position;
    }

    set position(position: Point) {
        this._position = position;
    }

    _image: string;

    set image(img: string) {
        this._image = img;
    }

    _size: Point = new Point(Displayed.defaultImageSize, Displayed.defaultImageSize);

    get size(): Point {
        return this._size;
    }

    set size(size: Point) {
        this._size = size;
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

    /**
     * Метод для предзагрузки изображений.
     * Алгоритм начинает работать после того, как все необходимые изображения загружены на страницу.
     * Иначе картинки не всегда отрысовываются.
     */
    static async loadImages(): Promise<any> {
        return new Promise((resolve, reject) => {
            for (let imgName of Displayed.imagesToLoad) {
                let img = new window.Image();
                img.src = `./images/${imgName}.svg`;
                img.onload = () => {
                    Displayed.loadedImagesCount++
                    if (Displayed.loadedImagesCount === Displayed.imagesToLoad.length)
                        resolve(true);
                };
                img.onerror = () => reject(new Error('could not load image'))
                Displayed.loadedImages.push(img);
            }
        });
    }

    /**
     * Поиск нужной картинки среди загруженных.
     * @param name - имя картинки
     */
    static getImage(name: string): object {
        let index = Displayed.imagesToLoad.indexOf(name);
        if (index < 0)
            return null;
        return Displayed.loadedImages[index];
    }

    /**
     * Отрисовка изображения с учетом трансформаций.
     * position является центром картинки.
     * @param ctx - контекст canvas
     * @param img - картинка (html элемент)
     */
    drawImage(ctx: CanvasRenderingContext2D, img: any): void {
        let newX = this.position.x + this._size.x / 2, newY = this.position.y + this._size.y / 2;

        let scale = new Point(this._transformSettings.isReflectHorizontal ? -1 : 1, 1);
        ctx.save();
        ctx.translate(newX, newY);
        ctx.scale(scale.x, scale.y);
        ctx.rotate(this._transformSettings.rotateAngle);
        ctx.drawImage(img, 0, 0, -this._size.x, -this._size.y);
        ctx.restore();
    }

    /**
     * Отрисовка подписи к картинке.
     * Пока это только число - кол-во еды.
     * @param ctx - контекст canvas
     */
    drawCaption(ctx: CanvasRenderingContext2D): void {
        if (!this.imageCaption.length || +this.imageCaption <= 0)
            return;

        ctx.fillStyle = "Gray";
        let fontSize = Math.max(Math.ceil(this._size.y / 3), 15);
        ctx.font = `${fontSize}px serif`;
        ctx.fillText(this.imageCaption, this.position.x + this._size.x / 2, this.position.y - this._size.y / 2 + fontSize);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        let img = Displayed.getImage(this._image);
        if (!img)
            return;

        this.drawImage(ctx, img);
        this.drawCaption(ctx);
    }
}