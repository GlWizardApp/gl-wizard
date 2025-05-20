import { CommonProps } from "@mui/material/OverridableComponent";

export const styles: Record<string, CommonProps["style"]> = {
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBtnsWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontWeight: "bold",
  },
};
