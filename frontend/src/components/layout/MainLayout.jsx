import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden ">
      {/* Sidebar selalu tampil di semua halaman */}
      <Sidebar />
      {/* Area konten utama */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar di atas */}
        <Topbar />
        {/* Konten halaman - scrollable */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {/* Outlet di-replace dengan halaman yang aktif */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
