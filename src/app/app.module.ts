import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './common/material.module';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';


import { AppComponent } from './app.component';
import { MarkdownModule } from 'ngx-markdown';
import { MasterPageComponent } from './components/master-page/master-page.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { FolderTreeComponent } from './components/folder-tree/folder-tree.component';
import { HttpClientModule, HttpClient } from '../../node_modules/@angular/common/http';
import { RepoService } from './services/repo.service';


@NgModule({
  declarations: [
    AppComponent,
    MasterPageComponent,
    MainContentComponent,
    FolderTreeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '**', component: MasterPageComponent}
    ]),
    MarkdownModule.forRoot({ loader: HttpClient }),
    FlexLayoutModule
  ],
  providers: [
    RepoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
