import App from "../App";

type TransformSettings = {
    rotateAngle: number;
    isReflectHorizontal: boolean;
}
type AppTimerType = 'move' | 'food' | 'ant' | 'home';
const AppTimerTypes = {move: 'move', food: 'food', ant: 'ant', home: 'home'};
type AppTimer = {
    type: AppTimerType;
    value: number;
}

type AntStatus = 'search' | 'found' | 'follow' | 'home' | 'dead';
const AntStatuses = {search: 'search', found: 'found', follow: 'follow', home: 'home', dead: 'dead'};


/**
 * загружаем сохраненные настройки или переходим на страницу настроек.
 */
let tryGetSettings = ():Map<string, any> =>{
    let settingsStr = localStorage.getItem('ant_settings');
    if(!settingsStr) {
        let settingsLink = document.getElementsByTagName('a')[0];
        location.href =  settingsLink.href;
    }
    return new Map(JSON.parse(settingsStr));
}
let restartApp = () => {
    let popUp = document.getElementById('final');
    popUp.style.display = 'none';
    new App(tryGetSettings());
};

export { TransformSettings, AntStatus, AntStatuses, AppTimerType, AppTimer, AppTimerTypes, restartApp};