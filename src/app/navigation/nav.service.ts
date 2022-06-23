import { Injectable } from '@angular/core';


@Injectable()
export class NavService {
  private activeQuiz: string = 'typing';

  getActiveQuiz = (): string =>
  {
    return this.activeQuiz;
  }

  setActiveQuiz = (bruh: string) =>
  {
    this.activeQuiz = bruh;
  }

}
