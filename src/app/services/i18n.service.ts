import {Injectable} from "@angular/core";
import {LanguageDetectorService} from "./language-detector.service";
import {enTranslations} from "../translations/en-translations";
import {frTranslations} from "../translations/fr-translations";

@Injectable()
export class I18nService {

    translations = {
        en: enTranslations,
        fr: frTranslations
    };

    dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };

    private language = 'en';

    constructor(
        languageDetector: LanguageDetectorService
    ) {
        let detectedLanguage = languageDetector.getLanguage();
        if(detectedLanguage != null && this.translations[detectedLanguage] != undefined) {
            this.language = detectedLanguage;
        }
    }

    translate(key: string): string {
        if(this.translations[this.language][key] == undefined) {
            return key;
        }
        return this.translations[this.language][key];
    }

    formatDate(date: string): string {
        return new Intl.DateTimeFormat(this.language, this.dateOptions).format(new Date(date));
    }

}