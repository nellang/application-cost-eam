import {Component, Attribute} from '@angular/core'

@Component({
  selector: 'now',
  template: `<h2 (updateTime)="updateMyTime()">{{date | date: format}}</h2>`
})
export class Now {
   private date;
   format: Now;
   
  constructor(@Attribute("format") format) { 
    this.format = format;
    this.date =  new Date(); 
    
    setInterval(() => {
        this.date =  new Date();
     }, 1000);
  } 

} 