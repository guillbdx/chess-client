import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'squareTone'})
export class SquareTonePipe implements PipeTransform {

    transform(value: string): string {
        let intLetter = value.charCodeAt(0) - 97;
        let number = +value.charAt(1);
        let total = intLetter + number;

        if(total % 2 == 0) {
            return 'light';
        }
        return 'dark';

    }
}