export function getAge(birthDate: Date){
    console.log(birthDate)
    const currentDate = new Date
    const currentYear = currentDate.getFullYear()
    const year = birthDate.getFullYear()

    const age = currentYear - year
    return age
}

export function dateToDb(rawDate: Date){
    const date = new Date(rawDate)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hour = date.getHours()
    const minutes = date.getMinutes()
    return `${year}-${month}-${day} ${hour}:${minutes}:00`
}