import React from 'react';
import Loader from 'components/loader';
import styles from './Image.module.scss';

const ImagePT = ({}: typeImagePT): JSX.Element => {
  return (
    <>
      <Loader />
      <div className={styles.wrap}>
        <div className={styles.contents}>
          {/* <img id={'groupPhoto'} src={'/images/groupPhoto.jpeg'} /> */}
          <img id={'img'} src={'/images/hssong.jpg'} />
          <canvas id={'canvas'} />
        </div>
      </div>
    </>
  );
};

interface typeImagePT {}

export default ImagePT;
