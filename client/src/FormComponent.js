import { useEffect, useState } from "react";
import axios from "./config/axios";
import { useParams } from "react-router-dom";

export default function FormComponent({ mode }) {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        fields: [],
    });

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";

    const [openInputs, setOpenInputs] = useState(false);
    const [editField, setEditField] = useState(null);

    useEffect(() => {
        if (isViewMode || isEditMode) {
            axios.get(`/api/forms/${id}`)
                .then(response => {
                    setFormData(response.data);
                })
                .catch(err => console.log(err));
        }
    }, [id, mode]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const invalidFields = formData.fields.filter(field => !field.value?.trim());
        if (invalidFields.length > 0) {
            console.log("Some fields are empty!");
            return;
        }

        console.log("Form Data:", formData);
    };

    const handleAddField = (type) => {
        if (isViewMode) return;
        const newField = { type, title: "", placeholder: "", value: "" };
        setFormData((prev) => ({
            ...prev,
            fields: [...prev.fields, newField],
        }));
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
        try {
            if (isEditMode) {
                const response = await axios.put(`/api/forms/${id}`, formData);
                console.log("Form updated", response.data);
            } else {
                const response = await axios.post("/api/forms", formData);
                console.log("Form created", response.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <h1>{isEditMode ? "Edit Form" : isViewMode ? "View Form" : "Create New Form"}</h1>
            <div>
                <form onSubmit={handleSubmit}>
                    {/* Editable Form Name */}
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder="Enter form name"
                        onChange={(e) =>
                            !isViewMode && setFormData((prev) => ({ ...prev, name: e.target.value }))
                        }
                        readOnly={isViewMode}
                    />

                    {formData.fields.length > 0 &&
                        formData.fields.map((ele, index) => (
                            <div key={index}>
                                <label>{ele.title || "Title"}</label>
                                <input
                                    type={ele.type}
                                    placeholder={ele.placeholder || ""}
                                    value={ele.value || ""}
                                    onChange={(e) => {
                                        const updatedFields = [...formData.fields];
                                        updatedFields[index] = { ...updatedFields[index], value: e.target.value };
                                        setFormData((prev) => ({ ...prev, fields: updatedFields }));
                                    }}
                                />
                                {!isViewMode && (
                                    <>
                                        <button type="button" onClick={() => handleEditField(ele, index)}>Edit</button>
                                        <button type="button" onClick={() => handleDeleteField(index)}>Delete</button>
                                    </>
                                )}
                            </div>
                        ))
                        
                    }

                    <input type="submit" value="Submit" />
                </form>

                {/* Add Input Button (Hidden in View Mode) */}
                {!isViewMode && (
                    <>
                        {!openInputs ? (
                            <button onClick={() => setOpenInputs(true)}>Add input</button>
                        ) : (
                            <div>
                                <button onClick={() => setOpenInputs(false)}>Close inputs</button>
                                <InputButton onClick={handleAddField} />
                            </div>
                        )}

                        <button onClick={handleCreateOrUpdate}>
                            {isEditMode ? "Update Form" : "Create Form"}
                        </button>
                    </>
                )}
            </div>

            {/* Edit Field Section (Hidden in View Mode) */}
            {!isViewMode && editField && (
                <div>
                    <h2>Edit Field</h2>
                    <input
                        type="text"
                        name="title"
                        value={editField.title}
                        placeholder="Edit title"
                        onChange={handleUpdateField}
                    />
                    <input
                        type="text"
                        name="placeholder"
                        value={editField.placeholder}
                        placeholder="Edit placeholder"
                        onChange={handleUpdateField}
                    />
                </div>
            )}
        </>
    );
}

const InputButton = ({ onClick }) => {
    const inputTypes = ["text", "number", "email", "password", "date"];

    return (
        <div>
            {inputTypes.map((type) => (
                <button key={type} onClick={() => onClick(type)}>
                    {type}
                </button>
            ))}
        </div>
    );
};