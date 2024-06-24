import { Component } from '@angular/core';
import { totalCards } from './constants/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'uno';
  items = ['1', '2', '3', '4', '5'];
  totalCards = totalCards;
  cardsPerPlayer = 7;
  getXRandomCards() {

  }
}
function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}
function getXRandomCards(x: number) {
  let cards = [];
  for (let i = 0; i < x; i++) {
    cards.push(getRandomInt(totalCards));
  }
  return cards;
}
