import { Card, Stack, Typography, Box } from "@mui/material";
import { styles } from "./data-validity-info.style";
import { ReviewData } from "../../pages/general-analysis/general-analysis-model";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  reviewData: ReviewData;
  error: string | undefined;
  disabled: boolean;
}
export const DataValidityInfo = (props: Props) => {
  const { reviewData, error, disabled } = props;

  const { startDate, endDate, rows, total } = reviewData;
  return (
    <Card style={styles.root}>
      <Stack style={styles.reviewsWrapper}>
        {error ? (
          <Stack style={styles.errorWrapper}>
            <ErrorOutlineIcon style={styles.error} />
            <Typography style={styles.error}>{error}</Typography>
          </Stack>
        ) : (
          !disabled && (
            <>
              <Stack style={{ ...styles.reviewLabel, ...styles.widerLabel }}>
                <Typography variant="body2">Start date:</Typography>
                <Typography variant="body2" fontWeight={"bold"}>
                  {startDate}
                </Typography>
              </Stack>
              <Box style={styles.divider} />
              <Stack style={{ ...styles.reviewLabel, ...styles.widerLabel }}>
                <Typography variant="body2">End date:</Typography>
                <Typography variant="body2" fontWeight={"bold"}>
                  {endDate}
                </Typography>
              </Stack>
              <Box style={styles.divider} />
              <Stack style={styles.reviewLabel}>
                <Typography variant="body2">Rows:</Typography>
                <Typography variant="body2" fontWeight={"bold"}>
                  {rows}
                </Typography>
              </Stack>
              <Box style={styles.divider} />
              <Stack style={styles.reviewLabel}>
                <Typography variant="body2">Total:</Typography>
                <Typography variant="body2" fontWeight={"bold"}>
                  {Math.abs(total).toFixed(2)}
                </Typography>
              </Stack>
            </>
          )
        )}
      </Stack>
    </Card>
  );
};
