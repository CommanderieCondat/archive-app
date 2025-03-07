"use client";
import React, { useState, useRef, useEffect } from "react";
import "./globals2.css";

const Viewer = ({ data }) => {
    const { filename, image, lines } = data;
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [imageSize, setImageSize] = useState({ width: 1561, height: 2479 });
    const svgRef = useRef(null);

    const [popupData, setPopupData] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [currentLineIndex, setCurrentLineIndex] = useState(null);  // Track current line index

    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState("");

    const handleMouseOver = (index) => setHoveredIndex(index);
    const handleMouseOut = () => setHoveredIndex(null);

    // Fetch cropped image and text for the selected polygon
    const handlePolygonClick = async (line, index) => {
        try {
            // console.log('data', data)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getLine`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: filename,
                    id_line: line.id_line
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // console.log(data)
                setPopupData(data);
                setIsPopupVisible(true);
                setCurrentLineIndex(line.id_line);  // Set current line index
                setIsEditing(false);  // Exit edit mode
                setEditedText(data.text);  // Reset edited text

            } else {
                console.error("Failed to fetch sample:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching sample:", error);
        }
    };

    // Close popup
    const handleClosePopup = () => {
        setIsPopupVisible(false);
        setPopupData(null);
        setCurrentLineIndex(null);
    };

    // Navigate to previous or next line
    const handleNavigation = (direction) => {
        const newIndex = currentLineIndex + direction;
        console.log(newIndex, currentLineIndex, direction)
        if (newIndex >= 0 && newIndex < lines.length) {
            handlePolygonClick(lines[newIndex], newIndex);
        }
    };

    // rewrite the auth using proper methods ...
    const isUserAuthorized = () => {
        const token = localStorage.getItem("token");
        console.log(token)
        if (!token) return false;

        const payload = JSON.parse(atob(token.split(".")[1]));
        const role = localStorage.getItem("role");
        return role === "admin";
    };

    const removeLine = async () => {
        if (!filename || currentLineIndex === null) return;
        console.log('removing line', currentLineIndex)
        const confirmDelete = window.confirm("Etes-vous sûr de vouloir supprimer cet élément?");
        if (!confirmDelete) return;

        try {
            // Remove from "samples" collection
            const sampleResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/deleteSample`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename, id_line: currentLineIndex }),
            });

            if (!sampleResponse.ok) throw new Error("Failed to delete from samples collection");

            // Remove from "inventaireMalte" collection
            const inventaireResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/deleteLine`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename, id_line: currentLineIndex }),
            });

            if (!inventaireResponse.ok) throw new Error("Failed to delete line from inventaireMalte");

            alert("Line deleted successfully!");
            handleClosePopup();  // Close popup if successful

            // Trigger a custom event to refresh the Viewer component
            window.dispatchEvent(new Event("text-saved"));
        } catch (error) {
            console.error("Error deleting line:", error);
            alert("Failed to delete line. Please try again.");
        }
    };

    // Save edited text to database
    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updateSample`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: popupData.filename,
                    id_line: popupData.id_line,
                    newText: editedText
                }),
            });

            if (response.ok) {
                console.log("Text updated successfully!");
                await handlePolygonClick(lines[currentLineIndex], currentLineIndex);  // Refresh data
                setIsEditing(false);
            } else {
                console.error("Failed to update text:", response.statusText);
            }

            // Update text in "inventaireMalte" collection
            const responseInventaire = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updateInventaire`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: popupData.filename,
                    id_line: popupData.id_line,
                    newText: editedText
                }),
            });

            if (responseInventaire.ok) {
                console.log("Text updated successfully in inventaireMalte!");
                await handlePolygonClick(lines[currentLineIndex], currentLineIndex);  // Refresh data
                setIsEditing(false);
            } else {
                console.error("Failed to update text in inventaireMalte:", responseInventaire.statusText);
            }



        } catch (error) {
            console.error("Error updating text:", error);
        }
    };

    useEffect(() => {
        if (image) {
            const img = new Image();
            img.src = image;
            img.onload = () => setImageSize({ width: img.width, height: img.height });
        }
    }, [image]);

    return (
        <div className="justify-center items-center" style={{ width: '100%' }}>
            <div className="flex">
                <div className="w-1/2 overflow-y-scroll max-h-[calc(100vh-80px)]">
                    {image && (
                        <svg ref={svgRef} className="svg-image max-h-full" viewBox={`0 0 ${imageSize.width} ${imageSize.height}`} xmlns="http://www.w3.org/2000/svg">
                            <image href={image} height="100%" width="100%" />
                            {lines.map((line, index) => (
                                <polygon
                                    key={index}
                                    className={`textline ${hoveredIndex === index ? "highlighted" : ""}`}
                                    points={line.polygon}
                                    onMouseOver={() => handleMouseOver(index)}ct windo
                                    onMouseOut={handleMouseOut}
                                    onClick={() => handlePolygonClick(line)}  // Fetch data on click
                                />
                            ))}
                        </svg>
                    )}
                </div>
                <div className="w-1/2 transcription" style={{ marginTop: '20px', marginLeft: '20px' }}>
                    {lines.map((line, index) => (
                        <span
                            key={index}
                            className={`block my-2 ${hoveredIndex === index ? "highlighted" : ""}`}
                            onMouseOver={() => handleMouseOver(index)}
                            onMouseOut={handleMouseOut}
                            onClick={() => handlePolygonClick(line)}  // Fetch data on click
                        >
                            {line.text}
                        </span>
                    ))}
                </div>
            </div>
            {isPopupVisible && popupData && (
                <div className="popup-overlay">
                    {!isEditing ? (
                        <div className="bg-black rounded-lg shadow-lg p-6 max-w-4xl relative flex flex-col items-center border"
                            style={{ backgroundColor: '#171616', minWidth: '50%' }}>
                            <button
                                onClick={handleClosePopup}
                                className="absolute top-2 right-2 text-gray-100 hover:text-red-300"
                            >✖</button>
                            <button
                                onClick={() => handleNavigation(-1)}
                                className="absolute left-1 top-30 text-gray-100 hover:text-red-300 z-70 "
                                style={{ fontSize: '20px' }}
                            >
                                ◀
                            </button>
                            <img
                                src={`data:image/png;base64,${popupData.image_data}`}
                                alt="Cropped"
                                className="mb-4 max-w-full max-h-96"
                            />
                            <p className="text-gray-100 text-center">{popupData.text}</p>
                            <button
                                onClick={() => handleNavigation(1)}
                                className="absolute right-1 top-30 text-gray-100 hover:text-red-300 z-70"
                                style={{ fontSize: '20px' }}
                            >
                                ▶
                            </button>

                            {isUserAuthorized() &&(
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="mt-4 px-4 py-2 text-white rounded hover:bg-gray-500 border"
                                    >Edit</button>
                                    <button
                                        onClick={removeLine}
                                        className="mt-4 px-4 py-2 text-white rounded hover:bg-gray-500 border"
                                    >Remove</button>
                                </div>
                            )}
                        </div>) : (
                        <div className="bg-black rounded-lg shadow-lg p-6 max-w-4xl relative flex flex-col items-center"
                            style={{ backgroundColor: '#2c2929', minWidth: '50%' }}>
                            <img
                                src={`data:image/png;base64,${popupData.image_data}`}
                                alt="Cropped"
                                className="mb-4 max-w-full max-h-96"
                            />
                            <textarea
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-white rounded hover:bg-gray-500 border"
                                >Cancel</button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2  text-white rounded hover:bg-gray-500 border"
                                >Save</button>
                            </div>
                        </div>)}
                </div>
            )}

        </div>
    );
};

export default Viewer;
