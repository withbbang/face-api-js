import React from 'react';
import { NavigateFunction } from 'react-router-dom';
import Loader from 'components/loader';
import styles from './Index.module.scss';

const IndexPT = ({ navigate }: typeIndexPT): JSX.Element => {
  return (
    <>
      <Loader />
      <div className={styles.wrap}>
        <h1>Facial Recognition</h1>
        <div className={styles.buttons}>
          <button onClick={() => navigate('/webcam')}>Webcam</button>
        </div>
      </div>
    </>
  );
};

interface typeIndexPT {
  navigate: NavigateFunction;
}

export default IndexPT;
