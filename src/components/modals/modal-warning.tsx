import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { TriangleAlert } from "lucide-react"
import { Button } from "../ui/button";

interface ModalWarningProps {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export default function ModalWarning({
    title,
    description,
    isOpen,
    onClose,
    onConfirm,
    loading
}: Readonly<ModalWarningProps>) {

    const onChange = (open: boolean) => {
        if (!open) {
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent className="flex flex-col justify-between !w-[350px] md:!w-[400px] xl:!w-[500px]">
                <DialogHeader className="w-full h-[350px] flex items-center justify-center">
                    <div className="h-24 w-24 grid place-items-center bg-rose-200 text-rose-500 rounded-full">
                        <TriangleAlert className="h-9 w-9" />
                    </div>
                    <DialogTitle className="text-2xl pt-7">{title}</DialogTitle>
                    <DialogDescription className="text-center">{description}</DialogDescription>
                </DialogHeader>
                <div className="w-full grid grid-cols-2 gap-4">
                    <Button
                        disabled={loading}
                        variant='outline'
                        onClick={onClose}
                    >
                        Batal
                    </Button>
                    <Button
                        disabled={loading}
                        variant='destructive'
                        onClick={onConfirm}
                    >
                        Ya, saya yakin
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}