import {GameComponent} from "./game.component";
import Scene = BABYLON.Scene;
import ArcRotateCamera = BABYLON.ArcRotateCamera;
import Mesh = BABYLON.Mesh;
import Material = BABYLON.Material;
import StandardMaterial = BABYLON.StandardMaterial;
import Vector3 = BABYLON.Vector3;
import CircleEase = BABYLON.CircleEase;
import AbstractMesh = BABYLON.AbstractMesh;

export class Chessboard3d {

    private gameComponent: GameComponent;

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

    private currentFromMarker: Mesh;

    private currentToMarker: Mesh;

    private lastFromMarker: Mesh;

    private lastToMarker: Mesh;

    constructor(
        idCanvas: string,
        pathBabylonFile: string,
        gameComponent: GameComponent
    ) {

        this.gameComponent = gameComponent;
        this.canvas = <HTMLCanvasElement>document.getElementById(idCanvas);
        let engine = new BABYLON.Engine(this.canvas, true);



        BABYLON.SceneLoader.Load("", pathBabylonFile, engine, (scene) => {
            scene.executeWhenReady(() => {

                this.scene = scene;
                this.initSceneEnvironment();

                let piecesPosition0 = {"a1":"w-r","b1":"w-n","c1":"w-b","d1":"w-q","e1":"w-k","f1":"w-b","g1":"w-n","h1":"w-r","a2":"w-p","b2":"w-p","c2":"w-p","d2":"w-p","e2":"w-p","f2":"w-p","g2":"w-p","h2":"w-p","a3":"","b3":"","c3":"","d3":"","e3":"","f3":"","g3":"","h3":"","a4":"","b4":"","c4":"","d4":"","e4":"","f4":"","g4":"","h4":"","a5":"","b5":"","c5":"","d5":"","e5":"","f5":"","g5":"","h5":"","a6":"","b6":"","c6":"","d6":"","e6":"","f6":"","g6":"","h6":"","a7":"b-p","b7":"b-p","c7":"b-p","d7":"b-p","e7":"b-p","f7":"b-p","g7":"b-p","h7":"b-p","a8":"b-r","b8":"b-n","c8":"b-b","d8":"b-q","e8":"b-k","f8":"b-b","g8":"b-n","h8":"b-r"};
                this.recreatePieces(piecesPosition0);

                this.activeClickListener();

                engine.runRenderLoop(() => {
                    scene.render();
                });

            });
        }, (progress) => {

        });

    }

    //--------------------------------------------------------
    // INIT
    //--------------------------------------------------------

