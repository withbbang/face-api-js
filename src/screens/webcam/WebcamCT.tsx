import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';
import WebcamPT from './WebcamPT';
import { MtcnnOptions } from 'face-api.js';
import { CustomMtcnnOptions } from 'modules/utils';

const MODEL_URL = '/models';

const WebcamCT = ({
  handleLoaderTrue,
  handleLoaderFalse
}: typeWebcamCT): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const video: any = document.getElementById('video') as HTMLVideoElement;
  const canvas = document.getElementById('video') as HTMLCanvasElement;

  useEffect(() => {
    (async () => {
      handleLoaderTrue();
      try {
        await handleStartVideo();
        await handleLoadModels();
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
    await faceapi.loadMtcnnModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
  };

  /**
   * webcam 얼굴 추적 인식 기능 초기화
   */
  const handleInitTrack = async () => {
    const mtcnnForwardParams = new CustomMtcnnOptions();

    const mtcnnResults = await faceapi.mtcnn(video, mtcnnForwardParams);

    mtcnnResults.forEach(handleDrawDetection);
    // FIXME: 바닐라 js 작업해야할지 결정해야함
    faceapi.drawLandmarks(
      'overlay',
      mtcnnResults.map((res) => res.faceLandmarks),
      { lineWidth: 4, color: 'red' }
    );
  };

  const handleDrawDetection = (
    result: faceapi.WithFaceLandmarks<
      {
        detection: faceapi.FaceDetection;
      },
      faceapi.FaceLandmarks5
    >
  ) => {
    const { x, y, width, height } = result.detection.box;

    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    // 얼굴 경계 상자 그리기
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = 'red';
    context.rect(x, y, width, height);
    context.stroke();
  };

  /**
   * facial recognition
   */
  const handleDetectFace = async () => {
    // 얼굴이 다수일 때
    // const detections = await faceapi
    //   .detectAllFaces(video)
    //   .withFaceLandmarks()
    //   .withFaceDescriptors();

    // 얼굴이 한개일 때
    const detection = await faceapi
      .detectSingleFace(video)
      .withFaceLandmarks()
      .withFaceDescriptor();

    // SsdMobilenetv1Options 모델 사용
    const detection1 = await faceapi.detectAllFaces(
      video,
      new faceapi.SsdMobilenetv1Options()
    );

    // TinyFaceDetectorOptions 모델 사용
    // const detection2 = await faceapi.detectAllFaces(
    //   video,
    //   new faceapi.TinyFaceDetectorOptions()
    // );
  };

  /**
   * 얼굴 랜드마크들(얼굴의 특징 점들) 받아오기
   */
  const handleFaceLandmarks = async () => {
    // 얼굴이 다수일 때
    // const detectionsWithLandmarks = await faceapi.detectAllFaces(video).withFaceLandmarks();

    // 얼굴이 한개일 때
    const detectionWithLandmarks = await faceapi
      .detectSingleFace(video)
      .withFaceLandmarks();
  };

  /**
   * 얼굴 인식 값들 계산하기
   */
  const handleComputeFaceDescriptors = async () => {
    // 얼굴이 다수일 때
    // const results = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();

    // 얼굴이 한개일 때
    const result = await faceapi
      .detectSingleFace(video)
      .withFaceLandmarks()
      .withFaceDescriptor();
  };

  /**
   * 얼굴 표정 인식
   */
  const handleRecognizeFaceExpressions = async () => {
    // 얼굴이 다수일 때
    // const detectionsWithExpressions = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceExpressions();

    // 얼굴이 한개일 때
    const detectionWithExpressions = await faceapi
      .detectSingleFace(video)
      .withFaceLandmarks()
      .withFaceExpressions();
  };

  /**
   * 나이 및 성별 검사
   */
  const handleEstimateAgeGender = async () => {
    // 얼굴이 다수일 때
    // const detectionsWithAgeAndGender = await faceapi.detectAllFaces(video).withFaceLandmarks().withAgeAndGender();

    // 얼굴이 한개일 때
    const detectionWithAgeAndGender = await faceapi
      .detectSingleFace(video)
      .withFaceLandmarks()
      .withAgeAndGender();
  };

  /**
   * 얼굴 매칭하기
   */
  const handleFaceMatching = async () => {
    // 기준이 되는 사진에 얼굴들 인식
    // const results = await faceapi
    //   .detectAllFaces(groupPhoto)
    //   .withFaceLandmarks()
    //   .withFaceDescriptors();
    //
    // if (!results.length) {
    //   return;
    // }
    //
    // 매칭 객체 생성
    // const faceMatcher = new faceapi.FaceMatcher(results);
    //
    // 얼굴이 다수일 때
    // const multipleResults = await faceapi
    //   .detectAllFaces(video)
    //   .withFaceLandmarks()
    //   .withFaceDescriptors();
    //
    // multipleResults.forEach((fd) => {
    //   const bestMatch = faceMatcher.findBestMatch(fd.descriptor);
    //   console.log(bestMatch.toString());
    // });
    //
    // 얼굴이 한개일 때
    // const singleResult = await faceapi
    //   .detectSingleFace(video)
    //   .withFaceLandmarks()
    //   .withFaceDescriptor();
    // if (singleResult) {
    //   const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor);
    //   console.log(bestMatch.toString());
    // }
  };

  const handleDisplayDetectionResult = async () => {
    // resize the overlay canvas to the input dimensions
    // TODO: 동적으로 사이즈 설정해야함
    let displaySize = { width: 640, height: 480 };
    // if (videoRef.current) {
    //   const { width, height } = videoRef.current;
    //   displaySize = { width, height };
    // }

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    faceapi.matchDimensions(canvas, displaySize);

    /* Display detected face bounding boxes */
    const detections = await faceapi.detectAllFaces('video');

    // resize the detected boxes in case your displayed image has a different size than the original
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    // draw detections into the canvas
    faceapi.draw.drawDetections(canvas, resizedDetections);

    /* Display face landmarks */
    const detectionsWithLandmarks = await faceapi
      .detectAllFaces('video')
      .withFaceLandmarks();

    // resize the detected boxes and landmarks in case your displayed image has a different size than the original
    const resizedResults = faceapi.resizeResults(
      detectionsWithLandmarks,
      displaySize
    );

    // draw the landmarks into the canvas
    faceapi.draw.drawFaceLandmarks(canvas, resizedResults);

    /* Display face expression results */
    // const detectionsWithExpressions = await faceapi
    //   .detectAllFaces(video)
    //   .withFaceLandmarks()
    //   .withFaceExpressions()
    // resize the detected boxes and landmarks in case your displayed image has a different size than the original
    // const resizedResults = faceapi.resizeResults(detectionsWithExpressions, displaySize)
    // draw detections into the canvas
    // faceapi.draw.drawDetections(canvas, resizedResults)
    // draw a textbox displaying the face expressions with minimum probability into the canvas
    // const minProbability = 0.05
    // faceapi.draw.drawFaceExpressions(canvas, resizedResults, minProbability)
  };

  return <WebcamPT videoRef={videoRef} />;
};

interface typeWebcamCT extends CommonState {
  handleLoaderTrue: () => void;
  handleLoaderFalse: () => void;
}

export default WebcamCT;
