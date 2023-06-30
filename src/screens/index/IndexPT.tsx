import React from 'react';
import Loader from 'components/loader';
import styles from './Index.module.scss';

const IndexPT = ({}: typeIndexPT): JSX.Element => {
  return (
    <>
      <Loader />
      <div className={styles.wrap}>
        <h1>Index Page</h1>
        <div className={styles.contents}>
          {/* <img id={'groupPhoto'} src={'/images/groupPhoto.jpeg'} /> */}
          <img id={'img'} src={'/images/hssong.jpg'} />
          <canvas id={'canvas'} />
        </div>
      </div>
    </>
  );
};

interface typeIndexPT {}

export default IndexPT;
