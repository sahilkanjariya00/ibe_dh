import React, { useEffect, useState } from 'react';
import { StyledInput, Styledtitle } from './FileUpload.styled';

type SingleFileUploaderProps = {
    onValueChange: React.Dispatch<React.SetStateAction<File | null>>;
}

const SingleFileUploader = (props:SingleFileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(()=>{
    props.onValueChange(file);
  },[file])


  return (
    <>
      <StyledInput>
        <input id="file" type="file" onChange={handleFileChange} />
      </StyledInput>
      {file && (
        <section>
          <Styledtitle>File details: </Styledtitle>
          <ul>
            <li><Styledtitle>Name: </Styledtitle> {file.name}</li>
            <li><Styledtitle>Type: </Styledtitle> {file.type}</li>
            <li><Styledtitle>Size: </Styledtitle> {file.size} bytes</li>
          </ul>
        </section>
      )}
    </>
  );
};

export default SingleFileUploader;