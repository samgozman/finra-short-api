/**
 * Round2
 * @param {number} num 
 * @returns {number}
 */
const round = (num = 0) => Math.round((num + Number.EPSILON) * 100) / 100

export default round