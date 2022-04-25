import './style.scss';
import * as BABYLON from '@babylonjs/core';

const main = async () => {
  const renderCanvas = <HTMLCanvasElement>(
    document.getElementById('renderCanvas')
  );

  if (!renderCanvas) {
    return;
  }

  const engine = new BABYLON.Engine(renderCanvas, true);
  const scene = new BABYLON.Scene(engine);

  scene.createDefaultCameraOrLight(true, true, true);

  const xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: 'immersive-ar',
    },
    optionalFeatures: true,
  });

  const featureManager = xr.baseExperience.featuresManager;

  const hitTestOptions: BABYLON.IWebXRHitTestOptions = {
    enableTransientHitTest: true,
    disablePermanentHitTest: true,
    transientHitTestProfile: 'generic-touchscreen',
  };

  const hitTest = featureManager.enableFeature(
    BABYLON.WebXRHitTest,
    'latest',
    hitTestOptions,
  ) as BABYLON.WebXRHitTest;

  hitTest?.onHitTestResultObservable.add((result) => {
    if (!result.length) {
      return;
    }

    const box = BABYLON.MeshBuilder.CreateBox('box', { size: 0.2 });
    box.position = result[0].position;
    box.rotationQuaternion = result[0].rotationQuaternion;
  });

  engine.runRenderLoop(() => {
    scene.render();
  });
};

main();
