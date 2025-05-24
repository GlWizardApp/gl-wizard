import { CommonProps } from "@mui/material/OverridableComponent";

export const styles: Record<string, CommonProps["style"]> = {
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  headerBtnsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontWeight: "bold",
  },
  name: {
    fontWeight: "bold",
    paddingRight: "1rem",
    color: "gray",
  },
};
