import Point from "./Point";

export default class Displayed {
    static defaultImageSize = 15;

    _position: Point;
    
    _image: string;
    _size: Point = new Point(Displayed.defaultImageSize, Displayed.defaultImageSize);
    _extension: string = '.svg';
    _caption: string = '';


    constructor(img: string, position: Point) {
        this._position = position;
        this._image = img;
    }

    set position(position: Point){
        this._position = position;
    }

    get position():Point{
        return this._position;
    }
    
    set image(img: string){
        this._image = img;
    }

    set size(size: Point){
        this._size = size;
    }

    set extension(val: string){
        this._extension = val;
    }

    set imageCaption(str:string){
        this._caption = str;
    }

    draw(ctx:CanvasRenderingContext2D):void{
        if(!this._image)
            return;
        let img = new window.Image(), context = this;
        img.src = `./images/${this._image}${this._extension}`;
        img.onload = () => {
            ctx.drawImage(img, context.position.x, context.position.y, context._size.x, context._size.y);
        }
        if(!this._caption.length)
            return;
        ctx.fillStyle = "Gray";
        ctx.font = `${Math.max(Math.ceil(this._size.y/3), 15)}px serif`;
        ctx.fillText(this._caption, this.position.x + this._size.x, this.position.y);
    }
}