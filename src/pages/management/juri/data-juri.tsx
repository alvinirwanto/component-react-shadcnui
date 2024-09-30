import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import { slideIn } from "@/lib/animation";

import DataBigInnovation from "@/pages/submit-innovation/tab/big-innovation/data-big-innovation";
import { Button } from "@/components/ui/button";
import LayoutPage from "@/layout/LayoutPage";
import TitlePage from "@/components/title-page";
import { Link } from "react-router-dom";

export default function DataManagementJuri() {

    return (
        <LayoutPage
            childrenHead={
                <div className="flex justify-between items-center rounded-md bg-white px-4 h-full">
                    <TitlePage title='Juri Management' />
                    <div className="flex justify-end items-center">
                        <Link to='/management/juri/add'>
                            <Button type="button" className="flex items-center gap-2 bg-blue-pnm hover:bg-blue-900 w-[12rem]">
                                <Plus className="w-4 h-4" />
                                <span className="text-white text-[13px]">Tambah Juri</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <div className='flex-col items-center w-full'>
                <AnimatePresence mode="wait">
                    <motion.div
                        variants={slideIn({ direction: 'up', duration: 0.2 })}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                    >
                        <DataBigInnovation />
                    </motion.div>
                </AnimatePresence>
            </div>
        </LayoutPage>
    )
}
