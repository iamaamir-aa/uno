import { Component } from '@angular/core';
import { cardsPerPlayer, plusTwoIndex, reverseIndex, skipIndex, totalCards, totalPlayers } from './constants/constants';
import { Player } from './model/player';
import { BehaviorSubject, delayWhen, map, timer } from 'rxjs';

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
  direction: number = 1;
  wildCardAtPlay: boolean = true;
  showBackdrop: boolean = true;
  componentName: string | undefined = undefined ;
  currentPlayerName: string = 'Player 1';
  colors: color[] = ['red', 'green', 'blue', 'yellow'];
  currentPlayer$ = new BehaviorSubject<number>(1);
  currentPlayerUpdate$ = this.currentPlayer$.asObservable().pipe(
    delayWhen(val=> this.isAIPlayer(val) ? timer(2000) : timer(0)),
    map((value) => {
      if(this.isAIPlayer(value)){
        this.AIPlayer();
      }
    })
  ); 
  constructor() {
    this.currentPlayerUpdate$.subscribe();
    this.initiate();
  }

  public initiate(): void {
    for (let i = 0; i < totalPlayers; i++) {
      if(this.isAIPlayer(i)){
        let player = new Player(`AI`, []);
        player.drawNCards(this.getNPoppedRandomCard(cardsPerPlayer));
        this.players.push(player);
        continue;
      }
      let player = new Player(`Player ${i + 1}`, []);
      player.drawNCards(this.getNPoppedRandomCard(cardsPerPlayer));
      this.players.push(player);
    }
    this.currentCard = this.getRandomCardNotPop();
  }
  private isAIPlayer(n: number): boolean {
    return n === 0;
  }
  private getCurrentPlayer(): Player {
    return this.players[this.currentPlayer$.value];
  }
  public drawCard(): boolean {
    if (this.allowedToDrawCard()) {
      let player = this.getCurrentPlayer();
      const card = this.popRandomCard();
      player.drawCard(card);
      if (this.isCardPlayable(card)) {
        alert('You have played a card');
        this.playCard(player.getCardIndex(card));
        return true;
      }
      this.jumpToNextPlayer();
      return true;
    }
    alert('You have a compatible card to play');
    return false;
  }

  public playCard(index: number): void {
    let player = this.getCurrentPlayer();
    let card = player.getCard(index);
    if (!!this.currentCard && !!card && this.isCardPlayable(card)) {
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
    this.componentName = undefined;
    this.currentColour = color;
  }
  public close(): void{
    this.showBackdrop = false;
    this.componentName = undefined;
  }
  public isMyTurn(n: number): boolean {
    return this.currentPlayer$.value === n;
  }

  private allowedToDrawCard(): boolean {
    let player = this.getCurrentPlayer();
    return !this.doesHaveCompatibleCard(player);
  }

  private doesHaveCompatibleCard(player: Player): boolean {
    for (let i = 0; i < player.getCardCount(); i++) {
      if (this.isCardPlayable(player.getCard(i))) {
        return true;
      }
    }
    return false;
  }

  private isCardPlayable(card: number): boolean {
    if (card === 52 || card === 53) {
      return true;
    }
    if (this.currentCard && this.currentColour !== undefined && (Math.floor(card / 13) === this.getColorIndex(this.currentColour))) {
      this.currentColour = undefined;
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
  private getNPoppedRandomCard(x: number): number[] {
    let cards: number[] = [];
    for (let i = 0; i < x; i++) {
      cards.push(this.popRandomCard());
    }
    return cards;
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
    this.jumpToNextPlayer();
  }

  private nextPlayerSkip(): void {
    this.jumpToNextPlayer();
    this.jumpToNextPlayer();
  }

  private nextPlayerDrawTwo(): void {
    this.jumpToNextPlayer();
    this.getCurrentPlayer().drawNCards(this.getNPoppedRandomCard(2));
    this.jumpToNextPlayer();
  }

  private nextPlayerChangeColor(): void {
    this.showBackdropAndChooseColor();
    this.jumpToNextPlayer();
  }

  private nextPlayerPickFour(): void {
    this.jumpToNextPlayer();
    this.getCurrentPlayer().drawNCards(this.getNPoppedRandomCard(4));
    this.jumpToNextPlayer();
    this.showBackdropAndChooseColor();
  }
  jumpToNextPlayer(): void {
    this.currentPlayer$.next((this.currentPlayer$.value + this.direction + totalPlayers) % totalPlayers);
  }
  showBackdropAndChooseColor(): void {
    this.showBackdrop = true;
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
    this.jumpToNextPlayer();
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
  public getColorIndex(color: color){
    if (color === 'blue'){
      return 3;
    }
    if (color === 'green'){
      return 2;
    }
    if (color === 'red'){
      return 1;
    }
    if (color === 'yellow'){
      return 0;
    }
    return -1;
  }

  public AIPlayer(): void {
    let player = this.getCurrentPlayer();
    let card = this.getAIPlayableCard(player);
    if (card === -1) {
      this.drawCard();
      return;
    }
    this.playCard(player.getCardIndex(card));
  }
  private getAIPlayableCard(player: Player) {
    if (this.preferToDrawCardsToNextPlayer()) {
        if(this.doesHavePlusFourCard(player)){
          return 52;
        }
        const plusTwo = this.getValidColourPlusTwoCard(player);
        if(plusTwo !== -1){
          return plusTwo;
        }
        const skipCard = this.getValidColourSkipCard(player);
        if(skipCard !== -1){
          return skipCard;
        }
        const reverseCard = this.getValidColourReverseCard(player);
        if(reverseCard !== -1){
          return reverseCard;
        }
    }
    for (let i = 0; i < player.getCardCount(); i++) {
      if (this.isCardPlayable(player.getCard(i))) {
        return player.getCard(i);
      }
    }
    return -1;
  }
  getValidColourReverseCard(player: Player) {
    for (let i = 0; i < player.getCardCount(); i++) {
      if (player.getCard(i) % 13 === reverseIndex && this.isCardPlayable(player.getCard(i))) {
        return player.getCard(i);
      }
    }
    return -1;
  }
  getValidColourSkipCard(player: Player) {
    for (let i = 0; i < player.getCardCount(); i++) {
      if (player.getCard(i) % 13 === skipIndex && this.isCardPlayable(player.getCard(i))) {
        return player.getCard(i);
      }
    }
    return -1;
  }
  getValidColourPlusTwoCard(player: Player) {
    for (let i = 0; i < player.getCardCount(); i++) {
      if (player.getCard(i) % 13 === plusTwoIndex && this.isCardPlayable(player.getCard(i)))  {
        return player.getCard(i);
      }
    }
    return -1;
  }
  
  private preferToDrawCardsToNextPlayer(): boolean {
    let nextPlayer = this.players[(this.currentPlayer$.value + this.direction + totalPlayers) % totalPlayers];
    return nextPlayer.getCardCount() < 3;
  }
  doesHavePlusFourCard(player: Player): boolean {
    for (let i = 0; i < player.getCardCount(); i++) {
      if (player.getCard(i) === 52) {
        return true;
      }
    }
    return false;
  }

}

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}
