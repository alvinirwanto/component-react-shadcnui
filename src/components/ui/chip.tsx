interface ChipProps {
    message: string;
    type: string;
}
export default function Chip({ message, type }: Readonly<ChipProps>) {

    const getTypeClassName = (type: string) => {
        switch (type) {
            case 'yellow':
                return 'bg-orange-50 text-orange-500 border border-orange-100';
            case 'blue':
                return 'bg-blue-50 text-blue-500 border border-blue-100';
            case 'green':
                return 'bg-teal-50 text-teal-500 border border-teal-100';
            case 'green 2':
                return 'bg-green-50 text-green-500 border border-green-100';
            case 'red':
                return 'bg-rose-50 text-rose-500 border border-rose-100';
            default:
                return '';
        }
    };

    return (
        <div className={`w-[130px] text-center text-[13px] font-medium py-[7px] px-2 rounded ${getTypeClassName(type)}`}>
            {message}
        </div>
    )
}
