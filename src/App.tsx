import { Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages'
import { useAuthContext } from './hooks'
import { ROUTES } from './Util/constants';

function App() {
  const {state} = useAuthContext(); 
  console.log("loginValue: ",state.logedIn);

  return (
    <>
      <Routes>
        {state.logedIn?
          <Route path={ROUTES.default} element={<div>dashboard</div>}/>
        :
          <Route path={ROUTES.default} element={<LoginPage/>} />
        }
      </Routes>
    </>
  )
}

export default App
