import { useNavigate } from "react-router";
import { styles } from "./header-style";
import {
  Card,
  Stack,
  Breadcrumbs,
  Typography,
  IconButton,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Props {
  title: string;
  onPressResetBtn: () => void;
}
export const Header = (props: Props) => {
  const { title, onPressResetBtn } = props;
  const navigate = useNavigate();

  return (
    <Card style={styles.card}>
      <Stack style={styles.headerWrapper}>
        <Breadcrumbs>
          <Typography>GL Wizard</Typography>
          <Typography style={styles.title}>{title}</Typography>
        </Breadcrumbs>
        <Stack style={styles.headerBtnsWrapper}>
          <IconButton onClick={() => navigate("/")}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton onClick={onPressResetBtn}>
            <RestartAltIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Card>
  );
};
