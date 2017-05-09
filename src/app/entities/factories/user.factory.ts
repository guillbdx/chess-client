import {ChessApiClientService} from "../../services/chess-api-client.service";
import {User} from "../entities/user.entity";
import {Injectable} from "@angular/core";

@Injectable()
export class UserFactory {

    constructor(
        private chessApiClient: ChessApiClientService
    ) {}

    getUsers(exclude_self: boolean, exclude_computer: boolean) {

        return this.chessApiClient.getUsers(exclude_self, exclude_computer).then(response => {
            let datas = response.json()._embedded.resources;
            let users: User[] = [];
            for(let data of datas) {
                let user = this.createUserFromData(data);
                users.push(user);
            }
            return users;
        });
    }

    getUser(id: number) {
        return this.chessApiClient.getUser(id).then(response => {
            return this.createUserFromData(response.json());
        });
    }

    getProfile() {
        return this.chessApiClient.getProfile().then(response => {
            return this.createUserFromData(response.json());
        });
    }

    private createUserFromData(data: any) {
        return new User(
            data.id,
            data.username,
            data.isComputer,
            data.email
        );
    }

}