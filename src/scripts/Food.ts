import Point from "./base/Point";
import Mortal from "./base/Mortal";

export default class Food extends Mortal{
    static foodTypes = [
        {amount: 1, img: 'cherries'}, {amount: 3, img: 'grapes'},
        {amount: 5, img: 'peach'}, {amount: 8, img: 'apple'},
        {amount: 13, img: 'pineapple'}, {amount: 20, img: 'watermelon'}
    ];

    static get maxAmount (): number{
        return Math.max(...Food.foodTypes.map(t => t.amount));
    }

    static foodSize = 30;

    constructor(position: Point, amount: number) {
        super(position, '', 0, amount);
        this.updateType();
    }

    updateType():void{
        for (let entry of Food.foodTypes) {
            if(this.diffResources > entry.amount)
                continue;
            this.image = entry.img;
            this.imageCaption = `${this.diffResources}`;
            this.size = new Point(Food.foodSize, Food.foodSize);
            return;
        }
    }

    takeFood(wantedAmount: number): number{
        let take = Math.min(this.diffResources, wantedAmount);
        if(!take)
            return 0;

        this.spendResources(take)
        this.updateType();
        return take;
    }

}
