/**
 * Round2
 * @param {number} num
 * @returns {number}
 */
const round = (num: number = 0): number => Math.round((num + Number.EPSILON) * 100) / 100;

export default round;
