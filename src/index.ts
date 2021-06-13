import * as _ from 'lodash';
import App from "./scripts/App";
import "./styles/main.scss";

let canvas = document.createElement('canvas');
canvas.id = 'canvas';
document.body.append(canvas);

let app = new App({
    maxAntAge: 40,
    maxAntSpeed: 10,
    initialAntCount: 10,
    newAntsDueTime: 0.5,

    initialFoodCount: 5,
    newFoodDueTime: 0.5
});




