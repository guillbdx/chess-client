import {Injectable} from "@angular/core";
import {I18nService} from "./i18n.service";

@Injectable()
export class MyFlashMessagesService {

    private alert = document.getElementById('alert');

    constructor(
        private i18n: I18nService
    ) {
        this.displayMessages();
    }


    displayMessages() {

        this.alert.innerHTML = '';

        if(localStorage.getItem('error') != null) {

            let contentError = '<div class="alert alert-danger">';
            contentError += localStorage.getItem('error');
            contentError += '</div>';
            this.alert.innerHTML += contentError;

            localStorage.removeItem('error');
        }
        if(localStorage.getItem('success') != null) {

            let contentSuccess = '<div class="alert alert-success">';
            contentSuccess += localStorage.getItem('success');
            contentSuccess += '</div>';
            this.alert.innerHTML += contentSuccess;

            localStorage.removeItem('success');
        }
    }

    addSuccess(message: string, displayOnTheSpot = false): void {
        localStorage.success = this.i18n.translate(message);
        this.displayMessages();
    }

    addError(message: string, displayOnTheSpot = false): void {
        localStorage.error = this.i18n.translate(message);
        this.displayMessages();
    }

}