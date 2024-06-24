import { Component } from '@angular/core';
import { cardsPerPlayer, plusTwoIndex, reverseIndex, skipIndex, totalCards, totalPlayers } from './constants/constants';
import { Player } from './model/player';

type color = 'red' | 'green' | 'blue' | 'yellow';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'uno';
  players: Player[] = [];
  availableCards: number[] = Array.from({ length: totalCards }, (_, i) => i);
  currentCard: number | undefined = undefined;
  currentColour: color | undefined = undefined;
  playerTurn: number = 0;
  direction: number = 1;
  wildCardAtPlay: boolean = true;
  showBackdrop: boolean = true;
  componentName: string = 'chooseColor';

  constructor() {
    this.initiate();
  }

  public initiate(): void {
    for (let i = 0; i < totalPlayers; i++) {
      let player = new Player(`Player ${i + 1}`, []);
      for (let j = 0; j < cardsPerPlayer; j++) {
        player.drawCard(this.popRandomCard());
      }
      this.players.push(player);
    }
    this.currentCard = this.getRandomCardNotPop();
  }

  public drawCard(): boolean {
    if (this.allowedToDrawCard()) {
      let player = this.players[this.playerTurn];
      const card = this.popRandomCard();
      if (this.isCardValid(card)) {
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

  public playCard(index: number): void {
    let player = this.players[this.playerTurn];
    let card = player.getCard(index);
    if (this.currentCard !== undefined || this.isCardValid(card)) {
      this.currentCard = card;
      player.playCard(card);
      this.availableCards.push(card);
      if (player.getCardCount() === 0) {
        alert(`${player.name} wins!`);
        return;
      }
      this.handleSpecialCards(card);
    }
  }

  public chooseColor(color: color): void {
    this.showBackdrop = false;
    this.componentName = 'game';
    this.currentColour = color;
  }

  public isMyTurn(n: number): boolean {
    return this.playerTurn === n;
  }

  private allowedToDrawCard(): boolean {
    let player = this.players[this.playerTurn];
    return !this.doesHaveCompatibleCard(player);
  }

  private doesHaveCompatibleCard(player: Player): boolean {
    for (let i = 0; i < player.getCardCount(); i++) {
      if (this.isCardValid(player.getCard(i))) {
        return true;
      }
    }
    return false;
  }

  private isCardValid(card: number): boolean {
    if (card === 52 || card === 53) {
      return true;
    }
    if (this.currentCard && (card % 13 === this.currentCard % 13)) {
      return true;
    }
    if (this.currentCard && (Math.floor(card / 13) === Math.floor(this.currentCard / 13))) {
      return true;
    }
    return false;
  }

  private popRandomCard(): number {
    let x = getRandomInt(totalCards);
    let index = this.availableCards.indexOf(x);
    while (index === -1) {
      x = getRandomInt(totalCards);
      index = this.availableCards.indexOf(x);
    }
    this.availableCards.splice(index, 1);
    return x;
  }

  private getRandomCardNotPop(): number {
    let x = getRandomInt(totalCards);
    while (this.availableCards.indexOf(x) === -1) {
      x = getRandomInt(totalCards);
    }
    return x;
  }

  private nextPlayerReverse(): void {
    this.direction = -this.direction;
    this.playerTurn = (this.playerTurn + this.direction + totalPlayers) % totalPlayers;
  }

  private nextPlayerSkip(): void {
    this.playerTurn = (this.playerTurn + this.direction + totalPlayers) % totalPlayers;
    this.playerTurn = (this.playerTurn + this.direction + totalPlayers) % totalPlayers;
  }

  private nextPlayerDrawTwo(): void {
    this.playerTurn = (this.playerTurn + this.direction + totalPlayers) % totalPlayers;
    this.players[this.playerTurn].drawCard(this.popRandomCard());
    this.players[this.playerTurn].drawCard(this.popRandomCard());
  }

  private nextPlayerChangeColor(): void {
    this.playerTurn = (this.playerTurn + this.direction + totalPlayers) % totalPlayers;
  }

  private nextPlayerPickFour(): void {
    this.playerTurn = (this.playerTurn + this.direction + totalPlayers) % totalPlayers;
    this.players[this.playerTurn].drawCard(this.popRandomCard());
    this.players[this.playerTurn].drawCard(this.popRandomCard());
    this.players[this.playerTurn].drawCard(this.popRandomCard());
    this.players[this.playerTurn].drawCard(this.popRandomCard());
    this.componentName = 'chooseColor';
  }

  private handleSpecialCards(card: number): void {
    if (card === 52) {
      this.nextPlayerPickFour();
      return;
    }
    if (card === 53) {
      this.nextPlayerChangeColor();
      return;
    }
    if (card % 13 === plusTwoIndex) {
      this.nextPlayerDrawTwo();
      return;
    }
    if (card % 13 === skipIndex) {
      this.nextPlayerSkip();
      return;
    }
    if (card % 13 === reverseIndex) {
      this.nextPlayerReverse();
      return;
    }
    this.playerTurn = (this.playerTurn + 1) % totalPlayers;
  }

  public getFileName(x: number): string {
    const base = '../assets';
    if (x === 53) {
      return `${base}/wildcard/colorchange.png`;
    }
    if (x === 52) {
      return `${base}/wildcard/pickfour.png`;
    }
    const index = x % 13;
    if (x > 38) {
      return `${base}/blue/blue_${index}.png`;
    }
    if (x > 25) {
      return `${base}/green/green_${index}.png`;
    }
    if (x > 12) {
      return `${base}/red/red_${index}.png`;
    }
    return `${base}/yellow/yellow_${index}.png`;
  }
}

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}