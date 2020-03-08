import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FeedService } from './feed/feed.service';
import { FeedComponent } from './feed/feed.component';
import { SourcesComponent } from './sources/sources.component';
import { SourcesService } from './sources/sources.service';

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    SourcesComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatListModule,
    MatRadioModule,
    MatSidenavModule,
  ],
  providers: [FeedService, SourcesService],
  bootstrap: [AppComponent],
})
export class AppModule {}
