import React, { useEffect, useState } from "react";
import style from "./Dashboard.module.scss";
import {
  BackDrop,
  Buttoncomp,
  Inputcomp,
  SingleFileUploader,
} from "../../stories";
// import { useAuthContext } from "../../hooks";
import { 
  // removeFromSessionStorage, 
  saveFile 
} from "../../Util/helper";
import {
  decryptWithIBE,
  encryptWithIBE,
  readPEMFile,
  readPEMText,
} from "../../Util/ibeCrypto";
import { computeSharedSecret, generateDHKeys } from "../../Util/dh";
import { decryptPrivateKeyLocally } from "../../Util/PrivateKey";
import { callVerifyPost } from "../../APIs/Register.api";
import { Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../Util/constants";

type EncryptedType = {
  iv: string;
  data: string;
  ephemeralPublicKey: string;
};

const Dashboard = () => {
  // const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  const [pubKey, setPubKey] = useState<File | null>(null);
  const [publicKeyPEM, setPublicKeyPEM] = useState("");
  // @ts-ignore
  const [encrypted, setEncrypted] = useState<string | EncryptedType>("");

  // IBE States
  const [priKey, setPriKey] = useState<File | null>(null);
  const [privateKeyPEM, setPrivateKeyPEM] = useState("");
  const [decrypted, setDecrypted] = useState<Uint8Array<ArrayBuffer> | string>(
    ""
  );
  const [received, setReceived] = useState<File | null>(null);
  const [recivedEncryptedContent, setRecivedEncryptedContent] = useState<
    string | EncryptedType
  >("");
  const [sharedSecret, setSharedSecret] = useState<Uint8Array | null>(null);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // DH States
  const [myKeys, setMyKeys] = useState<{
    privateKey: Uint8Array;
    publicKey: Uint8Array;
  } | null>(null);

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
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const text = e.target?.result as string;
            const json = JSON.parse(text);
            handleDecryptFromFile(json);
          } catch (err) {
            console.error("Failed to parse JSON file:", err);
          }
        };

        reader.readAsText(priKey);
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
    return (
      <div className={style.popup}>
        <div className={style.title}>
          <h2>Shared Secreate Key</h2>
        </div>
        <div className={style.content}>
          <div className={style.keySection}>
            {myKeys?.privateKey && (
              <>
                <div className={style.keytitle}>
                  Private Key (alpha or beta):{" "}
                </div>
                <p>{btoa(String.fromCharCode(...myKeys.privateKey))}</p>
              </>
            )}
          </div>
          <div className={style.keySection}>
            {decrypted && (
              <>
                <div className={style.keytitle}>Recived half key: </div>
                <p>
                  {btoa(
                    String.fromCharCode(
                      ...(decrypted as Uint8Array<ArrayBuffer>)
                    )
                  )}
                </p>
              </>
            )}
          </div>
          <div className={style.keySection}>
            {sharedSecret && (
              <>
                <div className={style.keytitle}>
                  Calculated Shared Secreate:{" "}
                </div>
                <p>{btoa(String.fromCharCode(...sharedSecret))}</p>
              </>
            )}
          </div>
          <div className={style.keySection}>
            <Buttoncomp
              label="Download shared secrete key"
              onClick={handleSharedKeyDown}
            />
          </div>
        </div>
      </div>
    );
  };

  // Decrypt private key uploaded from machine.
  const handleDecryptFromFile = async (jsonData: {
    encrypted: string;
    salt: string;
  }) => {
    const pem = await decryptPrivateKeyLocally(
      jsonData.encrypted,
      jsonData.salt,
      password
    );
    const pemKey = await readPEMText(pem);
    setPrivateKeyPEM(pemKey);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSharedKeyDown = () => {
    if (sharedSecret) {
      const pemString = `-----BEGIN SHARED SECRET-----\n${btoa(
        String.fromCharCode(...sharedSecret)
      )}\n-----END SHARED SECRET-----`;
      const blob = new Blob([pemString], { type: "application/x-pem-file" });
      saveFile(blob, "sharedKey.pem");

      // const blob = new Blob([btoa(String.fromCharCode(...sharedSecret))], { type: 'text/plain' });
      // saveFile(blob, 'sharedKey.txt');
    }
  };

  const handleRegister = () => {
    // removeFromSessionStorage("ld");
    // dispatch({ type: "logout" });
    navigate(ROUTES.signup);
  };

  const handleClose = () => {
    setOpen((prev) => !prev);
  };

  const handlePubKeyGeneration = () => {
    if (file) {
      const verifyData = new FormData();
      verifyData.append("image", file);
      verifyData.append("email", email);

      callVerifyPost(verifyData)
        .then((resp) => {
          const blob = new Blob([resp.data.public_key], {
            type: "application/x-pem-file",
          });
          saveFile(blob, "publicKey.pem");
          setAlertContent("Public key is generated.");
          setShowAlert(true);
        })
        .catch((err) => {
          setAlertContent(err.response.data.detail);
          setShowAlert(true);
          console.log(err.response.data.detail);
        });

      // const blob = new Blob(
      //   [
      //     "-----BEGIN PUBLIC KEY-----MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAER+pgY3Hqykg/bgLHpsfs9Aj3LJOaBTjNCImGJWZUVTH/vBMhqVrHBG4b1ywORJnbvRXEJi5ZGqKCCr4ULSbpjw==-----END PUBLIC KEY-----",
      //   ],
      //   { type: "application/x-pem-file" }
      // );
      // saveFile(blob, "publicKey.pem");
      // setAlertContent("Public key is generated.");
      // setShowAlert(true);
    }
  };

  const handleDHHalfKeyGeneration = async () => {
    const keys = generateDHKeys();
    setMyKeys(keys);

    try {
      const encryptedData = await encryptWithIBE(
        publicKeyPEM,
        String.fromCharCode(...keys.publicKey)
      );
      const blob = new Blob([JSON.stringify(encryptedData, null, 2)], {
        type: "application/json",
      });
      setAlertContent("Half Diffie hellman key generated.");
      setShowAlert(true);
      saveFile(blob, "encryptedData.json");
      setEncrypted(encryptedData);
    } catch (err) {
      console.error("Encryption error:", err);
    }
  };

  const handleDHHalfKeyDecryption = async () => {
    try {
      const decryptedData = await decryptWithIBE(
        privateKeyPEM,
        (recivedEncryptedContent as EncryptedType).iv,
        (recivedEncryptedContent as EncryptedType).data,
        (recivedEncryptedContent as EncryptedType).ephemeralPublicKey
      );
      const byteArray = new Uint8Array(
        [...decryptedData].map((c) => c.charCodeAt(0))
      );
      setDecrypted(byteArray);
      handleComputeSecret(byteArray);
    } catch (err) {
      console.error("Decryption error:", err);
    }
  };

  const handleComputeSecret = (theirPublic: Uint8Array) => {
    if (!myKeys) return;
    const secret = computeSharedSecret(theirPublic, myKeys.privateKey);
    setAlertContent("Shared secrete key is calculated.");
    setSharedSecret(secret);
    setShowAlert(true);

    handleClose();
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className={style.container}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        open={showAlert}
        onClose={() => {
          setShowAlert(false);
        }}
        message={alertContent}
        key={alertContent}
        autoHideDuration={6000}
      />
      <div className={style.upperConainer}>
        <h2 className={style.contect}>Establish Diffie Hellman Key</h2>
        <Buttoncomp label="Register" onClick={handleRegister}></Buttoncomp>
      </div>
      <div className={style.inContainer}>
        <div className={style.firstStep}>
          <div className={style.title}>Step 1: Upload Image</div>
          <div className={style.email}>
            <Inputcomp
              label="Email"
              placeholder="Enter your Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
            ></Inputcomp>
          </div>
          <SingleFileUploader onValueChange={setFile} />
          {file && email ? (
            <Buttoncomp
              label="Get Public Key"
              onClick={handlePubKeyGeneration}
              props={{ className: style.upload }}
            />
          ) : (
            <></>
          )}
        </div>
        <div className={style.secondStep}>
          <div className={style.title}>
            Step 2: Generate half diffie hellman & Encrypt with IBE public key
          </div>
          <SingleFileUploader onValueChange={setPubKey} />
          {pubKey ? (
            <Buttoncomp
              label="Generate half key"
              onClick={handleDHHalfKeyGeneration}
              props={{ className: style.upload }}
            />
          ) : (
            <></>
          )}
        </div>
        <div className={style.thirdStep}>
          <div className={style.title}>
            Step 3: Upload second half diffie hellman and generate the shared
            secrete
          </div>
          <div>
            <div className={style.password}>
              <Inputcomp
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
              ></Inputcomp>
            </div>
            {password && (
              <>
                <div className={style.title}>Upload your IBE private key</div>
                <div>
                  <SingleFileUploader onValueChange={setPriKey} />
                </div>
              </>
            )}
            <div>
              <div className={style.title}>Upload half diffie hellman key</div>
              <SingleFileUploader onValueChange={setReceived} />
              {priKey && received && password ? (
                <div className={style.buttons}>
                  <Buttoncomp
                    label="Generate shared secrete key"
                    onClick={handleDHHalfKeyDecryption}
                  />
                  <Buttoncomp
                    label="Generate another key."
                    onClick={handleReload}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>

      <BackDrop open={open} handleClose={handleClose} child={<KeyContent />} />
    </div>
  );
};

export default Dashboard;
