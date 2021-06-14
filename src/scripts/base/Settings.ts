type Settings = {
    maxAntAge: number;
    maxAntSpeed: number;

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

export {Settings, TransformSettings};