import React, { useEffect } from 'react';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';
import * as faceapi from 'face-api.js';
import IndexPT from './IndexPT';

const MODEL_URL = '/models';

const IndexCT = ({
  handleLoaderTrue,
  handleLoaderFalse
}: typeIndexCT): JSX.Element => {
  // const groupPhoto: any = document.getElementById('groupPhoto'); // Face Matcher에 기준이 되는 사진
  const img: any = document.getElementById('img');
  const canvas: any = document.getElementById('canvas');
  const displaySize = { width: 300, height: 400 };

  useEffect(() => {
    (async () => {
      handleLoaderTrue();
      await handleLoadModels();
      await handleDetectFace();
      handleDisplayDetectionResult();
      handleLoaderFalse();
    })();
  }, []);

  /**
   * facial recognition 모델 로드
   */
  const handleLoadModels = async () => {
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);
  };

  /**
   * facial recognition
   */
  const handleDetectFace = async () => {
    // 얼굴이 다수일 때
    // const detections = await faceapi
    //   .detectAllFaces(img)
    //   .withFaceLandmarks()
    //   .withFaceDescriptors();

    // 얼굴이 한개일 때
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    // SsdMobilenetv1Options 모델 사용
    const detection1 = await faceapi.detectAllFaces(
      img,
      new faceapi.SsdMobilenetv1Options()
    );

    // TinyFaceDetectorOptions 모델 사용
    // const detection2 = await faceapi.detectAllFaces(
    //   img,
    //   new faceapi.TinyFaceDetectorOptions()
    // );
  };

  /**
   * 얼굴 랜드마크들(얼굴의 특징 점들) 받아오기
   */
  const handleFaceLandmarks = async () => {
    // 얼굴이 다수일 때
    // const detectionsWithLandmarks = await faceapi.detectAllFaces(img).withFaceLandmarks();

    // 얼굴이 한개일 때
    const detectionWithLandmarks = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks();
  };

  /**
   * 얼굴 인식 값들 계산하기
   */
  const handleComputeFaceDescriptors = async () => {
    // 얼굴이 다수일 때
    // const results = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();

    // 얼굴이 한개일 때
    const result = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();
  };

  /**
   * 얼굴 표정 인식
   */
  const handleRecognizeFaceExpressions = async () => {
    // 얼굴이 다수일 때
    // const detectionsWithExpressions = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceExpressions();

    // 얼굴이 한개일 때
    const detectionWithExpressions = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceExpressions();
  };

  /**
   * 나이 및 성별 검사
   */
  const handleEstimateAgeGender = async () => {
    // 얼굴이 다수일 때
    // const detectionsWithAgeAndGender = await faceapi.detectAllFaces(img).withFaceLandmarks().withAgeAndGender();

    // 얼굴이 한개일 때
    const detectionWithAgeAndGender = await faceapi
      .detectSingleFace(img)
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
    //   .detectAllFaces(img)
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
    //   .detectSingleFace(img)
    //   .withFaceLandmarks()
    //   .withFaceDescriptor();
    // if (singleResult) {
    //   const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor);
    //   console.log(bestMatch.toString());
    // }
  };

  const handleDisplayDetectionResult = async () => {
    // resize the overlay canvas to the input dimensions
    faceapi.matchDimensions(canvas, displaySize);

    /* Display detected face bounding boxes */
    const detections = await faceapi.detectAllFaces(img);
    // resize the detected boxes in case your displayed image has a different size than the original
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    // draw detections into the canvas
    faceapi.draw.drawDetections(canvas, resizedDetections);

    // 얼굴이 한개일 때
    /* Display face landmarks */
    const detectionsWithLandmarks = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks();
    // resize the detected boxes and landmarks in case your displayed image has a different size than the original
    const resizedResults = faceapi.resizeResults(
      detectionsWithLandmarks,
      displaySize
    );
    // draw detections into the canvas
    faceapi.draw.drawDetections(canvas, resizedResults);
    // draw the landmarks into the canvas
    faceapi.draw.drawFaceLandmarks(canvas, resizedResults);

    // 얼굴이 다수일 때
    /* Display face expression results */
    // const detectionsWithExpressions = await faceapi
    //   .detectAllFaces(img)
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

  return <IndexPT />;
};

interface typeIndexCT extends CommonState {
  handleLoaderTrue: () => void;
  handleLoaderFalse: () => void;
}

export default IndexCT;
