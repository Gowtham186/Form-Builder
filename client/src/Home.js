import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./config/axios";

export default function Home() {
    const [forms, setForms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.get("/api/forms");
                console.log(response.data);
                setForms(response.data);
            } catch (err) {
                console.error("Error fetching forms:", err);
            }
        };
        fetchForms();
    }, []);

    const handleDeleteForm = async (id) => {
        console.log("Delete", id);
        try {
            const response = await axios.delete(`/api/forms/${id}`);
            console.log(response.data);
            setForms((prev) => prev.filter((ele) => ele._id !== response.data._id));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-black">
            <h1 className="text-2xl font-bold mb-2">Welcome to Form Builder</h1>
            <button
                onClick={() => navigate("/form/create")}
                className="bg-white text-blue-500 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-200 transition"
            >
                Create New Form
            </button>
            <hr className="w-2/3 my-6 border-white" />
            <div className="w-full max-w-3xl bg-white text-black p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-center">All Forms</h2>
                {forms.length > 0 ? (
                    <div className="space-y-4">
                        {forms.map((form) => (
                            <div key={form._id} className="p-4 bg-gray-100 flex items-center justify-between">
                                <h3 className="text-lg font-semibold">{form.name}</h3>
                                <div className="space-x-3">
                                    <button
                                        onClick={() => navigate(`/form/${form._id}`)}
                                        className="bg-blue-500 text-white px-2 py-1 hover:bg-blue-600 transition"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => navigate(`/form/edit/${form._id}`)}
                                        className="bg-green-500 text-white px-2 py-1  hover:bg-green-600 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteForm(form._id)}
                                        className="bg-red-500 text-white px-2 py-1  hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center">No Forms found</p>
                )}
            </div>
        </div>
    );
}
