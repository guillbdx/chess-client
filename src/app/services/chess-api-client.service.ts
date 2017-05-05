import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {Configuration} from "../Configuration";
import {LanguageDetectorService} from "./language-detector.service";
import {User} from "../entities/user.entity";
import {Game} from "../entities/game.entity";

@Injectable()
export class ChessApiClientService {

    private headers: Headers;

    private headersWithBearer: Headers;

    constructor(
        private http: Http,
        private configuration: Configuration,
        private languageDetector: LanguageDetectorService
    ) {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'Accept-Language' : this.languageDetector.getLanguage()
        });
        this.resetHeadersWithBearer();
    }

    private resetHeadersWithBearer() {
        this.headersWithBearer = new Headers({
            'Content-Type': 'application/json',
            'Accept-Language' : this.languageDetector.getLanguage(),
            'Authorization': 'Bearer ' + localStorage.bearer
        });
    }

    private createQuery(filters: Object) {
        let paramQueries = [];
        for(let key in filters) {
            let value = filters[key];
            if(value == null) {
                continue;
            }
            let paramQuery = key + '=' + encodeURI(filters[key]);
            paramQueries.push(paramQuery);
        }
        let query = paramQueries.join('&');
        return query;
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

    changePassword(password: string) {
        this.resetHeadersWithBearer();
        let body = {
            plainPassword: password
        };
        return this.http.post(
            this.configuration.apiBaseUrl + '/account/change-password',
            body,
            {headers: this.headersWithBearer})
            .toPromise();
    }

    getUsers(
        exclude_self:boolean|null,
        exclude_computer:boolean|null): Promise<User[]> {

        this.resetHeadersWithBearer();

        let query = this.createQuery({
            exclude_self: exclude_self,
            exclude_computer: exclude_computer,
            page: 1,
            limit: 1000
        });

        return this.http.get(
            this.configuration.apiBaseUrl + '/users?' + query,
            {headers: this.headersWithBearer})
            .toPromise()
            .then(response => response.json()._embedded.resources as User[]);
    }

    createGame(guest: number, creatorIsWhite: boolean|null): Promise<Game> {
        this.resetHeadersWithBearer();
        let body = {
            guest: guest,
            creatorIsWhite: creatorIsWhite
        };
        return this.http.post(
            this.configuration.apiBaseUrl + '/games',
            body,
            {headers: this.headersWithBearer})
            .toPromise()
            .then(response => response.json() as Game);
    }

    createGameVsComputer(creatorIsWhite: boolean|null): Promise<Game> {
        this.resetHeadersWithBearer();
        let body = {
            creatorIsWhite: creatorIsWhite
        };
        return this.http.post(
            this.configuration.apiBaseUrl + '/computer-games',
            body,
            {headers: this.headersWithBearer})
            .toPromise()
            .then(response => response.json() as Game);
    }

    getProfile(): Promise<User> {
        this.resetHeadersWithBearer();
        return this.http.get(
            this.configuration.apiBaseUrl + '/account/profile',
            {headers: this.headersWithBearer})
            .toPromise()
            .then(response => response.json() as User);
    }

    getGames(): Promise<Game[]> {
        this.resetHeadersWithBearer();
        let query = this.createQuery({
            page: 1,
            limit: 1000
        });

        return this.http.get(
            this.configuration.apiBaseUrl + '/games?' + query,
            {headers: this.headersWithBearer})
            .toPromise()
            .then(response => response.json()._embedded.resources as Game[]);

    }

    refuseGame(game: Game) {
        this.resetHeadersWithBearer();
        return this.http.post(
            this.configuration.apiBaseUrl + '/games/' + game.id + '/refuse',
            null,
            {headers: this.headersWithBearer})
            .toPromise();
    }

    acceptGame(game: Game) {
        this.resetHeadersWithBearer();
        return this.http.post(
            this.configuration.apiBaseUrl + '/games/' + game.id + '/accept',
            null,
            {headers: this.headersWithBearer})
            .toPromise();
    }

}