import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Helper function, use if needed elsewhere
export const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') toast.success(message);
    else toast.error(message);
};

const Alert = () => {
    return <ToastContainer theme="dark" style={{ paddingTop: '80px' }} />;
};

export default Alert;