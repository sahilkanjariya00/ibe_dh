import React, { useEffect, useState } from 'react'
import style from './Dashboard.module.scss'
import { Buttoncomp } from '../../stories';
import { useAuthContext } from '../../hooks';
import { removeFromSessionStorage } from '../../Util/helper';

type UserDataType = {
  uuid: string,
  name: string,
  email: string,
  pubKey: string
}

const DATA = [
  {uuid: '1', name: 'sahil', email: 'sahil@gmail.com', pubKey: '1'},
  {uuid: '2', name: 'prathmesh', email: 'prathmesh@gmail.com', pubKey: '2'},
  {uuid: '3', name: 'souvik', email: 'souvik@gmail.com', pubKey: '3'},
  {uuid: '4', name: 'varun', email: 'varun@gmail.com', pubKey: '4'},
]

const Dashboard = () => {
  const {state,dispatch} = useAuthContext();
  const [userData, setUserData] = useState<UserDataType[]>();

  useEffect(()=>{
    setUserData(DATA);
  },[])

  const handleLogOut = () => {
    removeFromSessionStorage('ld');
    dispatch({type: 'logout'});
  }

  return (
    <div className={style.container}>
      <div className={style.upperConainer}>
        <h2 className={style.contect}>Contect Directory</h2>
        <Buttoncomp label='Logout' onClick={handleLogOut}></Buttoncomp>
      </div>
      <div className={style.inContainer}>
        {
          userData?.map((data)=>
            <div key={data.uuid} className={style.card}>
              <p className={style.name}>{data.name}</p>
              <p className={style.email}>{data.email}</p>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Dashboard