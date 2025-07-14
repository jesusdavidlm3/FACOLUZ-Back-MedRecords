export function getAge(birthDate: Date){
    console.log(birthDate)
    const currentDate = new Date
    const currentYear = currentDate.getFullYear()
    const year = birthDate.getFullYear()

    const age = currentYear - year
    return age
}