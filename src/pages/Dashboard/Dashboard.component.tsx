import React, { useEffect, useState } from 'react'
import style from './Dashboard.module.scss'
import { BackDrop, Buttoncomp, SingleFileUploader } from '../../stories';
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

  const [open, setOpen] = useState(false);

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

  const KeyContent = () => {
    return <div className={style.popup}>
      <div className={style.title}>
        <h2>Shared Secreate Key</h2>
      </div>
      <div className={style.content}>
        <div className={style.keySection}>
          {myKeys?.privateKey && 
            <>
              <div className={style.keytitle}>Private Key (alpha or beta): </div>
              <p>{btoa(String.fromCharCode(...myKeys.privateKey))}</p>
            </>
          }
        </div>
        <div className={style.keySection}>
          {decrypted && 
            <>
              <div className={style.keytitle}>Recived half key: </div>
              <p>{btoa(String.fromCharCode(...(decrypted as Uint8Array<ArrayBuffer>)))}</p>
            </>
          }
        </div>
        <div className={style.keySection}>
          {sharedSecret && 
            <>
              <div className={style.keytitle}>Calculated Shared Secreate: </div>
              <p>{btoa(String.fromCharCode(...sharedSecret))}</p>
            </>
          }
        </div>
        <div className={style.keySection}>
          <Buttoncomp label='Download shared secrete key' onClick={handleSharedKeyDown}/>
        </div>
      </div>
    </div>
  }

  const handleSharedKeyDown = () => {
    if(sharedSecret){
      const pemString = `-----BEGIN SHARED SECRET-----\n${btoa(String.fromCharCode(...sharedSecret))}\n-----END SHARED SECRET-----`;
      const blob = new Blob([pemString], { type: 'application/x-pem-file' });
      saveFile(blob, 'sharedKey.pem');

      // const blob = new Blob([btoa(String.fromCharCode(...sharedSecret))], { type: 'text/plain' });
      // saveFile(blob, 'sharedKey.txt');
    }
  }

  const handleLogOut = () => {
    removeFromSessionStorage('ld');
    dispatch({type: 'logout'});
  }

  const handleClose = () => {
    setOpen((prev)=>!prev);
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

    handleClose();
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

      <BackDrop  
        open={open} 
        handleClose={handleClose}
        child={<KeyContent/>}
      />
    </div>
  )
}

export default Dashboard
