import React, { useState, useEffect } from 'react';
import Loader from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const Loading = (props?: any) => {
  const { classLoader, type } = props;
  let tmpSize: any;
  if (props && props.size) {
    tmpSize = props.size;
  } else {
    tmpSize = window.innerWidth;
  }

  const [widthLoader, setWidthLoader] = useState<number>(tmpSize * 0.40)
  const [typeLoader, setTypeLoader] = useState<any>(type)

  useEffect(() => {
    setWidthLoader(widthLoader);
    setTypeLoader(type);
    console.log('hooooLLLL')
  }, [type, widthLoader])
  
  return(
    <span className={classLoader}>
      <Loader
        type={typeLoader}
        color="#aa2109"
        height={widthLoader}
        width={widthLoader}
        timeout={50000}
      />
    </span>
   );
}

export default Loading;