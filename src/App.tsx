import { Route, Routes } from 'react-router-dom'
// import { useEffect } from 'react';
// import { useAuthContext } from './hooks'
import { 
  Dashboard, 
  // LoginPage, 
  SignupPage 
} from './pages'
import { ROUTES } from './Util/constants';
// import { getFromSessionStorage } from './Util/helper';

function App() {
  // const {state,dispatch} = useAuthContext();
  

  // useEffect(()=>{
  //   const ld = getFromSessionStorage('ld');
  //   if(ld){
  //     const ldd = JSON.parse(ld);
  //     dispatch({type: 'load', payload: {email: ldd.email}});
  //   }
  // },[state.logedIn])

  return (
    <>
      <Routes>
        {/* {state.logedIn?
          <> */}
            <Route path={ROUTES.default} element={<Dashboard />}/>
          {/* </>
        :
          <> */}
            {/* <Route path={ROUTES.default} element={<LoginPage />} /> */}
            <Route path={ROUTES.signup} element={<SignupPage />}/>
          {/* </>
        } */}
      </Routes>
    </>
  )
}

export default App
