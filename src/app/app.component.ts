import { Component } from '@angular/core';
import { cardsPerPlayer, totalCards } from './constants/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'uno';
  items: string[] = [];
  totalCards = totalCards;
  cardsPerPlayer = cardsPerPlayer;
  constructor() {
    this.items = getXUniqueRandomCards(this.cardsPerPlayer).map(x => getFileName(x));;
  }

}
function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}
function getXUniqueRandomCards(x: number) {
  let cards: number[] = [];
  for (let i = 0; i < x; i++) {
    let x = getRandomInt(totalCards);
    while (cards.includes(x)) {
      x = getRandomInt(totalCards);
    }
    cards.push(x);
  }
  return cards;
}
function getFileName(x: number) {
  const base = '../assets';
  if (x === 53) {
    return `${base}/wildcard/colorchange.png`;
  }
  if (x === 52) {
    return `${base}/wildcard/pickfour.png`
  }
  const index = x % 13;
  if (x > 38) {
    return `${base}/blue/blue_${index}.png`
  }
  if (x > 25) {
    return `${base}/green/green_${index}.png`
  }
  if (x > 12) {
    return `${base}/red/red_${index}.png`;
  }
  return `${base}/yellow/yellow_${index}.png`
}