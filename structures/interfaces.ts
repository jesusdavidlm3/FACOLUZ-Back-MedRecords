import * as jsonmodels from "./jsonModels.ts"

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
    currentDisease: string | null,
    treatment: string | null,
    bifosfonato: number,
    bifosfonadoDescription: string | null,
    reactionToAnesthesia: number,
    reactionToAnesthesiaDesc: string | null,
    alergy: number,
    alergyDescription: string | null,
    cancer: jsonmodels.cancer,
    pregnacy: jsonmodels.pregnacy | null,
    ailments: jsonmodels.ailments,
    bloodType: number,
    proneToBleeding: number,
    height: number,
    weight: number,
    complementaryTest: string | null,
    sys: number,
    dia: number,
    bpm: number,
    temp: number,
    physicalExamination: jsonmodels.physicalExamination,
    intraoralExamination: jsonmodels.intraoralExamination,
    gumEvaluation: jsonmodels.gumEvaluation,
    dentalDiagram: jsonmodels.dentalDiagram | null,
    childrenDentalDiagram: jsonmodels.childrenDentalDiagram | null,
    forecast: string | null,
    observations: string | null,
}