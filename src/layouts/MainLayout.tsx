import { Outlet, Link } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-blue-600">Hostel Manager</h1>
        </div>
        <nav className="mt-8">
          <ul className="space-y-2">
            <li>
              <Link to="/" className="block px-4 py-2 hover:bg-blue-50">Dashboard</Link>
            </li>
            <li>
              <Link to="/rooms" className="block px-4 py-2 hover:bg-blue-50">Rooms</Link>
            </li>
            <li>
              <Link to="/students" className="block px-4 py-2 hover:bg-blue-50">Students</Link>
            </li>
            <li>
              <Link to="/bookings" className="block px-4 py-2 hover:bg-blue-50">Bookings</Link>
            </li>
            <li>
              <Link to="/payments" className="block px-4 py-2 hover:bg-blue-50">Payments</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout 