export interface loginData{
    identification: string,
    passwordHash: string
}

export interface scheduleDate{
    patientId: number,
    doctorId: number,
    dateTime: Date,
}