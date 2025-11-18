export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your appointments in calendar view
        </p>
      </div>

      <div className="card">
        <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500">Calendar view with drag-drop scheduling</p>
            <p className="text-sm text-gray-400 mt-1">Integration with react-big-calendar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
