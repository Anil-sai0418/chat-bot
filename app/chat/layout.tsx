export default function ChatLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="grow md:overflow-y-auto w-full">
                {children}
            </div>
        </div>
    )
}
