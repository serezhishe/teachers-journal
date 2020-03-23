import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'separateWords'
})
export class SeparateWordsPipe implements PipeTransform {

  public transform(value: string): string {
    return value.split('').map((elem) => elem.toUpperCase() === elem ? ` ${elem.toLowerCase()}` : elem).join('');
  }

}
