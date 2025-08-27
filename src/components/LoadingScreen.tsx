import React from 'react';
import styled from 'styled-components';
import Loader from './Loader';

const LoadingScreen = () => {
  return (
    <LoadingContainer>
      <LoaderWrapper>
        <Loader  />
      </LoaderWrapper>
    </LoadingContainer>
  );
};

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoaderWrapper = styled.div`
  transform: scale(1.5); /* Makes the loader bigger */
`;

export default LoadingScreen;
