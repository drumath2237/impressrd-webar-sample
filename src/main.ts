import './style.scss';
import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { IWebXRHitTestOptions } from '@babylonjs/core';

const main = async () => {
  const renderCanvas = <HTMLCanvasElement>(
    document.getElementById('renderCanvas')
  );

  if (!renderCanvas) {
    return;
  }

  const engine = new BABYLON.Engine(renderCanvas, true);
  const scene = new BABYLON.Scene(engine);

  const xrInitializeTask = scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: 'immersive-ar',
    },
    optionalFeatures: true,
  });

  scene.createDefaultCameraOrLight(true, true, true);

  const xr = await xrInitializeTask;
  const featureManager = xr.baseExperience.featuresManager;

  const hitTestOptions: IWebXRHitTestOptions = {
    enableTransientHitTest: true,
    testOnPointerDownOnly: true,
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
