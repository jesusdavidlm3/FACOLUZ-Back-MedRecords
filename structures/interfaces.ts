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
    currentDisease: string | null,
    treatment: string | null,
    bifosfonato: number,
    bifosfonadoDescription: string | null,
    reactionToAnesthesia: number,
    reactionToAnesthesiaDesc: string | null,
    alergy: number,
    alergyDescription: string | null,
    cancer: JSON,
    pregnacy: JSON | null,
    ailments: JSON,
    bloodType: number,
    proneToBleeding: number,
    height: number,
    weight: number,
    complementaryTest: string | null,
    sys: number,
    dia: number,
    bpm: number,
    temp: number,
    physicalExamination: JSON,
    intraoralExamination: JSON,
    gumEvaluation: JSON,
    dentalDiagram: JSON | null,
    childrenDentalDiagram: JSON | null,
    forecast: string | null,
    observations: string | null,
}

export interface dentalDiagram{
    theeth: number[]
}

export interface childrenDentalDiagram{
    theeth: number[]
}