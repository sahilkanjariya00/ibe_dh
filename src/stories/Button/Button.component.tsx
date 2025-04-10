import React from 'react'
import { ButtonProps } from '@mui/material'
import { StyledButton } from './Button.styled'
type ButtonType = {
    label?: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined,
    props?: ButtonProps
}

const Buttoncomp = ({label,onClick,props}: ButtonType)  => {
  return (
    <>
        <StyledButton
            onClick={onClick}
            {...props}
        >
            {label}
        </StyledButton>
    </>
  )
}

export default Buttoncomp