import { Stack } from "@mui/material";
import { useDropzone } from "react-dropzone";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";

interface Props {
  onDrop: (acceptedFiles: File[]) => void;
  text: string;
  uploaded: boolean;
}
export function FileDropzone(props: Props) {
  const { text, uploaded, onDrop } = props;
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Stack
      {...getRootProps()}
      style={{
        border: "2px dashed #ccc",
        borderRadius: "8px",
        height: "100%",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        ...(uploaded ? { pointerEvents: "none" } : {}),
      }}
    >
      <input {...getInputProps()} />
      {uploaded ? <DownloadDoneIcon style={{ fontSize: "5rem" }} /> : text}
    </Stack>
  );
}
