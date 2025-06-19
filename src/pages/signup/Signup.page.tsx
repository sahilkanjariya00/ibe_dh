import React from "react";
import { Form, Field } from "react-final-form";
import styles from "./Signup.module.scss";
import { Buttoncomp, CaptureImage, Inputcomp } from "../../stories";
import { ERRORMESSAGES, ROUTES } from "../../Util/constants";
// import { useAuthContext } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { callRegisterPost } from "../../APIs/Register.api";
import {
  decryptPrivateKey,
  encryptPrivateKeyLocally,
} from "../../Util/PrivateKey";
import { saveFile } from "../../Util/helper";
import { useLoaderContext } from "../../hooks";

type LoginFormType = {
  email: string;
  password: string;
  image: string;
};

// const base64ToFile = (base64: string, filename: string): File => {
//   const arr = base64.split(',');
//   const mime = (arr[0].match(/:(.*?);/) as RegExpMatchArray)[1];
//   const bstr = atob(arr[1]);
//   let n = bstr.length;
//   const u8arr = new Uint8Array(n);
  
//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n);
//   }
  
//   return new File([u8arr], filename, { type: mime });
// };

// if (val.image instanceof File) {
    //   registerData.append("image", val.image);
    // } else if (typeof val.image === 'string') {
    //   // If image is base64 string, convert to File object
    //   const file = base64ToFile(val.image, 'profile.jpg');
    //   registerData.append("image", file);
    // }

const SignupPage = () => {
  const navigate = useNavigate();
  
  // const { dispatch } = useAuthContext();
  const {dispatch} = useLoaderContext();

  function base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  

  // @ts-ignore
  const onSubmit = (val: LoginFormType) => {
    dispatch({type: 'showloader'});
    const registerData = new FormData();
    registerData.append("email", val.email);
    registerData.append("password", val.password);
    // registerData.append("image", val.image);
    const imageFile = base64ToFile(val.image, 'uploaded-image.jpeg');
    registerData.append("image", imageFile);

    callRegisterPost(registerData)
      .then((resp) => {
        handleDecryption(
          resp.data.encrypted_private_key,
          resp.data.encryption_salt,
          val.password
        );
        navigate(ROUTES.default);
        dispatch({type: 'hideloader'});
        // dispatch({ type: "login", payload: { email: val.email } });
      })
      .catch((err) => {
        dispatch({type: 'hideloader'});
        console.log(err);
      });
  };

  // Handles the private key decryption after receiving in the api
  async function handleDecryption(
    encrypted: string,
    salt: string,
    password: string
  ) {
    try {
      const privateKeyPEM = await decryptPrivateKey(encrypted, salt, password);

      const { encryptedHex, saltHex } = await encryptPrivateKeyLocally(
        privateKeyPEM,
        password
      );
      const blob = new Blob(
        [JSON.stringify({ encrypted: encryptedHex, salt: saltHex }, null, 2)],
        { type: "application/json" }
      );
      saveFile(blob, "privateKey.json");
    } catch (error) {
      console.error("Decryption failed:", error);
    }
  }

  // @ts-ignore
  const handleDashboard = (e: React.MouseEvent<HTMLElement>) => {
    navigate(ROUTES.default);
  };

  const validationfn = (val: LoginFormType) => {
    const errors: { email?: string; password?: string } = {};

    if (!val.email) {
      errors.email = ERRORMESSAGES.emailError;
    }

    if (!val.password) {
      errors.password = ERRORMESSAGES.passError;
    }
    return errors;
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.loginContainer}>
          <h2 className={styles.formTitle}>Sign in</h2>
          <Form
            onSubmit={onSubmit}
            validate={validationfn}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className={styles.inputContainer}>
                  <Field name="email">
                    {({ input, meta }) => (
                      <div>
                        <div>
                          <Inputcomp
                            label="Email Address"
                            placeholder="Enter your email"
                            {...input}
                          ></Inputcomp>
                        </div>
                        {meta.touched && meta.error && (
                          <span className="error">{meta.error}</span>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

                <div className={styles.inputContainer}>
                  <Field name="password">
                    {({ input, meta }) => (
                      <div>
                        <div>
                          <Inputcomp
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                            {...input}
                          ></Inputcomp>
                        </div>
                        {meta.touched && meta.error && (
                          <span className="error">{meta.error}</span>
                        )}
                      </div>
                    )}
                  </Field>
                </div>

                <div className={styles.inputContainer}>
                  <Field name="image">
                    {({ input, meta }) => {
                      // console.log(input)
                      return (
                        <div>
                          <div className={styles.capturePhoto}>
                            <CaptureImage
                              height={200}
                              width={200}
                              onChange={input.onChange}
                            />
                          </div>
                          {meta.touched && meta.error && (
                            <span className="error">{meta.error}</span>
                          )}
                        </div>
                      );
                    }}
                  </Field>
                </div>

                <Buttoncomp
                  label="Sgin In"
                  props={{ variant: "contained", type: "submit" }}
                ></Buttoncomp>
              </form>
            )}
          />
          <div className={styles.signup}>
            <p className="link" onClick={handleDashboard}>
              Dashboard
            </p>{" "}
            here.
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
