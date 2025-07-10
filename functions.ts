export function getAge(birthDate: Date){
    const currentDate = new Date
    const currentYear = currentDate.getFullYear()
    const year = birthDate.getFullYear()

    const age = currentYear - year
    return age
}