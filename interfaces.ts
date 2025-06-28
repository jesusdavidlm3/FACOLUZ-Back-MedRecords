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
    patientId: string,
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
}