export default class Point {
    x: number;
    y: number;


    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static randomNumber(max:number):number{
        return Math.ceil(Math.random() * max);
    }

    static randomPoint(maxX:number, maxY:number):Point{
        return new Point(
            Point.randomNumber(maxX),
            Point.randomNumber(maxY)
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
}
