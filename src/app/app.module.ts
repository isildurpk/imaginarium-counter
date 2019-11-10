import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PlayersSettingComponent} from './players-setting/players-setting.component';
import {PlayerSettingComponent} from './players-setting/player-setting/player-setting.component';
import {WhoHaveBeenChosenComponent} from './who-have-been-chosen/who-have-been-chosen.component';
import {WhoIsRightComponent} from './whoisright/whoisright.component';
import {PlayerComponent} from './player/player.component';
import {GameService} from './game.service';

@NgModule({
  declarations: [
    AppComponent,
    PlayersSettingComponent,
    PlayerSettingComponent,
    PlayerComponent,
    WhoHaveBeenChosenComponent,
    WhoIsRightComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
