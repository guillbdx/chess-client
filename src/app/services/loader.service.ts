import {Injectable} from "@angular/core";

@Injectable()
export class LoaderService {

    loaderMask = document.getElementById('loader');

    private pile = 0;

    private display() {
        if(this.pile == 0) {
            this.loaderMask.style.display = 'none';
        } else {
            this.loaderMask.style.display = 'block';
        }
    }

    show() {
        this.pile++;
        setTimeout(() => {
            this.display();
        }, 100);
    }

    hide() {
        this.pile--;
        setTimeout(() => {
            this.display();
        }, 100);
    }

}