/**
 * 
 * @param {Date} birthDate 
 * @param {Date} currentDate 
 */
export function calcAge (birthDate, currentDate) {
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    const dayDifference = currentDate.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) age--;

    return age;
}
/**
 * 
 * @param {Date} birthDate 
 * @param {Date} currentDate 
 */
export function calcDaysUntilNextBirthday (birthDate, currentDate) {
    let nextBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

    if (currentDate > nextBirthday) {
        nextBirthday.setFullYear(currentDate.getFullYear() + 1);
    }

    const diffInMs = nextBirthday - currentDate;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays;
}