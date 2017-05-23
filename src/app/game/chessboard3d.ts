import {GameComponent} from "./game.component";
import Scene = BABYLON.Scene;
import ArcRotateCamera = BABYLON.ArcRotateCamera;
import Mesh = BABYLON.Mesh;
import Material = BABYLON.Material;
import StandardMaterial = BABYLON.StandardMaterial;
import Vector3 = BABYLON.Vector3;
import CircleEase = BABYLON.CircleEase;
import AbstractMesh = BABYLON.AbstractMesh;
import {SharedGameComponent} from "./shared-game.component";
import {ChessboardSquare} from "../entities/entities/chessboard-square.entity";
import {Move} from "../entities/entities/move.entity";

export class Chessboard3d {

    private gameComponent: GameComponent|SharedGameComponent;

    private canvas: HTMLCanvasElement;

    private scene: Scene;

    private whiteCamera: ArcRotateCamera;

    private blackCamera: ArcRotateCamera;

    private socle: Mesh;

    private originalPieces: Object;

    private whiteMaterial: StandardMaterial;

    private blackMaterial: StandardMaterial;

    private activeCameraPosition: Vector3;

    private moveEasingFunction: CircleEase;

    private selectedMarker: Mesh;

    private lastFromMarker: Mesh;

    private lastToMarker: Mesh;

    private moveInProgress = false;

    constructor(
        canvas: HTMLCanvasElement,
        scene: Scene,
        gameComponent: GameComponent|SharedGameComponent
    ) {
        this.gameComponent = gameComponent;
        this.canvas = canvas;
        this.scene = scene;
    }

    //--------------------------------------------------------
    // INIT
    //--------------------------------------------------------

    /**
     * Init
     */
    public initSceneEnvironment(): void {

        // Init Ambiance
        this.scene.clearColor = BABYLON.Color3.FromHexString('#cce7e0');
        let light = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.diffuse = new BABYLON.Color3(1, 1, 1);
        light.specular = new BABYLON.Color3(1, 1, 1);
        light.groundColor = new BABYLON.Color3(0, 0, 0);

        // Init Cameras
        this.whiteCamera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 3*(Math.PI/2), 0.8, 10, new BABYLON.Vector3(3.5, 0, 3.5), this.scene);
        this.whiteCamera.attachControl(this.canvas, false);
        this.blackCamera = new BABYLON.ArcRotateCamera("ArcRotateCamera", Math.PI/2, 0.8, 10, new BABYLON.Vector3(3.5, 0, 3.5), this.scene);
        this.blackCamera.attachControl(this.canvas);

        // Actives camera
        this.activeCamera('w');

        // Stores camera position
        this.storeActiveCameraPosition();

        // Init socle
        this.socle        = <Mesh>this.scene.getMeshByName('socle');
        this.socle.position = new BABYLON.Vector3(-1,-0.5,-1);

        // Init white material
        this.whiteMaterial = new BABYLON.StandardMaterial("whiteMaterial", this.scene);
        let whiteTexture = new BABYLON.WoodProceduralTexture("whiteTexture", 1024, this.scene);
        whiteTexture.woodColor = new BABYLON.Color3(1, 1, 1);
        whiteTexture.ampScale = 1000;
        this.whiteMaterial.diffuseTexture = whiteTexture;

        // Init black material
        this.blackMaterial = new BABYLON.StandardMaterial("blackMaterial", this.scene);
        let blackTexture = new BABYLON.WoodProceduralTexture("blackTexture", 1024, this.scene);
        blackTexture.woodColor = new BABYLON.Color3(0.2,0.2,0.2);
        blackTexture.ampScale = 1000;
        this.blackMaterial.diffuseTexture = blackTexture;

        // Init selected, from and to materials
        let materialSelectedMarker = new BABYLON.StandardMaterial("materialSelectedMarker", this.scene);
        materialSelectedMarker.diffuseColor = BABYLON.Color3.FromHexString('#805a08');
        let materialLastFromMarker = new BABYLON.StandardMaterial("materialLastFromMarker", this.scene);
        materialLastFromMarker.diffuseColor = BABYLON.Color3.FromHexString('#805a08');
        let materialLastToMarker = new BABYLON.StandardMaterial("materialLastToMarker", this.scene);
        materialLastToMarker.diffuseColor = BABYLON.Color3.FromHexString('#7e8004');

