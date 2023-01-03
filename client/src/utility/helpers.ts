import { ChangeEvent } from "react";
import { toast } from "react-toastify";

export const copyToClipboard = async (roomId: string | undefined): Promise<void> => {
    if (!roomId) {
      toast.error("No room id? You shouldn't be here.");
      return;
    }
    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        toast.success("Room id copied to your clipboard!");
      })
      .catch((err) => {
        toast.error("Could not copy room Id");
        console.log(err);
      });
  };