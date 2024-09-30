import { slideIn } from "@/lib/animation";
import { motion } from "framer-motion";

interface LayoutPageProps {
    childrenHead: React.ReactNode;
    children: React.ReactNode;
}

export default function LayoutPage({
    childrenHead,
    children
}: Readonly<LayoutPageProps>) {
    return (
        <div className="flex flex-col gap-3 z-20 relative">
            <motion.div
                variants={slideIn({ direction: 'down', duration: 0.35, delay: 0.1 })}
                initial="initial"
                animate="enter"
                exit="exit"
                className="h-[55px]"
            >
                {childrenHead}
            </motion.div>
            <motion.div
                variants={slideIn({ direction: 'up', duration: 0.35, delay: 0.1, opacity: 1 })}
                initial="initial"
                animate="enter"
                exit="exit"
                className="w-full h-[calc(100vh-130px)]"
            >
                {children}
            </motion.div>
        </div>
    )
}
