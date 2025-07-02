export interface loginData{
    identification: string,
    passwordHash: string
}

export interface scheduleDate{
    patientId: number,
    doctorId: number,
    dateTime: Date,
}

export interface dateData{
    dateId: string,
    consultationReason: string,
    currentDisease: string,
    dateTime: Date,
    treatment: string,
    systolicPresure: number,
    diastolicPresure: number,
    BPM: number,
    fisicConsistency: string,
    physicalExamination: JSON,
    intraoralExamination: JSON,
    gumEvaluation: JSON,
    dentalDiagram: JSON,
    childrenDentalDiagram: JSON,
    individualForecast: string,
    generalForecast: string,
    physicalTest: string,
    oclusionExamination: JSON,
    complementaryTest: JSON,
    generalObservations: string,
    pulpVitality: JSON,
    pregnacy: boolean,
    reactionToAnesthesia: boolean,
    reactionToAnesthesiaDesc: string
}

export interface dentalDiagram{
    theeth: number[]
}

export interface childrenDentalDiagram{
    theeth: number[]
}