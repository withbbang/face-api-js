import React from 'react';
import Loader from 'components/loader';
import styles from './Webcam.module.scss';

const WebcamPT = ({ videoRef }: typeWebcamPT): JSX.Element => {
  return (
    <>
      <Loader />
      <div className={styles.wrap}>
        <div className={styles.contents}>
          <video id={'video'} ref={videoRef} autoPlay />
          <canvas id={'canvas'} />
        </div>
      </div>
    </>
  );
};

interface typeWebcamPT {
  videoRef: any;
}

export default WebcamPT;
