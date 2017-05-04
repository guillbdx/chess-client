import {Injectable} from "@angular/core";
import {LanguageDetectorService} from "./language-detector.service";
import {Configuration} from "../Configuration";

@Injectable()
export class XhrRequesterService {

    constructor(
        private languageDetector: LanguageDetectorService,
        private configuration: Configuration
    ) {}

    request():void {
        console.log('call');
        console.log(this.languageDetector.getLanguage());
        console.log(this.configuration.apiBaseUrl);
    }

}