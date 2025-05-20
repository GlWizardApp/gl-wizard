import { Grid2, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { colors } from "../../../assets/colors";

import { styles } from "./main-menu.style";

export function MainMenu() {
  const navigate = useNavigate();
  return (
    <Stack style={styles.root}>
      <Grid2 container spacing={2}>
        <Grid2 size={4}>
          <Button
            style={{ ...styles.button, backgroundColor: colors.powderBlue }}
            onClick={() => navigate("general-analysis")}
          >
            General
          </Button>
        </Grid2>
        <Grid2 size={4}>
          <Button
            style={{ ...styles.button, backgroundColor: colors.tifanyBlue }}
            onClick={() => navigate("reversal-analysis")}
          >
            Reversal
          </Button>
        </Grid2>
        <Grid2 size={4}>
          <Button
            style={{ ...styles.button, backgroundColor: colors.vistaBlue }}
            onClick={() => navigate("reversal-reclassification-analysis")}
          >
            Reversal/reclassification
          </Button>
        </Grid2>
      </Grid2>
    </Stack>
  );
}
