import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import axios from "axios";
import baseUrl from "../config";
import useAuthStore from "../store/Auth.store";
import { FaHeart, FaEdit, FaTrash } from "react-icons/fa";
import { PiFilmSlateFill } from "react-icons/pi";
import { IoIosTv } from "react-icons/io";
import { IoMdClock } from "react-icons/io";

interface Item {
  id: number;
  title: string;
  type: "Movie" | "TV Show";
  director: string;
  budget?: number;
  location?: string;
  duration?: number;
  year?: number;
}

interface FormData {
  title: string;
  type: "Movie" | "TV Show" | "";
  director: string;
  budget: string;
  location: string;
  duration: string;
  year: string;
}

const Home = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<FormData>({
    title: "",
    type: "",
    director: "",
    budget: "",
    location: "",
    duration: "",
    year: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editItemData, setEditItemData] = useState<FormData | null>(null);
  const [editItemId, setEditItemId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const { logOut } = useAuthStore();

  // Fetch all items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get<Item[]>(`${baseUrl}/item/getAllItems`, {
          withCredentials: true,
        });
        setItems(data);
        console.log("items are", data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
    fetchItems();
  }, []);

  // Handle input change for add form
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add new item
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/item/addItem`, form, {
        withCredentials: true,
      });
      setForm({
        title: "",
        type: "",
        director: "",
        budget: "",
        location: "",
        duration: "",
        year: "",
      });
      window.location.reload();
    } catch (err) {
      alert("❌ Error adding item");
    }
  };

  // Delete item
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`${baseUrl}/item/deleteItem/${id}`, {
        withCredentials: true,
      });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert("Error deleting item");
    }
  };

  // Open edit modal and populate the edit form data
  const openEditModal = (item: Item) => {
    setEditItemId(item.id);
    setEditItemData({
      title: item.title,
      type: item.type,
      director: item.director,
      budget: item.budget?.toString() || "",
      location: item.location || "",
      duration: item.duration?.toString() || "",
      year: item.year?.toString() || "",
    });
    setIsEditing(true);
  };

  // Close edit modal and clear edit states
  const closeEditModal = () => {
    setIsEditing(false);
    setEditItemData(null);
    setEditItemId(null);
  };

  // Handle edit form input change
  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!editItemData) return;
    setEditItemData({ ...editItemData, [e.target.name]: e.target.value });
  };

  // Handle edit form submit to update item
  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editItemId === null || !editItemData) return;

    try {
      const payload = {
        ...editItemData,
        budget:
          editItemData.budget === ""
            ? undefined
            : Number(editItemData.budget),
        duration:
          editItemData.duration === ""
            ? undefined
            : Number(editItemData.duration),
        year:
          editItemData.year === ""
            ? undefined
            : Number(editItemData.year),
      };

      const { data } = await axios.put(
        `${baseUrl}/item/editItem/${editItemId}`,
        payload,
        { withCredentials: true }
      );

      setItems((prev) =>
        prev.map((item) => (item.id === editItemId ? data.item : item))
      );

      
      closeEditModal();
    } catch (err) {
      alert("❌ Error updating item");
    }
  };

  // Filter items by searchTerm
  // Also treats empty, dash-only or whitespace-only search as no results
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const isDashOnly = normalizedSearch === "-";

const filteredItems = isDashOnly
  ? []
  : items.filter((item) =>
      item.title.toLowerCase().includes(normalizedSearch)
    );

  const totalHours = items.reduce((acc, item) => acc + (item.duration || 0), 0);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#f5f7fa_0%,#c3cfe2_100%)]  p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🎬 MediaTracker</h1>

        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mx-4 p-2 border border-gray-300 focus:ouline-none rounded-md w-64"
        />

        <button
          onClick={logOut}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-around gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-sm">Total Movies</p>
            <p className="text-xl text-black font-semibold">
              {items.filter((i) => i.type === "Movie").length}
            </p>
          </div>
          <PiFilmSlateFill className="text-blue-500 text-2xl h-10 w-10" />
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-around gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-sm">TV Shows</p>
            <p className="text-xl font-semibold text-black">
              {items.filter((i) => i.type === "TV Show").length}
            </p>
          </div>
          <IoIosTv className="text-purple-500 text-2xl h-10 w-10" />
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-around gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-sm">Watch Time</p>
            <p className="text-xl font-semibold text-black">{totalHours}h</p>
          </div>
          <IoMdClock className="text-green-500 text-2xl h-10 w-10" />
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-around gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-gray-500 text-sm">Favorites</p>
            <p className="text-xl font-semibold text-black">{items.length}</p>
          </div>
          <FaHeart className="text-pink-500 text-2xl h-10 w-10" />
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Add New Entry */}
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl shadow p-6 flex flex-col gap-3"
        >
          <h2 className="text-lg font-semibold mb-2 text-black">Add New Entry</h2>

          <div className="flex flex-col gap-3">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              value={form.title}
              onChange={handleChange}
              className="p-2 border border-zinc-300 focus:outline-none rounded-md"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <label>Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="p-2 border border-zinc-300 focus:outline-none rounded-md"
              required
            >
              <option value="">Select type</option>
              <option value="Movie">Movie</option>
              <option value="TV Show">TV Show</option>
            </select>
          </div>

          <div className="flex flex-col gap-3">
            <label>Director</label>
            <input
              type="text"
              name="director"
              placeholder="Director name"
              value={form.director}
              onChange={handleChange}
              className="p-2 border border-zinc-300 focus:outline-none rounded-md"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <label>Budget</label>
            <input
              type="number"
              name="budget"
              placeholder="Enter the budget in crores"
              value={form.budget}
              onChange={handleChange}
              className="p-2 border border-zinc-300 focus:outline-none rounded-md"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label>Year</label>
            <input
              type="number"
              name="year"
              placeholder="Enter the year"
              value={form.year}
              onChange={handleChange}
              className="p-2 border border-zinc-300 focus:outline-none rounded-md"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="Enter the location"
              value={form.location}
              onChange={handleChange}
              className="p-2 border border-zinc-300 focus:outline-none rounded-md"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label>Duration</label>
            <input
              type="number"
              name="duration"
              placeholder="Enter the Duration in hours"
              value={form.duration}
              onChange={handleChange}
              className="p-2 border border-zinc-300 focus:outline-none rounded-md"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mt-3"
          >
            + Add Entry
          </button>
        </form>

        {/* Media Collection */}
        <div className="col-span-2 rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Media Collection</h2>

          {/* Show no data if no filtered or no items */}
          {(filteredItems.length === 0) && (
            <div className="text-center text-gray-500 py-20 text-lg font-medium">
              No Data
            </div>
          )}

          {(filteredItems.length > 0) && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="py-2">Title</th>
                  <th>Type</th>
                  <th>Director</th>
                  <th>Year</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-2 font-medium">{item.title}</td>
                    <td>
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${
                          item.type === "Movie"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-purple-100 text-purple-600"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td>{item.director}</td>
                    <td>{item.year || "-"}</td>
                    <td>{item.duration ? `${item.duration} hours` : "-"}</td>
                    <td className="flex gap-3">
                      <div className="flex gap-4 items-center justify-center h-10">
                        <FaEdit
                          className="text-blue-500 cursor-pointer"
                          onClick={() => openEditModal(item)}
                        />
                        <FaTrash
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 cursor-pointer"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && editItemData && (
        <>
          <div
            className="fixed inset-0 bg-white opacity-70 bg-opacity-50 backdrop-blur-sm z-40"
            onClick={closeEditModal}
          ></div>

          <div className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Media Entry</h3>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
              <input
                name="title"
                placeholder="Enter title"
                value={editItemData.title}
                onChange={handleEditChange}
                className="p-2 border border-zinc-300 focus:outline-none rounded-md"
                required
              />

              <select
                name="type"
                value={editItemData.type}
                onChange={handleEditChange}
                className="p-2 border border-zinc-300 focus:outline-none rounded-md"
                required
              >
                <option value="">Select type</option>
                <option value="Movie">Movie</option>
                <option value="TV Show">TV Show</option>
              </select>

              <input
                name="director"
                placeholder="Director name"
                value={editItemData.director}
                onChange={handleEditChange}
                className="p-2 border border-zinc-300 focus:outline-none rounded-md"
                required
              />

              <input
                name="budget"
                placeholder="Budget"
                type="number"
                value={editItemData.budget}
                onChange={handleEditChange}
                className="p-2 border border-zinc-300 focus:outline-none rounded-md"
              />

              <input
                name="year"
                placeholder="Year"
                type="number"
                value={editItemData.year}
                onChange={handleEditChange}
                className="p-2 border border-zinc-300 focus:outline-none rounded-md"
              />

              <input
                name="location"
                placeholder="Location"
                value={editItemData.location}
                onChange={handleEditChange}
                className="p-2 border border-zinc-300 focus:outline-none rounded-md"
              />

              <input
                name="duration"
                placeholder="Duration in hours"
                type="number"
                value={editItemData.duration}
                onChange={handleEditChange}
                className="p-2 border border-zinc-300 focus:outline-none rounded-md"
              />

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
