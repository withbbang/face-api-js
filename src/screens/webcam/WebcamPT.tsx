import React from 'react';
import Loader from 'components/loader';
import styles from './Webcam.module.scss';

const WebcamPT = ({ videoRef, onPlay }: typeWebcamPT): JSX.Element => {
  return (
    <>
      <Loader />
      <div className={styles.wrap}>
        <div className={styles.contents} id={'contents'}>
          <video id={'video'} onPlay={onPlay} ref={videoRef} autoPlay />
        </div>
      </div>
    </>
  );
};

interface typeWebcamPT {
  videoRef: any;
  onPlay: () => void;
}

export default WebcamPT;
