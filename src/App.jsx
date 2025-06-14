import Routes from "./Routes/Routes"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

export default() => {
    return (
        <>
            <ToastContainer />
            <Routes />
        </>

    )
}