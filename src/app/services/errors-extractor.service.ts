import {Injectable} from "@angular/core";
import {I18nService} from "./i18n.service";

@Injectable()
export class ErrorsExtractorService {

    constructor(
        private i18n: I18nService
    ) {}

    extract(content: any) {
        let messages = [];

        // Errors on whole form
        if(content.errors != null) {
            for(let i = 0; i < content.errors.errors.length; i++) {
                messages.push(content.errors.errors[i]);
            }
        }
        

        // Errors on fields
        let fields = content.children;
        for(let propertyName in fields) {
            let fieldErrors = fields[propertyName]['errors'];
            if(fieldErrors) {
                for(let i = 0; i < fieldErrors.length; i++) {
                    let fieldError = fieldErrors[i];
                    let message = '';
                    let propertyNameCapitalized = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
                    let translatedPropertyNameCapitalized = this.i18n.translate(propertyNameCapitalized);
                    message += translatedPropertyNameCapitalized + ' : ';
                    message += fieldError;
                    messages.push(message);
                }
            }
        }

        return messages;

    }

}