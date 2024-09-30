interface TitlePageProps {
    title: string;
}

export default function TitlePage({
    title
}: Readonly<TitlePageProps>) {
    return (
        <h1 className="font-semibold text-xl w-full">{title}</h1>
    )
}
