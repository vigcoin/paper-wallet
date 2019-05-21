import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response, RequestMethod, RequestOptions, ResponseContentType } from '@angular/http';

import { Observable, from } from 'rxjs';
import { map } from 'rxjs//operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  spend: string;
  view: string;
  url = 'http://webapi.vigcoin.org:8080/wallet/export';
  id;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.id = setInterval(() => {
      this.update();
      if (this.spend) {
        clearInterval(this.id);
        this.id = null;
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  onSubmit(e) {
    e.target.submit();
    return true;
  }

  onDownloadFile(): void {
    this.getFile(this.url)
      .subscribe(fileData => {
        const b: any = new Blob([fileData], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(b);
        window.open(url);
      }
      );
  }

  public getFile(path: string): Observable<any> {
    return from(this.http.post(path, {
      spend: this.spend,
      view: this.view
    },
      { observe: 'response', responseType: 'blob' }
    ));
  }

  update() {
    this.spend = (<HTMLElement>document.getElementById('spend_key_widget')).innerHTML;
    this.view = (<HTMLElement>document.getElementById('view_key_widget')).innerHTML;
  }
}
