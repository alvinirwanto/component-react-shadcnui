import { cn } from "@/lib/utils";
import React, { useState, useEffect, memo, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import IconRenderer from "@/lib/icon-rederer";

import * as Icons from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Link } from "react-router-dom";
import { useSidebarStore } from "@/stores/SideBarState";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

type IconName = keyof typeof Icons;

interface Links {
    label: string;
    href: string;
    icon: IconName;
}

interface LinkWithChild {
    label: string;
    icon: IconName;
    child: Links[]
}

export const Sidebar = ({
    children,
    animate = true,
}: {
    children: React.ReactNode;
    animate?: boolean;
}) => {
    return (
        <SidebarBody animate={animate}>
            {children}
        </SidebarBody>
    );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
    return (
        <>
            <DesktopSidebar {...props} />
            <MobileSidebar {...(props as React.ComponentProps<"div">)} />
        </>
    );
};

export const DesktopSidebar = ({
    className,
    children,
    ...props
}: React.ComponentProps<typeof motion.div>) => {
    const { showSideBar } = useSidebarStore();
    const animate = true;

    function getWidthValue(animate: boolean, showSideBar: boolean): string {
        if (animate) {
            return showSideBar ? "300px" : "70px";
        }
        return "300px";
    }

    const displayWidth = getWidthValue(animate, showSideBar);

    return (
        <motion.div
            className={cn(
                "h-full hidden md:flex md:flex-col bg-white shadow-lg border-r-[1px] border-gray-100 flex-shrink-0",
                className
            )}
            animate={{
                width: displayWidth,
            }}
            initial={false}
            layout
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const MobileSidebar = ({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) => {
    const { showSideBar, toggleSideBar } = useSidebarStore();

    return (
        <div
            className={cn(
                "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
            )}
            {...props}
        >
            <div className="flex justify-end z-20 w-full">
                <Menu
                    className="text-neutral-800 dark:text-neutral-200"
                    onClick={toggleSideBar}
                />
            </div>
            <AnimatePresence>
                {showSideBar && (
                    <motion.div
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        // transition={{
                        //     duration: 0.25,
                        //     ease: "easeInOut",
                        // }}
                        className={cn(
                            "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                            className
                        )}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const SidebarLink = ({
    link,
    className,
    activeLink,
    canActive = true,
    ...props
}: {
    link: Links;
    className?: string;
    activeLink?: string;
    canActive?: boolean;
    props?: never;
}) => {
    const { showSideBar } = useSidebarStore();
    const [tooltipVisible, setTooltipVisible] = useState(false);

    useEffect(() => {
        if (showSideBar) {
            setTooltipVisible(false);
        }
    }, [showSideBar]);

    const handleMouseEnter = () => {
        if (!showSideBar) {
            setTooltipVisible(true);
        }
    };

    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger onMouseEnter={handleMouseEnter}>
                    <Link
                        to={link.href}
                        className={cn(
                            activeLink?.includes(link.href) && canActive && 'bg-blue-100',
                            "flex items-center justify-start gap-4 py-[10px] group px-2 hover:bg-blue-100 rounded-md",
                            className
                        )}
                        {...props}
                    >
                        <div className="flex-shrink-0">
                            <IconRenderer
                                iconName={link.icon}
                                className={cn(
                                    activeLink?.includes(link.href) && canActive ? 'text-blue-pnm' : 'text-neutral-700 group-hover:text-blue-pnm',
                                    'group-hover:text-blue-pnm h-5 w-5'
                                )}
                            />
                        </div>

                        <motion.span
                            initial={false}
                            animate={{
                                opacity: showSideBar ? 1 : 0,
                                x: showSideBar ? 0 : -10,
                                pointerEvents: showSideBar ? 'auto' : 'none',
                            }}
                            layout
                            transition={{ duration: 0.2 }}
                            className={cn(
                                activeLink?.includes(link.href) && canActive ? 'text-blue-pnm font-medium' : 'text-neutral-700 group-hover:text-blue-pnm',
                                'text-sm whitespace-pre inline-block',
                                showSideBar ? 'visible' : 'invisible'
                            )}
                        >
                            {link.label}
                        </motion.span>
                    </Link>
                </TooltipTrigger>
                {
                    tooltipVisible && !showSideBar && (
                        <TooltipContent side="right">
                            {link.label}
                        </TooltipContent>
                    )
                }
            </Tooltip>
        </TooltipProvider>
    );
};


export const SidebarLinkWithChild = memo(({
    link,
    className,
    activeLink,
    ...props
}: {
    link: LinkWithChild;
    className?: string;
    activeLink?: string;
    props?: never;
}) => {
    const { showSideBar } = useSidebarStore();

    const [showAccordionVisible, setShowAccordionVisible] = useState("");
    const [showPopoverVisible, setShowPopoverVisible] = useState(false);

    const isActive = useMemo(() => {
        return link?.child?.some(subMenu => activeLink?.includes(subMenu.href));
    }, [link, activeLink]);


    useEffect(() => {
        if (!showSideBar) {
            setShowAccordionVisible("");
        }
    }, [showSideBar]);

    useEffect(() => {
        if (isActive) {
            setShowAccordionVisible("open");
        }
    }, [showSideBar]);

    return (
        <Popover
            open={showPopoverVisible}
            onOpenChange={setShowPopoverVisible}
        >
            <PopoverTrigger>
                <Accordion
                    type="single"
                    collapsible
                    value={showAccordionVisible}
                    onValueChange={(value) => setShowAccordionVisible(value)}
                >
                    <AccordionItem
                        value="open"
                        className="border-none"
                    >
                        <AccordionTrigger className="w-full p-0 font-normal group hover:bg-blue-100 rounded-md pr-2 hover:text-blue-pnm">
                            <div
                                className={cn(
                                    // activeLink === link.href && 'bg-blue-100',
                                    "flex items-center justify-start gap-4 py-[10px] px-2",
                                    className
                                )}
                                {...props}
                            >
                                <div className="flex-shrink-0">
                                    <IconRenderer
                                        iconName={link.icon}
                                        className={cn(
                                            // activeLink === link.href ? 'text-blue-pnm' : 'text-neutral-700 group-hover:text-blue-pnm',
                                            'group-hover:text-blue-pnm h-5 w-5'
                                        )}
                                    />
                                </div>

                                <motion.span
                                    initial={false}
                                    animate={{
                                        opacity: showSideBar ? 1 : 0,
                                        x: showSideBar ? 0 : -10,
                                        pointerEvents: showSideBar ? 'auto' : 'none',
                                    }}
                                    layout
                                    transition={{ duration: 0.2 }}
                                    className={cn(
                                        // activeLink === link.href ? 'text-blue-pnm font-medium' : 'text-neutral-700 group-hover:text-blue-pnm',
                                        'text-sm whitespace-pre inline-block',
                                        showSideBar ? 'visible' : 'invisible'
                                    )}
                                >
                                    {link.label}
                                </motion.span>
                            </div>
                        </AccordionTrigger>

                        <AccordionContent className={`${showAccordionVisible && showSideBar ? 'flex items-center p-0 relative' : 'hidden'}`}>
                            <div className="h-full w-10 flex justify-center">
                                <div className="h-full w-[1.5px] absolute top-0 rounded-md bg-gray-300 duration-300 ease-in-out"></div>
                            </div>

                            <div className="w-full flex flex-col">
                                {
                                    link?.child?.map((link) => (
                                        <Link
                                            key={link.href}
                                            to={link.href}
                                            className={cn(
                                                activeLink?.includes(link.href) && 'bg-blue-100',
                                                "flex items-center justify-start gap-4 w-full py-[10px] group px-3 hover:bg-blue-100 rounded-md",
                                                className
                                            )}
                                            {...props}
                                        >
                                            <motion.span
                                                initial={false}
                                                animate={{
                                                    opacity: showSideBar ? 1 : 0,
                                                    x: showSideBar ? 0 : -10,
                                                    pointerEvents: showSideBar ? 'auto' : 'none',
                                                }}
                                                layout
                                                transition={{ duration: 0.2 }}
                                                className={cn(
                                                    activeLink?.includes(link.href) ? 'text-blue-pnm font-medium' : 'text-neutral-700 group-hover:text-blue-pnm',
                                                    'text-sm whitespace-pre inline-block',
                                                    showSideBar ? 'visible' : 'invisible'
                                                )}
                                            >
                                                {link.label}
                                            </motion.span>
                                        </Link>
                                    ))
                                }
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </PopoverTrigger>
            {
                showPopoverVisible && !showSideBar && (
                    <PopoverContent
                        side="right"
                        align="start"
                        sideOffset={25}
                        className="w-full min-w-[10rem] p-0 h-full flex flex-col divide-y"
                    >
                        {
                            link?.child?.map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className="text-sm p-[3px]"
                                >
                                    <div className="hover:bg-blue-100 hover:text-blue-pnm p-2.5 rounded">
                                        {item.label}
                                    </div>
                                </Link>
                            ))
                        }
                    </PopoverContent>
                )
            }
        </Popover>
    );
}, (prevProps, nextProps) => {
    return prevProps.link === nextProps.link
})