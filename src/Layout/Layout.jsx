import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import AdminNavbar from '../Components/Navbar';

const DashboardLayout = ({ children }) => {
    const { isLoggedIn } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />
            <div className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
                <main className="max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;