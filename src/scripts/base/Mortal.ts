import Displayed from "./Displayed";
import Point from "./Point";

export default class Mortal extends Displayed{

    _isExists: boolean = true;
    _resources: number;
    _maxResources: number;

    constructor(position:Point, image: string, resources:number, maxResources: number) {
        super(image, position);
        this._resources = resources;
        this._maxResources = maxResources;
    }

    set resources(resources:number){
        this._resources = resources;

        if(this._resources >= this._maxResources)
            this._isExists = false;
    }

    get resources():number{
        return this._resources;
    }

    get maxResources():number{
        return this._maxResources;
    }

    get diffResources():number{
        return this._maxResources - this._resources;
    }

    get exists():boolean{
        return this._isExists;
    }

    spendResources(resources: number){
        this.resources += resources;
    }
}
