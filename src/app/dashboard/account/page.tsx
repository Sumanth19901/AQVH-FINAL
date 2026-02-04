export default function AccountPage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Account</h1>
            </div>
            <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground shadow-sm">
                <p>Manage your account settings and preferences.</p>
            </div>
        </div>
    )
}
