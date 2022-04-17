import './style.scss';
import * as BABYLON from '@babylonjs/core';

const main = async () => {
  const renderCanvas = <HTMLCanvasElement>(
    document.getElementById('renderCanvas')
  );

  if (renderCanvas) {
    const engine = new BABYLON.Engine(renderCanvas, true);
    const scene = new BABYLON.Scene(engine);

    scene.createDefaultCameraOrLight(true, true, true);

    const boxSize = 0.2;
    const box = BABYLON.MeshBuilder.CreateBox('box', { size: boxSize });
    box.position.addInPlaceFromFloats(0, 1.6, 0);

    const xr = await scene.createDefaultXRExperienceAsync({
      uiOptions: {
        sessionMode: 'immersive-ar',
      },
      optionalFeatures: true,
    });
    const featureManager = xr.baseExperience.featuresManager;
    const hitTest = featureManager.enableFeature(
      BABYLON.WebXRHitTest,
      'latest',
    ) as BABYLON.WebXRHitTest;

    if (!hitTest) {
      return;
    }

    hitTest.onHitTestResultObservable.add((result) => {
      if (!result.length) {
        return;
      }

      box.position = result[0].position;
      box.rotationQuaternion = result[0].rotationQuaternion;
    });

    engine.runRenderLoop(() => {
      scene.render();
    });
  }
};

main();
