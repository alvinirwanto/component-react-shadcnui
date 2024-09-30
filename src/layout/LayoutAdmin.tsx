import { Sidebar, SidebarBody, SidebarLink, SidebarLinkWithChild } from "../components/sidebar";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

import * as Icons from 'lucide-react';
import { useLocation } from "react-router-dom";
import { useSidebarStore } from "@/stores/SideBarState";
import Navbar from "@/components/navbar";

type IconName = keyof typeof Icons;

interface SidebarAdminProps {
    children: React.ReactNode;
}

interface LinkItem {
    label: string;
    href: string;
    icon: IconName;
}

interface LinkWithChild {
    label: string;
    href?: string;
    icon?: IconName;
    child?: LinkItem[];
}

export default function LayoutAdmin({ children }: Readonly<SidebarAdminProps>) {

    const { showSideBar } = useSidebarStore();

    const location = useLocation()
    const activeLink = location.pathname

    const links: any[] = [
        {
            label: "Portal",
            href: "/",
            icon: "Home"
        },
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: "PanelLeft"
        },
        {
            label: "Submit Innovation",
            href: "/submit-innovation",
            icon: "Contact"
        },
        {
            label: "Management Innovation",
            href: "/management-innovation",
            icon: "Settings"
        },
        {
            label: "Management",
            icon: "FolderKanban",
            child: [
                {
                    label: "User",
                    href: "/management/user",
                },
                {
                    label: "Juri",
                    href: "/management/juri",
                },
                {
                    label: "Batch",
                    href: "/management/batch",
                }
            ]
        },
    ];

    return (
        <div
            className={cn(
                "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 overflow-hidden h-screen"
            )}
        >
            <Sidebar>
                <SidebarBody className="justify-between gap-10 px-4">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {
                            showSideBar
                                ? <Logo />
                                : <LogoIcon />
                        }
                        <div className="mt-8 flex flex-col gap-2">
                            {
                                showSideBar && (
                                    <span className="text-sm text-gray-400 font-medium">Menu</span>
                                )
                            }
                            {
                                links.map((link) => (
                                    link.href === '/'
                                        ? <SidebarLink
                                            key={link.icon}
                                            link={link}
                                            activeLink={activeLink}
                                            canActive={false}
                                        />
                                        : link.child
                                            ? <SidebarLinkWithChild
                                                key={link.icon}
                                                link={link}
                                                activeLink={activeLink}
                                            />
                                            : <SidebarLink
                                                key={link.icon}
                                                link={link}
                                                activeLink={activeLink}
                                                canActive={location.pathname.split('/')[1] !== ''}
                                            />
                                ))
                            }
                        </div>
                    </div>
                </SidebarBody>
            </Sidebar>
            <div className="w-full h-screen bg-gray-100">
                <Navbar />
                <main className="px-6 py-4 w-full h-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
export const Logo = () => {
    const { toggleSideBar } = useSidebarStore();

    return (
        <div
            className="font-normal flex justify-between items-center text-sm text-black py-1 px-2 relative z-20 h-[60px]"
        >
            <div className="flex items-center gap-2">
                <img
                    src='/PNM_logo.png'
                    alt="logo"
                    className="h-7 object-contain mt-4"
                />
            </div>

            <button>
                <X
                    className="text-neutral-800 hover:text-rose-500 transition duration-300"
                    onClick={toggleSideBar}
                />
            </button>
        </div>
    );
};

export const LogoIcon = () => {
    const { toggleSideBar } = useSidebarStore();

    return (
        <div
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 pl-2 relative z-20 h-[60px]"
        >
            <button>
                <Menu
                    className="text-neutral-800 dark:text-neutral-200"
                    onClick={toggleSideBar}
                />
            </button>
        </div>
    );
};