import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchName'
})
export class SearchNamePipe implements PipeTransform {

  transform(name: any, searchText: any): any {
    if(searchText == null) return name;

    return name.filter(function(name){
      return name.AName.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
    })
  }
}
