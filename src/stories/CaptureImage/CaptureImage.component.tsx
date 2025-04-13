import React, { useCallback, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { StyledContainer, StyledImageContainer } from './CaptureImage.styled'
import Buttoncomp from '../Button'

type CaptureImagePropType = {
    height?: number,
    width?: number
    onChange?: Function
}

function CaptureImage(props:CaptureImagePropType) {
    const imageRef = useRef(null);
    const [imgSrc, setImgSrc] = useState<React.Ref<Webcam> | null>(null);

    const capture = useCallback(() => {
        const imageSrc = imageRef?.current?.getScreenshot();
        setImgSrc(imageSrc);
        if(props.onChange){
            props?.onChange(imageSrc);
        }
    }, [imageRef]);

    const retake = () => {
        if(props.onChange){
            props?.onChange(null);
        }
        setImgSrc(null);
    };

    return (
        <StyledContainer>
            <StyledImageContainer>
                {
                    imgSrc?(
                        <img src={imgSrc} alt='webcam' className='image'/>
                    ):
                    (
                        <Webcam 
                            height={props.height} 
                            width={props.width} 
                            ref={imageRef}
                            screenshotFormat="image/jpeg"
                            screenshotQuality={0.8}>
                        </Webcam>
                    )
                }
            </StyledImageContainer>
            <div className="btn-container">
                {imgSrc ? (
                    <Buttoncomp onClick={retake} label='Retake photo'/>
                    ) : (
                    <Buttoncomp onClick={capture} label='Capture photo'/>
                    )
                }
            </div>
        </StyledContainer>
    )
}

export default CaptureImage