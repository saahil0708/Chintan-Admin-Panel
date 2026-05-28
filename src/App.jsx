// import Routes from "./Routes/Routes"
// import { ToastContainer } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css";

// export default function App() {
//     return (
//         <>
//             <ToastContainer />
//             <Routes />
//         </>

//     )
// }

import Routes from "./Routes/Routes"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "react-toastify/dist/ReactToastify.css"
import { useDispatch } from 'react-redux';
import { checkAuthState, setInitializing } from './redux/slices/authSlice';
import { useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material"

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B0000', // Dark Red
    },
    secondary: {
      main: '#b71c1c',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes />
    </ThemeProvider>
  )
}
