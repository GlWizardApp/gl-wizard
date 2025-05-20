import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Stack,
} from "@mui/material";
import { styles } from "../analysed-data-overview/analysed-data-overview.style";
import { BasicTable, TableHeader } from "../composed/basic-table/basic-table";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Props {
  title: string;
  disabled: boolean;
  tableHeader: TableHeader[];
  tableData: Record<string, string>[];
}
export const BasicDataOverview = (props: Props) => {
  const { title, disabled, tableHeader, tableData } = props;
  return (
    <Accordion
      style={{
        ...styles.accordionRoot,
        ...(disabled ? styles.disabled : {}),
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack>
          <BasicTable header={tableHeader} data={tableData} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
