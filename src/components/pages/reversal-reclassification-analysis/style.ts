import { CommonProps } from "@mui/material/OverridableComponent";

export const styles: Record<string, CommonProps["style"]> = {
  root: {
    width: "100%",
    minHeight: "calc(100vh - 4rem)",
    justifyContent: "flex-start",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
  },
  dropzoneWrapper: {
    height: "100%",
  },
  divider: {
    height: "70%",
    width: 1,
    backgroundColor: "gray",
  },
  disabled: {
    opacity: 0.25,
    pointerEvents: "none",
  },
  reviewsWrapper: {
    height: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    gap: "1rem",
  },
  reviewLabel: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: "0.25rem",
  },
  buttonsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "1rem",
  },
  button: {
    borderRadius: 8,
  },
  table: {
    backgroundColor: "white",
    borderRadius: 8,
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBtnsWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
};
