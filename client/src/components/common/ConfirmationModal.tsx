import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
  open: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  text,
  onConfirm,
  onCancel,
  open,
}) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="border rounded-lg p-3 w-[400px]">
        <DialogHeader>
          <DialogTitle className="!text-lg p-5 font-semibold leading-7 text-center">
            {text}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <div className="flex gap-4 w-full justify-center mb-5">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              className="cursor-pointer"
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
