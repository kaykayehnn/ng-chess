import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { StoreModule } from '@ngrx/store'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HeaderComponent } from './header/header.component'
import { HomeComponent } from './home/home.component'
import { ChessboardComponent } from './chessboard/chessboard.component'
import { PieceComponent } from './chessboard/piece/piece.component'
import { AuthenticateComponent } from './auth/authenticate/authenticate.component'
import { rootReducer } from './store/app.reducers'
import { metaReducers } from './store/app.metaReducers';
import { FormComponent } from './auth/form/form.component';
import { TokenInterceptor } from './auth/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ChessboardComponent,
    PieceComponent,
    AuthenticateComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(rootReducer, { metaReducers }),
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
