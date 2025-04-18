import { Backdrop } from '@mui/material'
import React from 'react'

type BackDropType = {
    open: boolean,
    handleClose: () => void,
    child?: React.ReactNode
}

const BackDrop = ({open, handleClose, child}:BackDropType) => {
  return (
    <Backdrop 
          open={open}
          onClick={handleClose} 
    >
        {child}
    </Backdrop>
  )
}

BackDrop.defaultProps = {
    open : false,
    handleClose: () => {}
}

export default BackDrop