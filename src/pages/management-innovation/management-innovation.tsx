import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, UserRound, UsersRound } from "lucide-react";

import { slideIn } from "@/lib/animation";

import DataBigInnovation from "@/pages/submit-innovation/tab/big-innovation/data-big-innovation";
import { Button } from "@/components/ui/button";
import LayoutPage from "@/layout/LayoutPage";
import TitlePage from "@/components/title-page";

export default function ManagementInnovation() {

    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab') ?? 'big-innovation';
    const [activeTab, setActiveTab] = useState(tabParam);

    useEffect(() => {
        setActiveTab(tabParam);
    }, [tabParam]);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab || 'big-innovation');
        setSearchParams({ tab });
    };

    return (
        <LayoutPage
            childrenHead={
                <div className="grid grid-cols-[1fr_2fr_1fr] items-center rounded-md bg-white px-4 h-full">
                    <TitlePage title='Management Innovation' />
                    <div className="w-full flex items-center justify-center scale-95">
                        <div className='flex items-center w-[40vw] justify-center relative text-sm rounded-full bg-blue-pnm p-[4px]'>

                            <div className={`absolute w-[50%] h-[85%] bg-white z-30 rounded-full transition-all duration-300 ease-in-out
                                    ${activeTab === 'big-innovation' ? 'left-1' : 'left-[49.4%]'}`}></div>

                            <button
                                onClick={() => handleTabClick('big-innovation')}
                                className={`${activeTab === 'big-innovation' ? '!text-blue-pnm font-semibold' : 'text-gray-300'} flex items-center justify-center gap-3 duration-300 z-40 w-full py-1 text-center cursor-pointer`}>
                                <div className="bg-blue-pnm rounded-full p-2 text-white">
                                    <UserRound className="w-4 h-4" />
                                </div>
                                <span>Big Innovation</span>
                            </button>
                            <button
                                onClick={() => handleTabClick('idea-challange')}
                                className={`${activeTab === 'idea-challange' ? '!text-blue-pnm font-semibold' : 'text-gray-300'} flex items-center justify-center gap-3 duration-300 z-40 w-full py-1 text-center cursor-pointer`}>
                                <div className="bg-blue-pnm rounded-full p-2 text-white">
                                    <UsersRound className="w-4 h-4" />
                                </div>
                                <span>Idea Challange</span>
                            </button>
                        </div>
                    </div>
                </div>
            }
        >
            <div className='flex-col items-center w-full'>
                <AnimatePresence mode="wait">
                    {activeTab === 'big-innovation' ? (
                        <motion.div
                            key={activeTab}
                            variants={slideIn({ direction: 'up', duration: 0.2 })}
                            initial="initial"
                            animate="enter"
                            exit="exit"
                        >
                            <DataBigInnovation />
                        </motion.div>
                    ) : activeTab === 'idea-challange' ? (
                        <motion.div
                            key={activeTab}
                            variants={slideIn({ direction: 'up', duration: 0.2 })}
                            initial="initial"
                            animate="enter"
                            exit="exit"
                        >
                            <DataBigInnovation />
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </LayoutPage>
    )
}
