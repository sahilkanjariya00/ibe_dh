import React, { useEffect, useState } from 'react'
import style from './Dashboard.module.scss'
import { Buttoncomp, SingleFileUploader } from '../../stories';
import { useAuthContext } from '../../hooks';
import { removeFromSessionStorage, saveFile } from '../../Util/helper';

type UserDataType = {
  uuid: string,
  name: string,
  email: string,
  pubKey: string
}

const DATA = [
  {uuid: '1', name: 'sahil', email: 'sahil@gmail.com', pubKey: '1'},
  {uuid: '2', name: 'prathmesh', email: 'prathmesh@gmail.com', pubKey: '2'},
  {uuid: '3', name: 'souvik', email: 'souvik@gmail.com', pubKey: '3'},
  {uuid: '4', name: 'varun', email: 'varun@gmail.com', pubKey: '4'},
]

const Dashboard = () => {
  const {state,dispatch} = useAuthContext();
  const [userData, setUserData] = useState<UserDataType[]>();
  const [file, setFile] = useState<File | null>(null);

  useEffect(()=>{
    setUserData(DATA);
  },[])

  const handleLogOut = () => {
    removeFromSessionStorage('ld');
    dispatch({type: 'logout'});
  }

  const handlePubKeyGeneration = () => {
    if(file){
      const blob = new Blob([file], {type : 'image/png'});
      saveFile(blob);
    }

  }

  return (
    <div className={style.container}>
      <div className={style.upperConainer}>
        <h2 className={style.contect}>Establish Diffie Hellman Key</h2>
        <Buttoncomp label='Logout' onClick={handleLogOut}></Buttoncomp>
      </div>
      <div className={style.inContainer}>
        <div className={style.firstStep}>
          <div className={style.title}>Step 1: Upload Image</div>
          <SingleFileUploader onValueChange={setFile} />
          {
            file?
              <Buttoncomp label='Upload' onClick={handlePubKeyGeneration} props={{className:style.upload}}/>
            :<></>
          }
        </div>
        <div className={style.secondStep}>
          <div className={style.title}>Step 2: Generate half diffie hellman & Encrypt with public key</div>
        </div>
        <div className={style.thirdStep}>
          <div className={style.title}>Step 3: Upload second half diffie hellman and generate the shared secreate</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard