import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const UploadScreenshotModal = ({ show, onClose, onConfirm, userId }) => {
  const [screenshot, setScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setScreenshot(file);
    setPreviewUrl(URL.createObjectURL(file)); // Create preview
  };

  const handleButtonClick = () => {
    if (!screenshot) {
      // Trigger file selection
      fileInputRef.current.click();
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!screenshot) {
      alert("Please upload a screenshot");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("screenshot", screenshot);

    // Upload screenshot and confirm payment logic here...

    setIsLoading(false);
    // onConfirm(); // Or close the modal

    //  Upload the screenshot to the server (or Supabase Storage, etc.)
    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();

    console.log(uploadData);
    // if (uploadData.success) {
    //   // After uploading, confirm the payment in the database
    //   const confirmResponse = await fetch("/api/confirm-payment", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ user_id: userId, type: "giver" }),
    //   });

    //   const confirmData = await confirmResponse.json();
    //   if (confirmData.success) {
    //     alert("Payment confirmed!");
    //     onConfirm(); // Notify parent to close the modal or refresh state
    //   } else {
    //     alert("Error confirming payment");
    //   }
    // } else {
    //   alert("Error uploading screenshot");
    // }
  };

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Giver Payment</DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-4">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Image Preview */}
          {previewUrl && (
            <div className="w-full">
              <Image
                src={previewUrl}
                alt="Screenshot Preview"
                width={400}
                height={200}
                className="rounded-md object-cover mx-auto"
              />
            </div>
          )}

          {isLoading && <p className="text-sm text-gray-500">Uploading...</p>}
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Close
            </Button>
          </DialogClose>
          <Button onClick={handleButtonClick} disabled={isLoading}>
            {screenshot ? "Upload Screenshot" : "Choose File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadScreenshotModal;
