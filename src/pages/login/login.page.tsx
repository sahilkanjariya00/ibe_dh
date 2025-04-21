import React from 'react'
import { Form, Field } from 'react-final-form'
import styles from './login.module.scss'
import { Buttoncomp, Inputcomp } from '../../stories'
import { ERRORMESSAGES, ROUTES } from '../../Util/constants'
import { useAuthContext } from '../../hooks'
import { useNavigate } from 'react-router-dom'
import { saveToSessionStorage } from '../../Util/helper'

type LoginFormType = {
  email: string,
  password: string,
}

const LoginPage = () => {
  const navigate = useNavigate();
  const {dispatch} = useAuthContext();

  const handleSignup = (e: React.MouseEvent<HTMLElement>) => {
    navigate(ROUTES.signup);
  }

  const onSubmit = (val: LoginFormType)=>{
    saveToSessionStorage('ld',{email: val.email, logedIn: true})
    dispatch({type:'login',payload:{email:val.email}});
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
              
              <Buttoncomp
                label='Log In'
                props={{variant: 'contained', type:'submit'}}
              ></Buttoncomp>
              
            </form>
          )}
        />
        <div className={styles.signup}>Create secure account. <p onClick={handleSignup} className='link'>Signup</p></div>
      </div>
    </div>
    </>
  )
}

export default LoginPage