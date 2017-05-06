import {Injectable} from "@angular/core";
import {FlashMessagesService} from "angular2-flash-messages";
import {I18nService} from "./i18n.service";

@Injectable()
export class MyFlashMessagesService {

    constructor(
        private flashMessagesService: FlashMessagesService,
        private i18n: I18nService
    ) {}

    private add(message: string, type: string): void {
        let translatedMessage = this.i18n.translate(message);
        setTimeout(() => {
            this.flashMessagesService.show(
                translatedMessage,
                { cssClass: 'alert-' + type, timeout: 5000 });
        }, 100);
    }

    addSuccess(message: string): void {
        this.add(message, 'success');
    }

    addError(message: string): void {
        this.add(message, 'danger');
    }

}