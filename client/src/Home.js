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

    const handleDeleteForm = (id)=>{
        console.log("Delete",id)
    }

    return (
        <div>
            <h1>Welcome to Form Builder</h1>
            <button onClick={() => navigate("/form/create")}>Create New Form</button>
            <hr />
            <div>
                <h2>All Forms</h2>
                {forms.length > 0 ? (
                    forms.map((form) => (
                        <div key={form._id}>
                            <h3>{form.name}</h3>
                            <button onClick={() => navigate(`/form/${form._id}`)}>View</button>
                            <button onClick={() => navigate(`/form/edit/${form._id}`)}>Edit</button>
                            <button onClick={() => handleDeleteForm(form._id)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No Forms found</p>
                )}
            </div>
        </div>
    );
}
