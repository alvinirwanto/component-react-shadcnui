import * as Icons from 'lucide-react';
import { FC } from 'react';
import { cn } from './utils';

type IconName = keyof typeof Icons;

interface IconRendererProps {
    iconName: IconName;
    className?: string;
}

const IconRenderer: FC<IconRendererProps> = ({ iconName, className, ...props }) => {
    const LucideIcon = Icons[iconName] as React.ComponentType<any>;

    return LucideIcon ? <LucideIcon className={cn(className)} {...props} /> : null;
};

export default IconRenderer;
