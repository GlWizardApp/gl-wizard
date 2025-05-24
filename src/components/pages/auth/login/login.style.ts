import { CommonProps } from "@mui/material/OverridableComponent";
import { colors } from "../../../../assets/colors";
export const styles: Record<string, CommonProps["style"]> = {
  root: {
    width: "calc(100vw - 6rem)",
    minHeight: "calc(100vh - 4rem)",
    justifyContent: "center",
    alignItems: "center",
  },
  loginBlock: {
    width: 400,
    height: 400,
    backgroundColor: colors.honeydew,
    borderRadius: 8,
    padding: "2rem",
    gap: "1rem",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "8rem",
    width: "8rem",
    marginBottom: "-0.5rem",
  },
  label: {
    color: "#3d9970",
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  button: {
    backgroundColor: "#3d9970",
    width: "100%",
    color: "white",
    fontSize: "1rem",
  },
  imageAndLogo: {
    paddingBottom: "1rem",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
  },
  errors: {
    minHeight: "3rem",
  },
  error: {
    fontSize: "0.75rem",
    color: "red",
  },
};
