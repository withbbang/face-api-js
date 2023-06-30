import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({
  Canvas,
  Image,
  ImageData
} as any);
