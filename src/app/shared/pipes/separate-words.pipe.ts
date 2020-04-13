import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'separateWords',
})
export class SeparateWordsPipe implements PipeTransform {
  public transform(value: string): string {
    return value
      .split('')
      .map((elem, i) => {
        if (i === 0) {
          return elem.toLowerCase();
        }

        return elem.toUpperCase() === elem ? ` ${elem.toLowerCase()}` : elem;
      })
      .join('');
  }
}
