import React from 'react';
import OnDragEnterDisplay from './OnDragEnterDisplay';

const Dropzone = ({ checkAndCreate, children, isOver, setIsOver }) => {
  const dragOver = (e) => {
    e.preventDefault();
  };

  const dragEnter = (e) => {
    e.preventDefault();
    if (!isOver) {
      setIsOver(true);
    }
  };

  const dragLeave = (e) => {
    e.preventDefault();
    if (isOver) {
      setIsOver(false);
    }
  };

  const fileDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    await checkAndCreate(files);
    setIsOver(false);
  };

  return (
    <div
      onDragOver={dragOver}
      onDragEnter={dragEnter}
      onDragLeave={dragLeave}
      onDrop={fileDrop}
      className='dropzone'
    >
      {children}
      <OnDragEnterDisplay isOver={isOver} />
    </div>
  );
};

export default Dropzone;
