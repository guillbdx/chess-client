import {Injectable} from "@angular/core";

@Injectable()
export class LanguageDetectorService {

    getLanguage():string {
        let locale = navigator.language;
        let language = locale;
        if(locale.indexOf('-') != -1) {
            let splitedLocale = locale.split('-');
            language = splitedLocale[0];
        }
        return language;
    }

}