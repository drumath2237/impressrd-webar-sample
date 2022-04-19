import './style.scss';
import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

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

  const boxSize = 0.2;
  const box = BABYLON.MeshBuilder.CreateBox('box', { size: boxSize });
  box.visibility = 0;

  const xr = await xrInitializeTask;
  const featureManager = xr.baseExperience.featuresManager;
  const hitTest = featureManager.enableFeature(
    BABYLON.WebXRHitTest,
    'latest',
  ) as BABYLON.WebXRHitTest;

  let latestHitTestResult: BABYLON.IWebXRHitResult | null = null;
  hitTest?.onHitTestResultObservable.add((result) => {
    if (!result.length) {
      latestHitTestResult = null;
      box.visibility = 0;
      return;
    }

    latestHitTestResult = result[0];

    box.position = result[0].position;
    box.rotationQuaternion = result[0].rotationQuaternion;
    box.visibility = 1;
  });

  const button = addButton();
  button.onPointerClickObservable.add(() => {
    if (latestHitTestResult === null) {
      return;
    }

    const hitbox = box.clone('hitbox');
    hitbox.position = latestHitTestResult.position;
    hitbox.rotationQuaternion = latestHitTestResult.rotationQuaternion;
  });

  engine.runRenderLoop(() => {
    scene.render();
  });
};

const addButton = () => {
  // GUI settings
  const button = GUI.Button.CreateSimpleButton('button', 'Put');
  button.widthInPixels = 800;
  button.heightInPixels = 150;
  button.color = 'white';
  button.cornerRadius = 20;
  button.background = 'green';
  button.fontSizeInPixels = 50;
  button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  button.topInPixels = -10;

  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
    'UI',
    true,
  );
  advancedTexture.addControl(button);

  return button;
};

main();
