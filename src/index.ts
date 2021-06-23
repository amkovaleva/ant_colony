import App from "./scripts/App";
import "./styles/main.scss";
import Displayed from "./scripts/base/Displayed";
import {getTime} from "./scripts/base/Settings";

let canvas = document.createElement('canvas');
canvas.id = 'canvas';
document.body.append(canvas);

let imagesLoad = Displayed.loadImages();
imagesLoad.then(res => {
    let app = new App({
        maxAntAge: getTime(100), // минута
        maxAntSpeed: 0.1,
        antVisibleDist: 150,
        maxAntWeight: 3,
        initialAntCount: 10,
        newAntsDueTime: getTime(20, 0),

        initialFoodCount: 10,
        newFoodDueTime: getTime(0, 10)
    });
})





