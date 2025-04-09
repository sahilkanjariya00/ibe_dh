import React from 'react'
import { Form, Field } from 'react-final-form'
import styles from './login.module.scss'
import { Buttoncomp, Inputcomp } from '../../stories'


const LoginPage = () => {

  const onSubmit = (val:any)=>{
    console.log(val)
  }

  return (
    <>
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <h2 className={styles.formTitle}>Sign in</h2>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div>
                <Field name="email">
                      {({ input, meta }) => (
                        <div>
                          <div className={styles.inputContainer}>
                            <Inputcomp 
                              label="Email Address"
                              placeholder='Enter your email' 
                              {...input}>
                            </Inputcomp>
                          </div>
                          {meta.touched && meta.error && <span>{meta.error}</span>}
                        </div>
                      )}
                </Field>
              </div>

              <div>
                <Field name="password">
                      {({ input, meta }) => (
                        <div>
                          <div className={styles.inputContainer}>
                            <Inputcomp 
                              label="Password"
                              placeholder='Enter your password'
                              type='password' 
                              {...input}>
                            </Inputcomp>
                          </div>
                          {meta.touched && meta.error && <span>{meta.error}</span>}
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
      </div>
    </div>
    </>
  )
}

export default LoginPage