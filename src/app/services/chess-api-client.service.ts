import {Injectable} from "@angular/core";
import {XhrRequesterService} from "./xhr-requester.service";

@Injectable()
export class ChessApiClientService {

    constructor(private xhrRequester: XhrRequesterService) {}

    login(username: string, password: string) {
        let that = this;
        return new Promise(function(resolve) {
            let body = {
                username: username,
                password: password
            };
            that.xhrRequester.request('POST', '/security/login', body, null, null).then(function(apiResponse) {
                if(apiResponse.status == 200) {
                    localStorage.bearer = apiResponse.content;
                }
                resolve(apiResponse);
            });
        });
    }

}