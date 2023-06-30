import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IndexPT from './IndexPT';
import { CommonState } from 'middlewares/reduxToolkits/commonSlice';

const IndexCT = ({}: typeIndexCT): JSX.Element => {
  const navigate = useNavigate(); // router 제어 훅

  return <IndexPT navigate={navigate} />;
};

interface typeIndexCT extends CommonState {
  handleLoaderTrue: () => void;
  handleLoaderFalse: () => void;
}

export default IndexCT;
