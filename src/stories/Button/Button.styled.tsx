import { Button } from "@mui/material";
import styled from "styled-components";
import { Theme } from "../../theme";

const StyledButton = styled(Button)`
    background-color: ${Theme.colors.black} !important;
    color: ${Theme.colors.white} !important;
`

export {StyledButton}   