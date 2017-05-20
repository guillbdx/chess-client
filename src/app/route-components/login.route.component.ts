import {Component, OnInit} from '@angular/core';

@Component({
    //templateUrl: './login.route.component.html',
    template: '<canvas id="canvas"></canvas>',
    styles: ['#canvas {width: 400px;height: 400px;touch-action: none; border: solid 1px red;}']
})
export class LoginRouteComponent implements OnInit {

    constructor() {}

    ngOnInit() {

        let canvas = <HTMLCanvasElement>document.getElementById("canvas");

        let engine = new BABYLON.Engine(canvas, true);

        let scene = new BABYLON.Scene(engine);

        let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

        camera.setTarget(BABYLON.Vector3.Zero());

        camera.attachControl(canvas, false);

        let light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

        let sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

        engine.runRenderLoop(function () {
            scene.render();
        });

    }


}