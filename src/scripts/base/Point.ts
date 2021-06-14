export default class Point {
    x: number;
    y: number;


    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static randomNumber(max:number, min:number = 0):number{
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    static randomPoint(maxX:number, maxY:number):Point{
        let spaceLeft = 50;

        return new Point(
            Point.randomNumber(maxX, spaceLeft),
            Point.randomNumber(maxY, spaceLeft)
        )
    }
    /**
     * Возращает точку = point - this
     * @param point - точка, разницу с которой вычисляем.
     */
    diffFrom(point: Point): Point{
        return new Point(point.x - this.x, point.y - this.y);
    }

    /**
     * рассотяние от данной точки до конечной
     * @param point - конечная точка
     */
    distTo(point: Point): number{
        let diff = this.diffFrom(point);
        return Math.round(Math.sqrt(diff.x ** 2 + diff.y ** 2));
    }

    /**
     * Находит координаты точки, в которую нужно сдвинуться.
     * @param point - конечная точка, к которой по прямой приближаемся
     * @param path - величина, ко которую нужно ствинуться
     * @param isPathByLine - индикатор того, в какую сторону откладывается path.
     * По умолчанию (true) -  величина сдвига задается по прямой до конечной точки.
     * Если false, то path - это величина сдвига по горизонтали
     */
    findPointOnLineTo(point: Point, path:number, isPathByLine:boolean = true): Point{

        let diff = this.diffFrom(point),
            dist = this.distTo(point);

        if(dist === 0)
            return new Point(this.x, this.y);

        let ratio = (isPathByLine ? dist : diff.x) / path;

        return new Point(
            this.x +  Math.round(diff.x / ratio),
            this.y +  Math.round(diff.y / ratio)
        )
    }

    isLowerThen(point: Point):boolean{
        return point.y < this.y;
    }

    isRighterThen(point: Point):boolean{
        return point.x > this.x;
    }

    /**
     * Возвращает угол в радианах между тремя точками. this - точка в углу.
     * @param from Точка от которой "начинается" угол
     * @param to Точка, которой "заканчиваеися" угол
     */
    angleFromTo(from: Point, to: Point):number{
        let distFrom = this.distTo(from), dostTo = this.distTo(to),
            vectorFrom = this.diffFrom(from), vectorTo = this.diffFrom(to);

        return Math.acos((vectorFrom.x * vectorTo.x + vectorFrom.y * vectorTo.y) / (distFrom * dostTo) );
    }
}
