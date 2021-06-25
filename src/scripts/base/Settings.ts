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

const getTime = (min: number, sec: number = 0, ms: number = 0) => {
    let mSec = ms;
    mSec += sec * 1000;
    mSec += min * 1000 * 60;
    return mSec;
}

export { TransformSettings, AntStatus, AntStatuses, getTime, AppTimerType, AppTimer, AppTimerTypes};