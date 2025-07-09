export interface cancer{
    cancer: number,
    type: string,
    treatment: string,
    location: string,
    diagnoseYear: number
}

export interface pregnacy{
    menstruation: number,
    pregnacy: number,
    pregnacyTime: number,
    pregnacyControl: number
}

export interface ailments{
    ailments: number[],
    cardio: string | null,
    hematological: string | null,
    renal: string | null,
    neuro: string | null,
    hepatic: string | null
}

export interface physicalExamination{
    face: string,
    ganglios: string,
    atm: string,
    mascMuscles: string
}

export interface intraoralExamination{
    lips: string
    mucouse: string,
    toungue: string,
    mouthFloor: string,
    hardPalate: string,
    softPalate: string,
    spitGland: string
}

export interface gumEvaluation{
    gumColor: number,
    gumColorArea: number,
    gumColorLocation: number,
    gumColorAccentuated: string,
    gumEnlargement: number,
    gumEnlargementArea: number,
    gumEnlargementLocation: number,
    gumEnlargementAccentuated: string,
    gumConsistency: number,
    gumConsistencyLocation: number,
    gumConsistencyAccentuated: string,
    gumPosition: number,
    gumPositionLocation: number,
    gumPositionAccentuated: string,
    gumForm: number,
    gumFormLocation: number,
    gumFormAccentuated: string
}

export interface dentalDiagram{
    theeth: number[]
}

export interface childrenDentalDiagram{
    theeth: number[]
}