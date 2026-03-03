export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-display font-bold text-neutral-900">Dashboard</h1>
            <p className="text-neutral-500 font-body">Welcome to your EduCore Administration Panel.</p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Total Students', 'Total Classes', 'Teachers', 'Active Fees'].map((stat, i) => (
                    <div key={i} className="bg-white border text-center border-neutral-200 rounded-lg p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">{stat}</h3>
                        <p className="text-3xl font-display font-bold text-neutral-900">-</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
