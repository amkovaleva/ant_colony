import App from "./scripts/App";
import "./styles/main.scss";
import Displayed from "./scripts/base/Displayed";


let settingsStr = localStorage.getItem('ant_settings');
if(!settingsStr) {
    let settingsLink = document.getElementsByTagName('a')[0];
    location.href =  settingsLink.href;
}
let settings = new Map(JSON.parse(settingsStr));

let imagesLoad = Displayed.loadImages();
imagesLoad.then(() => {
    new App(<Map<string, any>>settings);
});





