import { Pipe, PipeTransform } from '@angular/core';
import {I18nService} from "../services/i18n.service";

@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {

    constructor(
        private i18n: I18nService
    ) {}

    transform(date: string): string {
        return this.i18n.formatDate(date);
    }
}