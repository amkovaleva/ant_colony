import Displayed from "./Displayed";
import Point from "./Point";

export default class Mortal extends Displayed {

    _isExists: boolean = true;

    constructor(position: Point, image: string, resources: number, maxResources: number) {
        super(image, position);
        this._resources = resources;
        this._maxResources = maxResources;
    }

    _resources: number;

    get resources(): number {
        return this._resources;
    }

    set resources(resources: number) {
        this._resources = resources;

        if (this._resources >= this._maxResources)
            this._isExists = false;
    }

    _maxResources: number;

    get maxResources(): number {
        return this._maxResources;
    }

    get diffResources(): number {
        return this._maxResources - this._resources;
    }

    get exists(): boolean {
        return this._isExists;
    }

    spendResources(resources: number) {
        this.resources += resources;
    }
}
