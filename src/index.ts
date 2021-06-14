import * as _ from 'lodash';
import App from "./scripts/App";
import "./styles/main.scss";
import Displayed from "./scripts/base/Displayed";

let canvas = document.createElement('canvas');
canvas.id = 'canvas';
document.body.append(canvas);

let imagesLoad =  Displayed.loadImages();
imagesLoad.then( res => {
    let app = new App({
        maxAntAge: 60 * 10000, // минута
        maxAntSpeed: 1,
        antVisibleDist: 150,
        maxAntWeight: 3,
        initialAntCount: 1,
        newAntsDueTime: 0.5,

        initialFoodCount: 5,
        newFoodDueTime: 0.5
    });
})





