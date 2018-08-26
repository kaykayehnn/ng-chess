import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { StoreModule } from '@ngrx/store'
import { InlineSVGModule } from 'ng-inline-svg'

// ENHANCEMENT: organize imports
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HeaderComponent } from './header/header.component'
import { LandingComponent } from './landing/landing.component'
import { ChessboardComponent } from './common/chessboard/chessboard.component'
import { PieceComponent } from './common/chessboard/piece/piece.component'
import { AuthenticateComponent } from './auth/authenticate/authenticate.component'
import { rootReducer } from './store/app.reducers'
import { metaReducers } from './store/app.metaReducers';
import { FormComponent } from './auth/form/form.component';
import { TokenInterceptor } from './auth/token.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardNavigationComponent } from './dashboard/navigation/navigation.component';
import { DashboardHomeComponent } from './dashboard/home/home.component';
import { DashboardRoomsComponent } from './dashboard/rooms/rooms.component';
import { DashboardGameComponent } from './dashboard/game/game.component';
import { DashboardAdminComponent } from './dashboard/admin/admin.component';
import { EmptyComponent } from './common/empty/empty.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { SpectateComponent } from './dashboard/spectate/spectate.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LandingComponent,
    ChessboardComponent,
    PieceComponent,
    AuthenticateComponent,
    FormComponent,
    DashboardComponent,
    DashboardNavigationComponent,
    DashboardHomeComponent,
    DashboardRoomsComponent,
    DashboardGameComponent,
    DashboardAdminComponent,
    EmptyComponent,
    LogoutComponent,
    SpectateComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot(rootReducer, { metaReducers }),
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    InlineSVGModule.forRoot()
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
