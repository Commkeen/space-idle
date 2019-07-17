import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayNumber'
})
export class DisplayNumberPipe implements PipeTransform {

  transform(value: number, args?: any): string {

    let prefix = '';
    let suffix = '';
    if (value < 0) {prefix = '-'; }
    value = Math.abs(value);

    if (value < 1000) {
      return prefix + this.getSuffixedValue(value, suffix);
    }

    const decimalPlaces = Math.floor(Math.log10(value));
    if (decimalPlaces < 6) {
      value = (value / 1000);
      suffix = 'K';
    } else {
      value = (value / 1000000);
      suffix = 'M';
    }

    return prefix + this.getSuffixedValue(value, suffix);
  }

  getSuffixedValue(value: number, suffix: string): string {
    if (value - Math.floor(value) > 0.01) {
      return value.toFixed(2) + suffix;
    }
    return value.toFixed(0) + suffix;
  }

}
