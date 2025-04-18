import React, { useEffect, useState } from 'react'
import style from './Dashboard.module.scss'
import { Buttoncomp, SingleFileUploader } from '../../stories';
import { useAuthContext } from '../../hooks';
import { removeFromSessionStorage, saveFile } from '../../Util/helper';
import { decryptWithIBE, encryptWithIBE, readPEMFile } from '../../Util/ibeCrypto';
import { computeSharedSecret, generateDHKeys } from '../../Util/dh';

type EncryptedType = {
  iv: string,
  data: string,
  ephemeralPublicKey: string
}

const Dashboard = () => {
  const {state,dispatch} = useAuthContext();
  const [file, setFile] = useState<File | null>(null);
  
  const [pubKey, setPubKey] = useState<File | null>(null);
  const [publicKeyPEM, setPublicKeyPEM] = useState('');
  const [encrypted, setEncrypted] = useState<string | EncryptedType>('');

  // IBE States
  const [priKey, setPriKey] = useState<File | null>(null);
  const [privateKeyPEM, setPrivateKeyPEM] = useState('');
  const [decrypted, setDecrypted] = useState<Uint8Array<ArrayBuffer> | string>('');
  const [received, setReceived] = useState<File | null>(null);
  const [recivedEncryptedContent, setRecivedEncryptedContent] = useState<string | EncryptedType>('');
  const [sharedSecret, setSharedSecret] = useState<Uint8Array | null>(null);

  // DH States
  const [myKeys, setMyKeys] = useState<{ privateKey: Uint8Array, publicKey: Uint8Array } | null>(null);

  useEffect(() => {
    const loadPEM = async () => {
      if (pubKey) {
        const pem = await readPEMFile(pubKey);
        setPublicKeyPEM(pem);
      }
    };
  
    loadPEM();
  }, [pubKey]);

  useEffect(() => {
    const loadPEM = async () => {
      if (priKey) {
        const pem = await readPEMFile(priKey);
        setPrivateKeyPEM(pem);
      }
    };
  
    loadPEM();
  }, [priKey]);

  useEffect(() => {
    if (received) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const json = JSON.parse(text);
          setRecivedEncryptedContent(json);
        } catch (err) {
          console.error("Failed to parse JSON file:", err);
        }
      };

      reader.readAsText(received);
    }
  }, [received]);

  const handleLogOut = () => {
    removeFromSessionStorage('ld');
    dispatch({type: 'logout'});
  }

  const handlePubKeyGeneration = () => {
    if(file){
      const blob = new Blob([file], {type : 'image/png'});
      saveFile(blob, 'my-file.png');
    }
  }

  const handleDHHalfKeyGeneration = async () => {
    const keys = generateDHKeys();
    setMyKeys(keys);
    
    try {
      const encryptedData = await encryptWithIBE(publicKeyPEM, String.fromCharCode(...keys.publicKey));
      const blob = new Blob([JSON.stringify(encryptedData, null, 2)], {
        type: 'application/json',
      });
      saveFile(blob,'encrypted-data.json')
      setEncrypted(encryptedData);
    } catch (err) {
      console.error('Encryption error:', err);
    }
  }

  const handleDHHalfKeyDecryption = async () => {
    try {
      const decryptedData = await decryptWithIBE(privateKeyPEM,(recivedEncryptedContent as EncryptedType).iv,(recivedEncryptedContent as EncryptedType).data,(recivedEncryptedContent as EncryptedType).ephemeralPublicKey);
      const byteArray = new Uint8Array(
        [...decryptedData].map(c => c.charCodeAt(0))
      );
      setDecrypted(byteArray);
      handleComputeSecret(byteArray);
    } catch (err) {
      console.error('Decryption error:', err);
    }
  };

  const handleComputeSecret = (theirPublic: Uint8Array) => {
    if (!myKeys) return;
    const secret = computeSharedSecret(theirPublic, myKeys.privateKey);
    setSharedSecret(secret);
  };

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
          <SingleFileUploader onValueChange={setPubKey} />
          {
            pubKey?
              <Buttoncomp label='Generate half key' onClick={handleDHHalfKeyGeneration} props={{className:style.upload}}/>
            :<></>
          }
        </div>
        <div className={style.thirdStep}>
          <div className={style.title}>Step 3: Upload second half diffie hellman and generate the shared secreate</div>
          <div>
            <div>
              <SingleFileUploader onValueChange={setPriKey} />
            </div>
            <div>
            <SingleFileUploader onValueChange={setReceived} />
              {
                priKey && received?
                <Buttoncomp label='Generate half key' onClick={handleDHHalfKeyDecryption} props={{className:style.upload}}/>
                :<></>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
