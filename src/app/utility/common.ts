export function getCardColor(card: number) {
    if (card === 53 || card === 52) {
        return 'wildcard';
    }
    if (card > 38) {
        return 'blue';
    }
    if (card > 25) {
        return 'green';
    }
    if (card > 12) {
        return 'red';
    }
    return 'yellow';
}