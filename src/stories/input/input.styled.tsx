import { TextField } from "@mui/material";
import styled from "styled-components";

const StyledInput = styled(TextField)`
    height: 44px;

    .MuiFormControl-root, .MuiInputBase-root{
        height: 44px;
    }

    .MuiFormLabel-root{
        top: -5px;
    }
`;

export {StyledInput}