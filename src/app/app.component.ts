import { Component } from '@angular/core';
import { cardsPerPlayer, totalCards, totalPlayers } from './constants/constants';
import { Player } from './model/player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public drawCard() {
    if (this.allowedToDrawCard()) {
      let player = this.players[this.playerTurn];
      const card = this.popRandomCard();
      if(this.isCardValid(card)){
        alert('You have played a card');
        this.currentCard = card;
        this.playerTurn = (this.playerTurn + this.direction + totalPlayers) % totalPlayers;
        return true;
      }
      player.drawCard(card);
      this.playerTurn = (this.playerTurn + this.direction + totalPlayers) % totalPlayers;
      return true;
    }
    alert('You have a compatible card to play');
    return false;
  }
  private allowedToDrawCard() {
    let player = this.players[this.playerTurn];
    if(this.doesHaveCompatibleCard(player)){
      return false;
    }
    return true;
  }
  private doesHaveCompatibleCard(player: Player) {
    for (let i = 0; i < player.getCardCount(); i++) {
      if (this.isCardValid(player.getCard(i))) {
        return true;
      }
    }
    return false;
  }
  public playCard(index: number) {
    let player = this.players[this.playerTurn];
    let card = player.getCard(index);
    if (this.currentCard === undefined || this.isCardValid(card)) {
      this.currentCard = card;
      player.playCard(card);
      if (player.getCardCount() === 0) {
        alert(`${player.name} wins!`);
        return;
      }
      this.playerTurn = (this.playerTurn + 1) % totalPlayers;
      this.cards.push(card);
    }
  }
  private isCardValid(card: number): boolean {
    if (card === 52 || card === 53) {
      return true;
    }
    // number same
    if (this.currentCard && (card % 13 === this.currentCard % 13)) {
      return true;
    }
    //colour same
    if (this.currentCard && (Math.floor(card / 13) === Math.floor(this.currentCard / 13))) {
      return true;
    }
    return false;
  }
  public isMyTurn(n: number) {
    return this.playerTurn === n;
  }
  title = 'uno';
  players: Player[] = [];
  cards = Array.from({ length: totalCards }, (_, i) => i);
  currentCard: number | undefined = undefined;
  playerTurn = 0;
  direction = 1;
  constructor() {
    this.initiate();
  }
  initiate() {
    for (let i = 0; i < totalPlayers; i++) {
      let player = new Player(`Player ${i + 1}`, []);
      for (let j = 0; j < cardsPerPlayer; j++) {
        player.drawCard(this.popRandomCard());
      }
      this.players.push(player);
    }
    this.currentCard = this.getRandomCardNotPop();
  }
  getFileName(x: number) {
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
  private popRandomCard() {
    let x = getRandomInt(totalCards);
    let index = this.cards.indexOf(x);
    while (index === -1) {
      x = getRandomInt(totalCards);
      index = this.cards.indexOf(x);
    }
    this.cards.splice(index, 1);
    return x;
  }
  private getRandomCardNotPop() {
    let x = getRandomInt(totalCards);
    while (this.cards.indexOf(x) === -1) {
      x = getRandomInt(totalCards);
    }
    return x;
  }
}
function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

