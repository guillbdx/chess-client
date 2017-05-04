import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {Configuration} from "../Configuration";
import {LanguageDetectorService} from "./language-detector.service";

@Injectable()
export class ChessApiClientService {

    private headers: Headers;

    constructor(
        private http: Http,
        private configuration: Configuration,
        private languageDetector: LanguageDetectorService
    ) {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept-Language' : this.languageDetector.getLanguage()
        });
    }


    login(username: string, password: string) {
        let body = {
            username: username,
            password: password
        };
        return this.http.post(
            this.configuration.apiBaseUrl + '/security/login',
            body,
            {headers: this.headers})
            .toPromise();

    }

    register(username: string, email: string, password: string) {
        let body = {
            username: username,
            email: email,
            plainPassword: password
        };
        return this.http.post(
            this.configuration.apiBaseUrl + '/security/register',
            body,
            {headers: this.headers})
            .toPromise();
    }


}