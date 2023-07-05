import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';
import WebcamPT from './WebcamPT';
import { AnchorPosition } from 'face-api.js/build/commonjs/draw/DrawTextField';

const MODEL_URL = '/models';

const WebcamCT = ({
  handleLoaderTrue,
  handleLoaderFalse
}: typeWebcamCT): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const video: any = document.getElementById('video') as HTMLVideoElement;

  useEffect(() => {
    (async () => {
      handleLoaderTrue();
      try {
        await handleLoadModels();
        await handleStartVideo();
      } catch (e: any) {
        console.error(e);
        throw Error(e);
      } finally {
        handleLoaderFalse();
      }
    })();
  }, []);

  const handleStartVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    if (videoRef && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream;
    }
  };

  /**
   * facial recognition 모델 로드
   */
  const handleLoadModels = async () => {
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL);
  };

  /**
   * webcam onPlay 시 얼굴인식 박스 및 landmark, 감정, 나이, 성별 감지
   */
  const handleOnPlay = async () => {
    const breads = [
      'Bread',
      'BreadWithGlasses',
      'SmilingBread',
      'SmilingBreadWithGlasses'
    ];
    const canvas = faceapi.createCanvasFromMedia(video); // 얼굴 인식 판별을 위한 canvas 생성
    const contents = document.getElementById('contents');
    contents && contents.append(canvas);

    // canvas = video 사이즈 동적으로 맞추기
    const displayValues = {
      width: canvas.width,
      height: canvas.height
    };

    // video, canvas 동기화
    faceapi.matchDimensions(canvas, displayValues);

    const labeledFaceDescriptors = await Promise.all(
      breads.map(async (bread) => {
        // fetch image data from urls and convert blob to HTMLImage element
        const imgUrl = `/images/${bread}.jpeg`;
        const img = await faceapi.fetchImage(imgUrl);

        // detect the face with the highest score in the image and compute it's landmarks and face descriptor
        const fullFaceDescription = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!fullFaceDescription) {
          throw new Error(`no faces detected for ${bread}`);
        }

        const faceDescriptors = [fullFaceDescription.descriptor];
        return new faceapi.LabeledFaceDescriptors(bread, faceDescriptors);
      })
    );

    setInterval(async () => {
      // 얼굴 인식 기능 인스턴스 생성
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()) // 얼굴 박스 가져오기
        .withFaceLandmarks() // 랜드마크 가져오기(눈코입 점)
        .withFaceExpressions() // 얼굴 감정 예측
        .withAgeAndGender() // 나이, 성별 예측
        .withFaceDescriptors();

      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
      const results = detections.map((fd) =>
        faceMatcher.findBestMatch(fd.descriptor)
      );

      // 사이즈 변형 감지
      const resizedDetections = faceapi.resizeResults(
        detections,
        displayValues
      );

      // 실제 얼굴 감지 그림 그리기
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections); // 얼굴 박스 그리기
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections); // 랜드마크 그리기
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections); // 감정 그리기
          resizedDetections.forEach((detection) => {
            const drawBox = new faceapi.draw.DrawTextField(
              Math.round(detection.age) + ' year old ' + detection.gender,
              { x: 0, y: 0 },
              { anchorPosition: AnchorPosition.BOTTOM_RIGHT }
            );
            drawBox.draw(canvas);
          }); // 나이 및 성별 그리기
          results.forEach((bestMatch, i) => {
            const box = detections[i].detection.box;
            const text = bestMatch.toString();
            const drawBox = new faceapi.draw.DrawBox(box, { label: text });
            drawBox.draw(canvas);
          });
        }
      }
    }, 1000);
  };

  return <WebcamPT videoRef={videoRef} onPlay={handleOnPlay} />;
};

interface typeWebcamCT extends CommonState {
  handleLoaderTrue: () => void;
  handleLoaderFalse: () => void;
}

export default WebcamCT;