        // Init markers
        this.selectedMarker = BABYLON.Mesh.CreatePlane("selectedMarker", 1, this.scene);
        this.selectedMarker.position = new BABYLON.Vector3(4, -10000, 1);                       // 0.06
        this.selectedMarker.rotation = new BABYLON.Vector3(Math.PI / 2,0,0);
        this.selectedMarker.material = materialSelectedMarker;

        this.lastFromMarker = BABYLON.Mesh.CreatePlane("toMarker", 1, this.scene);
        this.lastFromMarker.position = new BABYLON.Vector3(2, -10000, 1);
        this.lastFromMarker.rotation = new BABYLON.Vector3(Math.PI / 2,0,0);
        this.lastFromMarker.material = materialLastFromMarker;

        this.lastToMarker = BABYLON.Mesh.CreatePlane("toMarker", 1, this.scene);
        this.lastToMarker.position = new BABYLON.Vector3(2, -10000, 1);
        this.lastToMarker.rotation = new BABYLON.Vector3(Math.PI / 2,0,0);
        this.lastToMarker.material = materialLastToMarker;


        // Init original pieces
        this.originalPieces = {
            'p': this.scene.getMeshByName('pawn'),
            'r': this.scene.getMeshByName('rook'),
            'n': this.scene.getMeshByName('knight'),
            'b': this.scene.getMeshByName('bishop'),
            'q': this.scene.getMeshByName('queen'),
            'k': this.scene.getMeshByName('king'),
        };
        this.originalPieces['p'].position = new BABYLON.Vector3(0,-10000,0);
        this.originalPieces['r'].position = new BABYLON.Vector3(0,-10000,0);
        this.originalPieces['n'].position = new BABYLON.Vector3(0,-10000,0);
        this.originalPieces['b'].position = new BABYLON.Vector3(0,-10000,0);
        this.originalPieces['q'].position = new BABYLON.Vector3(0,-10000,0);
        this.originalPieces['k'].position = new BABYLON.Vector3(0,-10000,0);

