import { CommonProps } from "@mui/material/OverridableComponent";

export const styles: Record<string, CommonProps["style"]> = {
  root: {
    width: "calc(100vw - 6rem)",
    minHeight: "calc(100vh - 4rem)",
    justifyContent: "flex-start",
  },
  button: {
    width: "100%",
    backgroundColor: "white",
    height: "15rem",
    borderRadius: 8,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
};
