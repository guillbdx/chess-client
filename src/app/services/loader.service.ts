import {Injectable} from "@angular/core";

@Injectable()
export class LoaderService {

    loaderMask = document.getElementById('loader');

    show() {
        this.loaderMask.style.display = 'block';
    }

    hide() {
        this.loaderMask.style.display = 'none';
    }

}