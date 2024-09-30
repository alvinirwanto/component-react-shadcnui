import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { History } from "lucide-react"
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDialogSessionStore from "@/stores/SessionStore";

export default function ModalSessionEnd() {

    const { isDialogOpen, hideDialog } = useDialogSessionStore();
    const [seconds, setSeconds] = useState(10);
    const navigate = useNavigate()

    function handleSessionEnd() {
        if (!isDialogOpen) {
            return;
        }

        if (localStorage.getItem("user-auth")) {
            localStorage.removeItem("user-auth");
        }

        // setLastPage()
        hideDialog();
        navigate('/login');
    }

    useEffect(() => {
        if (!isDialogOpen) {
            return;
        }

        const countdownTimer = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds - 1);
        }, 1000);

        const redirectTimer = setTimeout(() => {
            // setLastPage()
            hideDialog();
            handleSessionEnd()
        }, 10000);

        return () => {
            clearInterval(countdownTimer);
            clearTimeout(redirectTimer);
        };
    }, [isDialogOpen, hideDialog]);

    return (
        <Dialog open={isDialogOpen}>
            <DialogContent className="flex flex-col justify-between !w-[350px] md:!w-[400px] xl:!w-[500px]">
                <DialogHeader className="w-full h-[300px] flex items-center justify-center">
                    <div className="h-24 w-24 grid place-items-center bg-rose-200 text-rose-500 rounded-full">
                        <History className="h-9 w-9" />
                    </div>
                    <DialogTitle className="text-2xl pt-7">Session Anda telah habis</DialogTitle>
                    <DialogDescription className="text-center">Silahkan login kembali untuk mengakses kembali fitur yang tersedia.</DialogDescription>
                </DialogHeader>
                <div className="w-full flex justify-center items-center">
                    <Button
                        variant='destructive'
                        onClick={() => handleSessionEnd()}
                    >
                        Keluar
                    </Button>
                </div>
                <p className='text-center text-xs mt-2 text-gray-400 pb-5'>Kamu akan di arahkan ke halaman login dalam {seconds} detik</p>
            </DialogContent>
        </Dialog>
    )
}