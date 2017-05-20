import {Game3dComponent} from "./game3d.component";

export class Chessboard3d {

    private gameComponent: Game3dComponent;

    private canvas: HTMLCanvasElement;

    constructor(
        idCanvas: string,
        pathBabylonFile: string,
        gameComponent: Game3dComponent
    ) {

        this.gameComponent = gameComponent;
        this.canvas = <HTMLCanvasElement>document.getElementById(idCanvas);
        let engine = new BABYLON.Engine(this.canvas, true);



        BABYLON.SceneLoader.Load("", pathBabylonFile, engine, (scene) => {
            scene.executeWhenReady(() => {

                console.log(scene);

            });
        }, (progress) => {

        });










        // let scene = new BABYLON.Scene(engine);
        //
        // let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
        //
        // camera.setTarget(BABYLON.Vector3.Zero());
        //
        // camera.attachControl(this.canvas, false);
        //
        // let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        //
        // let sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
        //
        // engine.runRenderLoop(function () {
        //     scene.render();
        // });

    }

}