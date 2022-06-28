import { Injectable } from '@angular/core';


@Injectable()
export class NavService {
  private activeQuiz: string = 'typing';
  private clickFunctions?: {(): void};

  getActiveQuiz = (): string =>
  {
    return this.activeQuiz;
  }

  setFunction = (func: () => void) =>
  {
    this.clickFunctions = func
  }

  setActiveQuiz = (bruh: string) =>
  {
    this.activeQuiz = bruh;
    this.clickFunctions?.()
  }

}
