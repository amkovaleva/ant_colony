import App from "./scripts/App";
import "./styles/main.scss";
import Displayed from "./scripts/base/Displayed";
import {getTime} from "./scripts/base/Settings";


let imagesLoad = Displayed.loadImages();
imagesLoad.then(() => {
    new App({
        maxAntAge: getTime(1),
        maxAntSpeed: 0.1,
        antVisibleDist: 150,
        maxAntWeight: 3,
        initialAntCount: 10,
        newAntsDueTime: getTime(0, 20),
        eatFoodPerTime: getTime(0, 1),

        initialFoodCount: 10,
        newFoodDueTime: getTime(1)
    });
})





