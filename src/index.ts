import "./styles/main.scss";
import Displayed from "./scripts/base/Displayed";
import {restartApp} from "./scripts/base/Settings";

/**
 * Ждем пока загрузятся все нужные для отрисовки изображения и запускаем приложение
 */
let imagesLoad = Displayed.loadImages();
imagesLoad.then(() => {
    restartApp();
});





