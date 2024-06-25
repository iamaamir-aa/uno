export class Player {
    name: string;
    cards: number[];
    constructor(name: string, cards: number[]) {
        this.name = name;
        this.cards = cards;
    }
    playCard(card: number) {
        const index = this.cards.indexOf(card);
        if (index > -1) {
            this.cards.splice(index, 1);
        }
    }
    drawCard(card: number) {
        this.cards.push(card);
    }
    drawNCards(cards: number[]) {
        this.cards.push(...cards);
    }
    getCardCount() {
        return this.cards.length;
    }
    getCards() {
        return this.cards;
    }
    getCard(index: number) {
        return this.cards[index];
    }
    getCardIndex(card: number) {
        return this.cards.indexOf(card);
    }
    hasCard(card: number) {
        return this.cards.includes(card);
    }
    hasCards() {
        return this.cards.length > 0;
    }   
}