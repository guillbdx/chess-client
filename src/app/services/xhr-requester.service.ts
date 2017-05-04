import {Injectable} from "@angular/core";
import {LanguageDetectorService} from "./language-detector.service";
import {Configuration} from "../Configuration";
import {ApiResponseEntity} from "../entities/api-response.entity";

@Injectable()
export class XhrRequesterService {

    constructor(
        private languageDetector: LanguageDetectorService,
        private configuration: Configuration
    ) {}

    request(
        method: string,
        endpoint: string,
        body: any,
        filters: any,
        bearer: null|string):any {
            let that = this;
            return new Promise(resolve => {
                let xhr = new XMLHttpRequest();
                xhr.open(method, that.configuration.apiBaseUrl + endpoint);
                xhr.setRequestHeader("Content-Type", 'application/json');
                xhr.setRequestHeader("Accept-Language", that.languageDetector.getLanguage());
                if(bearer != null) {
                    xhr.setRequestHeader("Authorization", 'Bearer ' + bearer);
                }
                if(body != null) {
                    body = JSON.stringify(body);
                }
                xhr.send(body);
                xhr.onload = function() {
                    let apiResponse = new ApiResponseEntity(xhr);
                    resolve(apiResponse);
                };
                xhr.onerror = function() {
                    throw "Network connexion unavailable.";
                };
            });
    }

}