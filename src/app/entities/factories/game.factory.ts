import {User} from "../entities/user.entity";
import {Game} from "../entities/game.entity";
import {ChessApiClientService} from "../../services/chess-api-client.service";
import {Injectable} from "@angular/core";
import {UserFactory} from "./user.factory";

@Injectable()
export class GameFactory {

    constructor(
        private chessApiClient: ChessApiClientService,
        private userFactory: UserFactory
    ) {}

    getGame(id: number) {
        return this.chessApiClient.getGame(id).then(response => {
            let data = response.json();
            return this.userFactory.getUser(data._links.creator.id).then(creator => {
                return this.userFactory.getUser(data._links.guest.id).then(guest => {
                    return this.createGameFromDataCreatorGuest(data, creator, guest);
                });
            });
        });
    }

    getGames() {
        return this.userFactory.getUsers(null, null).then(users => {
            return this.chessApiClient.getGames().then(response => {
                let datas = response.json()._embedded.resources;
                let games: Game[] = [];
                for(let data of datas) {
                    let creator = this.findUserInUsersPool(users, data._links.creator.id);
                    let guest = this.findUserInUsersPool(users, data._links.guest.id);
                    let game = this.createGameFromDataCreatorGuest(data, creator, guest);
                    games.push(game);
                }
                return games;
            });
        });
    }

    findUserInUsersPool(usersPool: User[], id: number) {
        for(let user of usersPool) {
            if(user.id == id) {
                return user;
            }
        }
        return null;
    }

    private createGameFromDataCreatorGuest(data: any, creator: User, guest: User) {
        return new Game(
            creator,
            guest,
            data.id,
            data.creatorIsWhite,
            data.createdAt,
            data.fen,
            data.pgn,
            data.playingColor,
            data.possibleMoves,
            data.result,
            data.chessboard,
            data.acceptedAt,
            data.endedAt
        );
    }

}