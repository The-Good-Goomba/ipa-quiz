import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TypingComponent } from './typing/typing.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MultiChoiceComponent } from './multi-choice/multi-choice.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TableComponent } from './table/table.component';
import { QuizComponent } from './quiz/quiz.component';
import { NavService } from './navigation/nav.service';


@NgModule({
  declarations: [
    AppComponent,
    TypingComponent,
    HomePageComponent,
    MultiChoiceComponent,
    NavigationComponent,
    TableComponent,
    QuizComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'home-page', component: HomePageComponent},
      {path: 'quiz', component: QuizComponent},
      {path: '', redirectTo: 'quiz', pathMatch: 'full'},
    ]),
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [
    NavService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
