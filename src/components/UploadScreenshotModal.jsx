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
import { createClient } from "@/utils/supabase/client";

const UploadScreenshotModal = ({
  show,
  onClose,
  onConfirm,
  userId,
  upload,
}) => {
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
    formData.append("giver_id", userId); // Include giver_id here

    // Upload screenshot and confirm payment logic here...

    setIsLoading(false);

    const response = await upload(formData);
    alert("uploaded");
    const supabase = createClient();
    const { data, error } = await supabase
      .from("merge_givers")
      .update({ confirmed: true }) // Use object here
      .eq("user_id", userId);
    console.log(error, "page 65");

    onConfirm();
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
          <Button
            onClick={screenshot ? handleSubmit : handleButtonClick}
            disabled={isLoading}
          >
            {screenshot ? "Upload Screenshot" : "Choose File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadScreenshotModal;
