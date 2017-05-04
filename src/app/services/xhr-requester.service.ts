import {Injectable} from "@angular/core";
import {LanguageDetectorService} from "./language-detector.service";

@Injectable()
export class XhrRequesterService {

    constructor(
        private languageDetector: LanguageDetectorService
    ) {}

    request():void {
        console.log('call');
        console.log(this.languageDetector.getLanguage());
    }

}