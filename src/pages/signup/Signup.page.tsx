import React from 'react'
import { Form, Field } from 'react-final-form'
import styles from './Signup.module.scss'
import { Buttoncomp, CaptureImage, Inputcomp } from '../../stories'
import { ERRORMESSAGES, ROUTES } from '../../Util/constants'
import { useAuthContext } from '../../hooks'
import { useNavigate } from 'react-router-dom'

type LoginFormType = {
  name: string,
  email: string,
  password: string,
}

const SignupPage = () => {
  const navigate = useNavigate();
  const {dispatch} = useAuthContext();

  const onSubmit = (val: LoginFormType)=>{
    navigate(ROUTES.default)
    dispatch({type:'login',payload:{email:val.email}});
    console.log(val)
  }

  const handleLogin = (e: React.MouseEvent<HTMLElement>) => {
    navigate(ROUTES.default);
  }

  const validationfn = (val: LoginFormType) => {
    const errors: {email?: string, password?: string} = {};
    
    if(!val.email){
      errors.email = ERRORMESSAGES.emailError;
    }

    if(!val.password){
      errors.password = ERRORMESSAGES.passError
    }
    return errors;
  }

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
                <Field name="name">
                      {({ input, meta }) => (
                        <div>
                          <div>
                            <Inputcomp 
                              label="Name"
                              placeholder='Enter your name'
                              type='text' 
                              {...input}>
                            </Inputcomp>
                          </div>
                          {meta.touched && meta.error && <span className='error'>{meta.error}</span>}
                        </div>
                      )}
                </Field>
              </div>

              <div className={styles.inputContainer}>
                <Field name="email">
                      {({ input, meta }) => (
                        <div>
                          <div>
                            <Inputcomp 
                              label="Email Address"
                              placeholder='Enter your email' 
                              {...input}>
                            </Inputcomp>
                          </div>
                          {meta.touched && meta.error && <span className='error'>{meta.error}</span>}
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
                              placeholder='Enter your password'
                              type='password' 
                              {...input}>
                            </Inputcomp>
                          </div>
                          {meta.touched && meta.error && <span className='error'>{meta.error}</span>}
                        </div>
                      )}
                </Field>
              </div>

              <div className={styles.inputContainer}>
                <Field name="image">
                      {({ input, meta }) => {
                        // console.log(input)
                        return(
                        <div>
                          <div className={styles.capturePhoto}>
                            <CaptureImage height={200} width={200} onChange={input.onChange}/>
                          </div>
                          {meta.touched && meta.error && <span className='error'>{meta.error}</span>}
                        </div>
                      )}}
                </Field>
              </div>
              
              <Buttoncomp
                label='Sgin In'
                props={{variant: 'contained', type:'submit'}}
              ></Buttoncomp>
              
            </form>
          )}
        />
        <div className={styles.signup}><p className='link' onClick={handleLogin}>Login</p> here.</div>
      </div>
    </div>
    </>
  )
}

export default SignupPage