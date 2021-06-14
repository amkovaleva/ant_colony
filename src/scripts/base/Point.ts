export default class Point {
    x: number;
    y: number;


    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }


    static get zero():Point{
        return new Point(0, 0);
    }

    /**
     * Стучайное значение в промежутке от min до max
     * @param max - максимальное возможное значение
     * @param min - минимальное возможное значение. По умолчанию = 0
     */
    static randomNumber(max:number, min:number = 0):number{
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    /**
     * Возвращает стучайную точку с координатами от 50 до maxX | maxY
     * @param maxX - Максимальное значение координаты X
     * @param maxY - Максимальное значение координаты Y
     */
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
     * Определяет, находится ли точка в eps окрестности данной
     * @param point точка
     * @param eps окрестность
     */
    isNearWith(point: Point, eps:Point): boolean{
        return Math.abs(point.x - this.x) <= eps.x && Math.abs(point.y - this.y) <= eps.y;
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
     * @param path - величина, но которую нужно ствинуться
     * @param isPathByLine - индикатор того, в какую сторону откладывается path.
     * По умолчанию (true) -  величина сдвига задается по прямой до конечной точки.
     * Если false, то path - это величина сдвига по горизонтали
     */
    findPointOnLineTo(point: Point, path:number, isPathByLine:boolean = true): Point{

        let diff = this.diffFrom(point),
            dist = this.distTo(point);

        if(dist < 1)
            return point;

        let ratio = (isPathByLine ? dist : diff.x) / path;

        return new Point(
            this.x + diff.x / ratio,
            this.y +  diff.y / ratio
        )
    }

    /**
     * возвращает true, если текущая точка правее point.
     * @param point - точка, с которой мы сравниваем
     */
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
