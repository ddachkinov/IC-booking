export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your team members and their permissions
          </p>
        </div>
        <button className="btn btn-primary btn-md">
          Invite Staff
        </button>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <p className="text-gray-500">Staff management interface</p>
        </div>
      </div>
    </div>
  );
}
