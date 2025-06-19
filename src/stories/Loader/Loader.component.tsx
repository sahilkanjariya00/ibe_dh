import { Backdrop, CircularProgress } from "@mui/material";
import { useLoaderContext } from "../../hooks";

const LoaderBackdrop = () => {
  const {state} = useLoaderContext();

  return (
    <Backdrop open={state.loading} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LoaderBackdrop;
