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
import { AppContextProvider } from "./Context/AppContext"

export default function App() {
  return (
    <AppContextProvider>
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
    </AppContextProvider>
  )
}