        // Init Move easing function
        this.moveEasingFunction = new BABYLON.CircleEase();
        this.moveEasingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

    }

    //--------------------------------------------------------
    // CAMERA
    //--------------------------------------------------------

    /**
     *
     * @param color
     */
    public activeCamera(color: string): void {
        this.scene.activeCamera = this.whiteCamera;
        if(color == 'b') {
            this.scene.activeCamera = this.blackCamera;
        }
    }

    /**
     *
     * @param waitForMoveEnd
     */
    public storeActiveCameraPosition(waitForMoveEnd = false): void {
        let timeout = 0;
        if(waitForMoveEnd) {
            timeout = 1000;
        }
        setTimeout(() => {
            this.activeCameraPosition = new BABYLON.Vector3(
                this.scene.activeCamera['_globalPosition'].x,
                this.scene.activeCamera['_globalPosition'].y,
                this.scene.activeCamera['_globalPosition'].z,
            );
        }, timeout);
    }

    /**
     *
     * @returns {boolean}
     */
    public hasCameraMoved() {
        if(this.activeCameraPosition.x != this.scene.activeCamera['_globalPosition'].x) {
            return true;
        }
        if(this.activeCameraPosition.y != this.scene.activeCamera['_globalPosition'].y) {
            return true;
        }
        if(this.activeCameraPosition.z != this.scene.activeCamera['_globalPosition'].z) {
            return true;
        }
        return false;
    }

    //--------------------------------------------------------
    // PIECES
    //--------------------------------------------------------

    /**
     *
     * @param pieceType
     * @returns Mesh
     */
    private getOriginalPiece(pieceType: string): Mesh {
        let piece = this.originalPieces['p'];
        switch(pieceType) {
            case 'r' :
                piece = this.originalPieces['r'];
                break;
            case 'n' :
                piece =  this.originalPieces['n'];
                break;
            case 'b' :
                piece =  this.originalPieces['b'];
                break;
            case 'q' :
                piece =  this.originalPieces['q'];
                break;
            case 'k' :
                piece =  this.originalPieces['k'];
                break;
        }
        return piece;
    }

    /**
     *
     * @param piece
     * @param color
     */
    private applyMaterialOnPiece(piece: Mesh, color: string): void {
        piece.material = this.whiteMaterial;
        if(color == 'b') {
            piece.material = this.blackMaterial;
        }
    }

    /**
     *
     * @param pieceType
     * @param color
     * @param squareName
     * @returns {Mesh}
     */
    private createPiece(pieceType: string, color: string, squareName?: string): Mesh {
        let piece = this.getOriginalPiece(pieceType).clone('');
        this.applyMaterialOnPiece(piece, color);
        if(squareName != null) {
            piece.position = this.getPositionBySquare(squareName);
        }
        if(pieceType == 'n' && color == 'w') {
            piece.rotation.y = Math.PI;
        }
        return piece;
    }

    /**
     *
     * @param chessboard
     */
    public recreatePieces(chessboard: ChessboardSquare[]) {
        if(this.moveInProgress) {
            return;
        }
        for(let squareName in chessboard) {
            let currentMeshPiece = this.getPieceOnSquare(squareName);
            if(currentMeshPiece != null) {
                this.disposePiece(squareName);
            }
            let currentDataPiece = chessboard[squareName]['piece'];
            if(currentDataPiece != '' && currentDataPiece != undefined) {
                this.createPiece(chessboard[squareName]['piece'].charAt(2), chessboard[squareName]['piece'].charAt(0), squareName);
            }
        }
    }

    //--------------------------------------------------------
    // SQUARES
    //--------------------------------------------------------

    /**
     *
     * @param position
     * @returns {string}
     */
    private getSquareByPosition(position: Vector3): string {
        let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        let letter = letters[position.x];
        let number = position.z + 1;
        return letter + number;
    }

    /**
     *
     * @param name
     * @returns {{x: any, z: number}}
     */
    private getPositionBySquare(name: string): Vector3 {
        let letters = {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7};
        return new BABYLON.Vector3(
            letters[name.charAt(0)],
            0,
            +name.charAt(1) - 1);
    }

    /**
     *
     * @param picking
     * @returns {any}
     */
    public getClickedSquare(picking: any): any {
        if(picking.pickedMesh == null) {
            return null;
        }
        if(picking.pickedMesh.id == 'socle') {
            let x = Math.round(picking.pickedPoint.x);
            let z = Math.round(picking.pickedPoint.z);
            return this.getSquareByPosition(new BABYLON.Vector3(x, 0, z));
        }
        if(picking.pickedMesh.id != 'socle') {
            let x = Math.round(picking.pickedMesh.position.x);
            let z = Math.round(picking.pickedMesh.position.z);
            return this.getSquareByPosition(new BABYLON.Vector3(x, 0, z));
        }
    }

    /**
     *
     * @param squareName
     * @returns {any}
     */
    public getPieceOnSquare(squareName: string): AbstractMesh|null {
        let position = this.getPositionBySquare(squareName);
        for(let i = 0; i < this.scene.meshes.length; i++) {
            if(this.scene.meshes[i].position.x == position.x
                && this.scene.meshes[i].position.z == position.z
                && this.scene.meshes[i].position.y == position.y) {
                return this.scene.meshes[i];
            }
        }
        return null;
    }

    //--------------------------------------------------------
    // MOVE
    //--------------------------------------------------------

    /**
     *
     * @param from
     * @param to
     */
    public slidePiece(from: string, to: string): void {
        let piece = this.getPieceOnSquare(from);
        if(piece == null) {
            return;
        }
        BABYLON.Animation.CreateAndStartAnimation(
            'movePiece',
            piece,
            'position',
            30,
            30,
            piece.position,
            this.getPositionBySquare(to),
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
            this.moveEasingFunction);
    }

    /**
     *
     * @param square
     */
    public disposePiece(square: string): void {
        let piece = this.getPieceOnSquare(square);
        if(piece == null) {
            return;
        }
        piece.dispose();
    }

    /**
     *
     * @param move
     */
    showMove(move: Move): void {
        this.colorLastFromToSquare(move);
        this.showNormalMove(move.from, move.to);
        if(move.promotion != null) {
            this.showPromotionMoveAddOn(move.from, move.to, move.promotion);
        }
        if(move.castlingType != null) {
            this.showCastlingMoveAddOn(move.from, move.to, move.castlingType);
        }
        if(move.inPassingSquare != null) {
            this.showInPassingMoveAddOn(move.from, move.to, move.inPassingSquare);
        }
    }

    /**
     *
     * @param from
     * @param to
     */
    showNormalMove(from: string, to: string) {

        this.moveInProgress = true;
        setTimeout(() => {
            this.moveInProgress = false;
        }, 1000);

        let capturedPiece = this.getPieceOnSquare(to);
        this.slidePiece(from, to);
        if(capturedPiece != null) {
            setTimeout(() => {
                this.disposePiece(to);
            }, 950);
        }
    }

    /**
     *
     * @param from
     * @param to
     * @param promotion
     */
    showPromotionMoveAddOn(from: string, to: string, promotion: string) {
        setTimeout(() => {
            let piece = this.getPieceOnSquare(to);
            let color = 'w';
            if(piece.material.name == 'blackMaterial') {
                color = 'b';
            }
            this.disposePiece(to);
            this.createPiece(promotion, color, to);
        }, 1100);
    }

    /**
     *
     * @param from
     * @param to
     * @param castlingType
     */
    showCastlingMoveAddOn(from: string, to: string, castlingType: string) {
        switch(castlingType) {
            case 'Q' :
                this.slidePiece('a1', 'd1');
                break;
            case 'K' :
                this.slidePiece('h1', 'f1');
                break;
            case 'q' :
                this.slidePiece('a8', 'd8');
                break;
            case 'k' :
                this.slidePiece('h8', 'f8');
                break;
        }
    }

    /**
     *
     * @param from
     * @param to
     * @param inPassingCapturedSquare
     */
    showInPassingMoveAddOn(from: string, to: string, inPassingCapturedSquare: string) {
        setTimeout(() => {
            this.disposePiece(inPassingCapturedSquare);
        }, 950);
    }

    //--------------------------------------------------------
    // MARKERS
    //--------------------------------------------------------

    /**
     *
     * @param square
     */
    colorSelectedSquare(square: string|null): void {
        if(square == null) {
            this.selectedMarker.position = new BABYLON.Vector3(0,-10000,0);
            return;
        }
        let position = this.getPositionBySquare(square);
        position.y += 0.06;
        this.selectedMarker.position = position;
    }

    /**
     *
     * @param move
     */
    colorLastFromToSquare(move: Move, selectedSquare?: string): void {
        this.selectedMarker.position = new BABYLON.Vector3(0,-10000,0);
        this.lastFromMarker.position = new BABYLON.Vector3(0,-10000,0);
        this.lastToMarker.position = new BABYLON.Vector3(0,-10000,0);
        if(selectedSquare != null) {
            this.colorSelectedSquare(selectedSquare);
        }
        if(move == null) {
            return;
        }
        let fromPosition = this.getPositionBySquare(move.from);
        fromPosition.y += 0.06;
        this.lastFromMarker.position = fromPosition;
        let toPosition = this.getPositionBySquare(move.to);
        toPosition.y += 0.06;
        this.lastToMarker.position = toPosition;
    }

    //--------------------------------------------------------
    // EVENTS
    //--------------------------------------------------------

    public activeClickListener() {
        this.canvas.addEventListener("click", (event) => {
            if(!this.hasCameraMoved()) {
                let picking = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
                let square = this.getClickedSquare(picking);
                if(square != null) {
                    this.gameComponent.onClickSquare(square);
                }
            }
            this.storeActiveCameraPosition(true);
        });
    }

}