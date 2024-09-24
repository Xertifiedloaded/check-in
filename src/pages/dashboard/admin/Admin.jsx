import { useEffect, useState } from "react";
import axios from "axios";
import Login from "@/pages/auth/login";

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("/api/admins");
        Login
        setAdmins(response.data);
      } catch (error) {
        console.error("Failed to fetch admins", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const deleteAdmin = async (id) => {
    try {
      await axios.delete(`/api/admin/${id}`);
      setAdmins(admins.filter((admin) => admin._id !== id));
    } catch (error) {
      console.error("Failed to delete admin", error);
    }
  };

  return (
    <div className="min-h-screen my-3 bg-gray-100">
      <div className="bg-white rounded-lg overflow-hidden">
        <main>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <span className="text-gray-600 text-lg">Loading...</span>
            </div>
          ) : (
            <>
              {/* Wrapper div with overflow classes */}
              <div className="overflow-x-auto   rounded-lg shadow-md">
              <table className="min-w-full divide-y text-xs lg:text-sm divide-gray-200">
                <thead className="bg-gray-50  whitespace-nowrap">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.length > 0 ? (
                      admins.map((admin) => (
                        <tr key={admin._id} className="border-b">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{admin.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{admin.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <button
                              onClick={() => deleteAdmin(admin._id)}
                              className="text-red-500 hover:text-red-700 font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-4 px-4 text-center text-gray-600"
                        >
                          No admins found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminsPage;