import * as faceapi from 'face-api.js';
// FIXME: mac m1에서는 호환되지 않는 라이브러리 같음
import * as canvas from 'canvas';

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({
  Canvas,
  Image,
  ImageData
} as any);

export class CustomMtcnnOptions extends faceapi.MtcnnOptions {
  constructor() {
    super();
    this._name = 'test';
  }

  get minFaceSize() {
    return 200; // minFaceSize 값을 200으로 반환
  }
}

const mtcnnForwardParams = new CustomMtcnnOptions();
