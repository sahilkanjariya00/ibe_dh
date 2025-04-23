import React from "react";
import { Form, Field } from "react-final-form";
import styles from "./Signup.module.scss";
import { Buttoncomp, CaptureImage, Inputcomp } from "../../stories";
import { ERRORMESSAGES, ROUTES } from "../../Util/constants";
// import { useAuthContext } from "../../hooks";
import { useNavigate } from "react-router-dom";
// import { callRegisterPost } from "../../APIs/Register.api";
import {
  decryptPrivateKey,
  encryptPrivateKeyLocally,
} from "../../Util/PrivateKey";
import { saveFile } from "../../Util/helper";

type LoginFormType = {
  email: string;
  password: string;
  image: File;
};

const SignupPage = () => {
  const navigate = useNavigate();
  // const { dispatch } = useAuthContext();

  // @ts-ignore
  const onSubmit = (val: LoginFormType) => {
    // const registerData = new FormData();
    // registerData.append("email", val.email);
    // registerData.append("password", val.password);
    // registerData.append("image", val.image);

    // callRegisterPost(registerData)
    //   .then((resp) => {
    //     handleDecryption(
    //       resp.data.encrypted_private_key,
    //       resp.data.encryption_salt,
    //       val.password
    //     );
    //     navigate(ROUTES.default);
    //     dispatch({ type: "login", payload: { email: val.email } });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

      handleDecryption(
        "9d0f9daeaf7a7c98b9920c60a9d4faf26eece5ff4925d3611cb7ab8066f7b17eeff6764869c17f5d6953e0fa2d26c3227998206b8d74a29b1bafa14b2d4df3339ce19b0f0c3a1067eb944df1fb7c6b43f897a8fcf9f2d4b5250704b5cf6504e29f560a00afecb6c2304de90ff32823c7e408f8dd4f1c428a259b55cc43441ef977931833bf1dc2bdea220aaf0ae2c83dc1dc0f0a066248e017b4ca3b321040657f59a2940502ae332013819a2be43f3633d12709b02be39726c2cd2c5f86bd49bea1c7c6503c62959b07ee720b65edf2d74a71556ff28f5e82921ce380035f9278b178488f976fcfb269616729d7bd03e363d984f611f9b0ef708edf89df61cdfbf0bf7ff12d732dd6f5e9c887",
        "7d7f668848b46cf5621dbb13572c59b2",
        "abc"
      );
      navigate(ROUTES.default);
      // dispatch({ type: "login", payload: { email: val.email } });
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
