export function shuffleElementsInArray(array) {
    return array.sort(() => Math.random() - 0.5)
}