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
type AntStatus = 'search' | 'take' | 'home'| 'dead';

const AntStatuses = {search: 'search', take: 'take', home: 'home' , dead: 'dead' };

export {Settings, TransformSettings, AntStatus, AntStatuses};