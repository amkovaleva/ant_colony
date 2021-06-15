type Settings = {
    maxAntAge: number;
    maxAntSpeed: number;
    antVisibleDist: number;
    maxAntWeight: number;

    initialAntCount: number;
    newAntsDueTime: number;

    initialFoodCount: number;
    newFoodDueTime: number;
}

type TransformSettings = {
    rotateAngle: number;
    isReflectHorizontal: boolean;
}
type AppTimerType = 'move' | 'food' | 'ant';
const AppTimerTypes = {move: 'move', food: 'food', ant: 'ant' };
type AppTimer = {
    type: AppTimerType;
    value: number;
}

type AntStatus = 'search' | 'take' | 'home'| 'dead';
const AntStatuses = {search: 'search', take: 'take', home: 'home' , dead: 'dead' };

const getTime = (min:number, sec:number = 0, ms:number = 0) => {
    let mSec = ms;
    mSec += sec * 1000;
    mSec += min * 1000 * 60;
    return mSec;
}

export {Settings, TransformSettings, AntStatus, AntStatuses, getTime, AppTimerType, AppTimer, AppTimerTypes};