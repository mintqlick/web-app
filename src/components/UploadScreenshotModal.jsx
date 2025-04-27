import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const UploadScreenshotModal = ({ show, onClose, onConfirm, userId }) => {
  const [screenshot, setScreenshot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setScreenshot(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!screenshot) {
      alert("Please upload a screenshot");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("screenshot", screenshot);

    // Upload the screenshot to the server (or Supabase Storage, etc.)
    const uploadResponse = await fetch("/api/upload-screenshot", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();

    if (uploadData.success) {
      // After uploading, confirm the payment in the database
      const confirmResponse = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, type: "giver" }),
      });

      const confirmData = await confirmResponse.json();
      if (confirmData.success) {
        alert("Payment confirmed!");
        onConfirm(); // Notify parent to close the modal or refresh state
      } else {
        alert("Error confirming payment");
      }
    } else {
      alert("Error uploading screenshot");
    }

    setIsLoading(false);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Giver Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {isLoading && <p>Uploading...</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          Upload Screenshot
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadScreenshotModal;
