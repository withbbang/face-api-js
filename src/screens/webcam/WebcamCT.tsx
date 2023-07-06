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
      '상남자',
      '안경쓴상남자',
      '웃는상남자',
      '안경쓰고웃는상남자'
    ]; // 특정 인물 사진 배열
    const threshold = 0.38; // 임계점. 임계점을 기준으로 video 내의 얼굴과 라벨링된 사진이 매칭되는지 판단한다.
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

    // 특정 인물 사진을 인식한 라벨링된 객체 생성
    const labeledFaceDescriptors = await Promise.all(
      breads.map(async (bread) => {
        const imgUrl = `/images/${bread}.jpeg`;
        // const imgUrl = `/images/${bread}.jpg`;
        const img = await faceapi.fetchImage(imgUrl);

        // 특정 인물 사진 인식 객체 생성
        const fullFaceDescription = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!fullFaceDescription) {
          throw new Error(`no faces detected for ${bread}`);
        }

        // 각 얼굴 인식 디스크립터들 담기
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

      // 라벨링된 얼굴 디스트립터 및 임계점으로, video 내의 얼굴들과 매칭할 비교 인스턴스 생성
      const faceMatcher = new faceapi.FaceMatcher(
        labeledFaceDescriptors,
        threshold
      );

      // 라벨링된 얼굴들과 video내의 얼굴들을 비교한 결과값 저장
      const results = detections.map(({ descriptor }) =>
        faceMatcher.findBestMatch(descriptor)
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
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections); // 감정 쓰기
          resizedDetections.forEach(({ detection, age, gender }) => {
            const { x, y, width, height } = detection.box;
            const drawBox = new faceapi.draw.DrawTextField(
              Math.round(age) + ' year old, ' + gender,
              { x: x + width, y: y + height },
              {
                anchorPosition: AnchorPosition.BOTTOM_RIGHT,
                backgroundColor: 'rgba(0, 0, 0, 0)'
              }
            );
            drawBox.draw(canvas);
          }); // 나이 및 성별 쓰기
          results.forEach((bestMatch, i) => {
            const box = detections[i].detection.box;
            const text = bestMatch.toString();
            const drawBox = new faceapi.draw.DrawBox(box, { label: text });
            drawBox.draw(canvas);
            // TODO: threshold > bestMatch.distance 일 경우 얼굴 데이터 수집
          }); // 라벨링된 얼굴과 매칭될 시 이름 쓰기
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
