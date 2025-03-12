import { useEffect, useState } from "react";
import axios from "./config/axios";
import { useNavigate, useParams } from "react-router-dom";

export default function FormComponent({ mode }) {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        fields: [],
    });
    const [loading, setLoading] = useState(false);

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";

    const [openInputs, setOpenInputs] = useState(false);
    const [editField, setEditField] = useState(null);
    const navigate = useNavigate();
    const [clientErrors, setClientErorrs] = useState(null)

    useEffect(() => {
        if (isViewMode || isEditMode) {
            axios.get(`/api/forms/${id}`)
                .then(response => setFormData(response.data))
                .catch(err => console.log(err));
        }
    }, [id, mode]);

    const errors = {}
    const clientValidations = () => {
        errors.name = formData.name.trim().length === 0 ? "Form name is required" : "";
    
        if (formData.fields.length === 0) {
            errors.fields = "At least one field is required";
        }
    
        formData.fields.forEach((ele, i) => {
            if (ele.title.trim().length === 0) {
                errors[`title${i}`] = "Title is required";
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        clientValidations()
        console.log(errors)
        if(Object.keys(errors).length !== 0){
            setClientErorrs(errors)
        }else{
            setClientErorrs("No Errors")
        }
        console.log("Form Data:", formData);
    };

    const handleAddField = (type) => {
        if (isViewMode || formData.fields.length >= 20) return;
        const newField = { type, title: "", placeholder: "", value: "" };
        setFormData((prev) => ({ ...prev, fields: [...prev.fields, newField] }));
    };

    const handleDeleteField = (index) => {
        if (isViewMode) return;
        setFormData((prev) => ({
            ...prev,
            fields: prev.fields.filter((_, i) => i !== index),
        }));
        setEditField(null);
    };

    const handleEditField = (field, index) => {
        if (isViewMode) return;
        setEditField({ ...field, index });
    };

    const handleUpdateField = (e) => {
        if (!editField) return;
        const { name, value } = e.target;
        setEditField((prev) => ({ ...prev, [name]: value }));

        setFormData((prev) => {
            const updatedFields = [...prev.fields];
            updatedFields[editField.index] = { ...updatedFields[editField.index], [name]: value };
            return { ...prev, fields: updatedFields };
        });
    };

    const handleCreateOrUpdate = async () => {
        if (isViewMode) return;
        clientValidations()
        setLoading(true);
        try {
            if(Object.keys(errors).length !== 0){
                setClientErorrs(errors)
            }else{
                if (isEditMode) {
                    const response = await axios.put(`/api/forms/${id}`, formData);
                    console.log("Form updated", response.data);
                    navigate("/");
                } else {
                    const response = await axios.post("/api/forms", formData);
                    console.log("Form created", response.data);
                    navigate("/");
                }
            }
        } catch (err) {
            console.log(err);
        }finally{
            setLoading(true);
        }
    };

    return (
        <div className="flex gap-8 p-6">
            <div className="w-2/3 bg-white shadow-md p-6 rounded-lg">
                <h1 className="text-xl font-bold mb-4">
                    {isEditMode ? "Edit Form" : isViewMode ? "View Form" : "Create New Form"}
                </h1>
                {loading && <p className="text-blue-500">Loading...</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder="Enter form name"
                        className="w-full p-2 border rounded-md"
                        onChange={(e) =>
                            !isViewMode && setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        readOnly={isViewMode}
                    />
                    {clientErrors && <p className="text-red-500 text-xs">{clientErrors.name}</p>}
                    {clientErrors && <p className="text-red-500 text-xs">{clientErrors.fields}</p>}

                    {formData.fields.length > 0 &&
                        formData.fields.map((ele, index) => (
                            <div key={index} className="flex gap-4 items-center bg-gray-100 p-3 rounded-md">
                                <label className="w-1/4 text-gray-700">{ele.title}</label>
                                <input
                                    type={ele.type}
                                    placeholder={ele.placeholder || ""}
                                    value={ele.value || ""}
                                    className="flex-grow p-2 border rounded-md"
                                    onChange={(e) => {
                                        const updatedFields = [...formData.fields];
                                        updatedFields[index] = { ...updatedFields[index], value: e.target.value };
                                        setFormData((prev) => ({ ...prev, fields: updatedFields }));
                                    }}
                                />
                                {!isViewMode && (
                                    <div className="flex gap-2">
                                        <button type="button" className="px-3 py-1 bg-blue-500 text-white" onClick={() => handleEditField(ele, index)}>Edit</button>
                                        <button type="button" className="px-3 py-1 bg-red-500 text-white" onClick={() => handleDeleteField(index)}>Delete</button>
                                    </div>
                                )}
                                {clientErrors && clientErrors[`value${index}`] && <p className="text-red-500">{clientErrors[`value${index}`]}</p>}
                            </div>
                        ))
                    }

                    <input type="submit" value="Submit" className="px-2 bg-green-500 text-white cursor-pointer" />
                </form>

                {!isViewMode && (
                    <div className="mt-4">
                        {!openInputs ? (
                            <button className="px-2 bg-gray-600 text-white" onClick={() => setOpenInputs(true)}>Add input</button>
                        ) : (
                            <div className="mt-2">
                                <button className="px-2 bg-red-500 text-white" onClick={() => setOpenInputs(false)}>Close inputs</button>
                                <InputButton onClick={handleAddField} />
                            </div>
                        )}

                        <button className="px-2 bg-blue-600 text-white ml-2" onClick={handleCreateOrUpdate}>
                            {isEditMode ? "Update Form" : "Create Form"}
                        </button>
                    </div>
                )}
            </div>

            {!isViewMode && editField && (
                <div className="w-1/3 bg-gray-100 p-6 shadow-md rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Edit Field</h2>
                    <div className="space-y-3">
                        <input
                            type="text"
                            name="title"
                            value={editField.title}
                            placeholder="Edit title"
                            className="w-full p-2 border"
                            onChange={handleUpdateField}
                        />
                        <input
                            type="text"
                            name="placeholder"
                            value={editField.placeholder}
                            placeholder="Edit placeholder"
                            className="w-full p-2 border"
                            onChange={handleUpdateField}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

const InputButton = ({ onClick }) => {
    const inputTypes = ["text", "number", "email", "password", "date"];

    return (
        <div className="m-2 ml-48 flex flex-wrap gap-2">
            {inputTypes.map((type) => (
                <button key={type} className="px-2 bg-green-800 text-white rounded-md" onClick={() => onClick(type)}>
                    {type}
                </button>
            ))}
        </div>
    );
};
