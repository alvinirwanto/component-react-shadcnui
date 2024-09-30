import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ModalSessionEnd from '@/components/modals/modal-session-end'
import LayoutAdmin from '@/layout/LayoutAdmin';


export default function ProtectedRoute() {

    const location = useLocation()
    const navigate = useNavigate()

    // const changePassword = location.pathname === '/change-password'

    // useEffect(() => {
    //     if ((!localStorage.getItem("user-auth") || !localStorage.getItem("user-data")) && !localStorage.getItem("user-status-password")) {
    //         const showDialog = useDialogSessionStore.getState().showDialog;
    //         showDialog();
    //     }
    // }, [])

    return (
        <>
            <LayoutAdmin>
                <Outlet />
            </LayoutAdmin>

            <ModalSessionEnd />
        </>
    );
}
