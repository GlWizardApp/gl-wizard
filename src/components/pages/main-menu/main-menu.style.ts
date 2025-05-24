import { CommonProps } from "@mui/material/OverridableComponent";

export const styles: Record<string, CommonProps["style"]> = {
  root: {
    width: "calc(100vw - 6rem)",
    minHeight: "calc(100vh - 4rem)",
    justifyContent: "flex-start",
    gap: "1rem",
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
  image: {
    width: 150,
    height: "auto",
  },
  label: {
    color: "#3d9970",
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  logoWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
};
