import { Injectable } from '@angular/core';


@Injectable()
export class NavService {
  private activeQuiz: string = 'typing';
  private clickFunctions?: {(): void};
  private quizMode: string = 'zen';
  private difficulty: string = 'easy';
  private activeTime: number = 15;

  setFunction = (func: () => void) =>
  {
    this.clickFunctions = func
  }


  setActiveQuiz = (bruh: string) =>
  {
    this.activeQuiz = bruh;
    this.clickFunctions?.()
  }
  getActiveQuiz = (): string =>
  {
    return this.activeQuiz;
  }

  setQuizMode = (input: string) =>
  {
    this.quizMode = input;
    this.clickFunctions?.()
  }
  getQuizMode = (): string =>
  {
    return this.quizMode;
  }

  setActiveTime = (input: number) =>
  {
    this.activeTime = input;
    this.clickFunctions?.()
  }
  getActiveTime = (): number =>
  {
    return this.activeTime;
  }

  setDifficulty = (input: string) =>
  {
    this.difficulty = input;
    this.clickFunctions?.()
  }
  getDifficulty = (): string =>
  {
    return this.difficulty;
  }


}
