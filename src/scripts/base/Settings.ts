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
    isReflectVertical: boolean;
}
type AntStatus = 'search' | 'take' | 'home';

const AntStatuses = {search: 'search', take: 'take', home: 'home' };

export {Settings, TransformSettings, AntStatus, AntStatuses};