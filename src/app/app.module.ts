import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TypingComponent } from './typing/typing.component';
import { HomePageComponent } from './home-page/home-page.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MultiChoiceComponent } from './multi-choice/multi-choice.component';


@NgModule({
  declarations: [
    AppComponent,
    TypingComponent,
    HomePageComponent,
    MultiChoiceComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'typing', component: TypingComponent},
      {path: 'home-page', component: HomePageComponent},
      {path: 'multi-choice', component: MultiChoiceComponent},
      {path: '', redirectTo: 'typing', pathMatch: 'full'},
    ]),
    HttpClientModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