    /**
     * Init
     */
    private initSceneEnvironment(): void {

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

        // Init from and to materials
        let materialFromMarker = new BABYLON.StandardMaterial("materialFromMarker", this.scene);
        materialFromMarker.diffuseColor = BABYLON.Color3.FromHexString('#805a08');
        let materialToMarker = new BABYLON.StandardMaterial("materialToMarker", this.scene);
        materialToMarker.diffuseColor = BABYLON.Color3.FromHexString('#7e8004');

        // Init from markers
        this.currentFromMarker = BABYLON.Mesh.CreatePlane("fromMarker", 1, this.scene);
        this.currentFromMarker.position = new BABYLON.Vector3(4, -10000, 1);                       // 0.06
        this.currentFromMarker.rotation = new BABYLON.Vector3(Math.PI / 2,0,0);
        this.currentFromMarker.material = materialFromMarker;
        this.lastFromMarker = this.currentFromMarker.clone('');
        this.lastFromMarker.position = new BABYLON.Vector3(4, -10000, 3);

        // Init to markers
        this.currentToMarker = BABYLON.Mesh.CreatePlane("toMarker", 1, this.scene);
        this.currentToMarker.position = new BABYLON.Vector3(2, -10000, 1);
        this.currentToMarker.rotation = new BABYLON.Vector3(Math.PI / 2,0,0);
        this.currentToMarker.material = materialToMarker;
        this.lastToMarker = this.currentToMarker.clone('');
        this.lastToMarker.position = new BABYLON.Vector3(2, -10000, 3);

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
     * Creates and place pieces from pieces position
     *
     * @param piecesPosition
     */
    private recreatePieces(piecesPosition: Object) {
        for(let square in piecesPosition) {
            let currentPiece = this.getPieceOnSquare(square);
            if(piecesPosition[square] != '') {
                this.createPiece(piecesPosition[square].charAt(2), piecesPosition[square].charAt(0), square);
            }
            if(currentPiece != null) {
                this.remove(square);
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
    public move(from: string, to: string): void {
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
    public remove(square: string): void {
        let piece = this.getPieceOnSquare(square);
        if(piece == null) {
            return;
        }
        piece.dispose();
    }

    /**
     *
     * @param square
     * @param newType
     */
    public promote(square: string, newType: string): void {
        let piece = this.getPieceOnSquare(square);
        let color = 'w';
        if(piece.material.name == 'blackMaterial') {
            color = 'b';
        }
        this.remove(square);
        this.createPiece(newType, color, square);
    }

    /**
     *
     * @param from
     * @param to
     * @param promotion
     */
    public previewMove(from: string, to: string, promotion?: string): void {

        let capturedPiece = this.getPieceOnSquare(to);
        this.move(from, to);
        if(capturedPiece != null) {
            setTimeout(() => {
                this.remove(to);
            }, 950);
        }

        if(promotion != null) {
            setTimeout(() => {
                this.promote(to, promotion);
            }, 1100);
        }

        let castlingType = null;
        switch(castlingType) {
            case 'Q' :
                this.move('a1', 'd1');
                break;
            case 'K' :
                this.move('h1', 'f1');
                break;
            case 'q' :
                this.move('a8', 'd8');
                break;
            case 'k' :
                this.move('h8', 'f8');
                break;
        }

        let inPassingCapturedSquare = null;
        if(inPassingCapturedSquare != null) {
            setTimeout(() => {
                this.remove(inPassingCapturedSquare);
            }, 950);
        }

    }

    //--------------------------------------------------------
    // MARKERS
    //--------------------------------------------------------

    /**
     *
     */
    uncolorCurrentFromToSquare() {
        this.currentFromMarker.position = new BABYLON.Vector3(0,-10000,0);
        this.currentToMarker.position = new BABYLON.Vector3(0,-10000,0);
    }

    /**
     *
     * @param from
     * @param to
     */
    colorCurrentFromToSquare(from: string, to: string): void {
        this.uncolorCurrentFromToSquare();
        let fromPosition = this.getPositionBySquare(from);
        let toPosition = this.getPositionBySquare(to);
        fromPosition.y += 0.06;
        toPosition.y += 0.06;
        this.currentFromMarker.position = fromPosition;
        this.currentToMarker.position = toPosition;
    }

    /**
     *
     */
    uncolorLastFromToSquare() {
        this.lastFromMarker.position = new BABYLON.Vector3(0,-10000,0);
        this.lastToMarker.position = new BABYLON.Vector3(0,-10000,0);
    }

    /**
     *
     * @param from
     * @param to
     */
    colorLastFromToSquare(from: string, to: string): void {
        this.uncolorLastFromToSquare();
        let fromPosition = this.getPositionBySquare(from);
        let toPosition = this.getPositionBySquare(to);
        fromPosition.y += 0.06;
        toPosition.y += 0.06;
        this.lastFromMarker.position = fromPosition;
        this.lastToMarker.position = toPosition;
    }








    //--------------------------------------------------------
    // EVENTS
    //--------------------------------------------------------

    private activeClickListener() {
        window.addEventListener("click", (event) => {
            if(!this.hasCameraMoved()) {
                let picking = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
                let square = this.getClickedSquare(picking);
                console.log(square);
                if(square != null) {
                    console.log(this.getPieceOnSquare(square));
                }
            }
            this.storeActiveCameraPosition(true);
        });
    }

}