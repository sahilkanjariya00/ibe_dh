// @ts-ignore
import React from 'react'
import { TextFieldProps } from '@mui/material'
import { StyledInput } from './input.styled'

const Inputcomp = (props: TextFieldProps) => {
  return (
    <StyledInput
      title={props.title}
      {...props}
    >
    </StyledInput>
  )
}

export default Inputcomp