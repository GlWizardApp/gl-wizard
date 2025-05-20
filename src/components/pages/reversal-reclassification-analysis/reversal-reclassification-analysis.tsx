import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Grid2,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { FileDropzone } from "../../ui-kit/dropzone/dropzone";
import { Dropdown } from "../../ui-kit/dropdown/dropdown";
import { DataGrid } from "@mui/x-data-grid";
import { styles } from "./style";
import { useReversalReclassificationAnalysis } from "./reversal-reclassification-analysis-model";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import DownloadIcon from "@mui/icons-material/Download";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AnalysisStep } from "../general-analysis/general-analysis-model";

export function ReversaReclassificationAnalysis() {
  const {
    glHeaderOptions,
    coaHeaderOptions,
    selectedHeaders,
    reviewData,
    tableHeader,
    tableData,
    currentStep,
    selectedFilters,
    coaFilterOptions,
    onChangeCoaFilter,
    onPressDownloadData,
    onChangeCoaHeader,
    onChangeGlHeader,
    onGeneralLedgerDrop,
    onPressAnalyzeData,
    onChartOfAccountsDrop,
    onPressResetBtn,
  } = useReversalReclassificationAnalysis();

  return (
    <Stack style={styles.root} spacing={2}>
      <Card style={styles.card}>
        <Stack style={styles.headerWrapper}>
          <Breadcrumbs>
            <Typography>GL Wizard</Typography>
            <Typography fontWeight={"bold"}>
              Reversal/Reclassification Analysis
            </Typography>
          </Breadcrumbs>
          <Stack style={styles.headerBtnsWrapper}>
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
            <IconButton onClick={onPressResetBtn}>
              <RestartAltIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Card>
      <Grid2 container spacing={2}>
        <Grid2 size={6}>
          <Card style={styles.card}>
            <Grid2 container spacing={2}>
              <Grid2 size={6}>
                <FileDropzone
                  onDrop={onGeneralLedgerDrop}
                  text={"Drop GL file here"}
                  uploaded={currentStep.includes(AnalysisStep.TO_UPLOAD_COA)}
                />
              </Grid2>
              <Grid2 size={6}>
                <Stack spacing={1}>
                  <Dropdown
                    label="Konto"
                    items={glHeaderOptions}
                    value={selectedHeaders.glHeaders.account}
                    onChange={(event) =>
                      onChangeGlHeader("account", event.target.value as string)
                    }
                  />
                  <Dropdown
                    label="Jen"
                    items={glHeaderOptions}
                    value={selectedHeaders.glHeaders.jen}
                    onChange={(event) =>
                      onChangeGlHeader("jen", event.target.value as string)
                    }
                  />
                  <Dropdown
                    label="Date"
                    items={glHeaderOptions}
                    value={selectedHeaders.glHeaders.date}
                    onChange={(event) =>
                      onChangeGlHeader("date", event.target.value as string)
                    }
                  />
                  <Dropdown
                    label="Value"
                    items={glHeaderOptions}
                    value={selectedHeaders.glHeaders.value}
                    onChange={(event) =>
                      onChangeGlHeader("value", event.target.value as string)
                    }
                  />
                </Stack>
              </Grid2>
            </Grid2>
          </Card>
        </Grid2>
        <Grid2 size={6}>
          <Card
            style={{
              ...styles.card,
              height: "calc(100% - 2rem)",
              ...(!currentStep.includes(AnalysisStep.TO_UPLOAD_COA)
                ? styles.disabled
                : {}),
            }}
          >
            <Grid2 height={"100%"} container spacing={2}>
              <Grid2 size={6}>
                <FileDropzone
                  onDrop={onChartOfAccountsDrop}
                  text="Drop CoA file here"
                  uploaded={currentStep.includes(AnalysisStep.TO_ANALYZE)}
                />
              </Grid2>
              <Grid2 size={6}>
                <Stack spacing={1}>
                  <Dropdown
                    label="Mapping value"
                    items={coaHeaderOptions}
                    value={selectedHeaders.coaHeaders.mappingValue}
                    onChange={(event) =>
                      onChangeCoaHeader(
                        "mappingValue",
                        event.target.value as string
                      )
                    }
                  />
                  <Dropdown
                    label="Filter by"
                    items={coaHeaderOptions}
                    value={selectedFilters.header}
                    onChange={(event) =>
                      onChangeCoaFilter("header", event.target.value as string)
                    }
                  />
                  <Dropdown
                    label="Filter by value"
                    items={coaFilterOptions}
                    value={selectedFilters.value}
                    onChange={(event) =>
                      onChangeCoaFilter("value", event.target.value as string)
                    }
                  />
                </Stack>
              </Grid2>
            </Grid2>
          </Card>
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2}>
        <Grid2 size={6}>
          <Card
            style={{
              ...styles.card,
              height: "calc(100% - 2rem)",
              ...(!currentStep.includes(AnalysisStep.TO_UPLOAD_COA)
                ? styles.disabled
                : {}),
            }}
          >
            <Stack style={styles.reviewsWrapper}>
              <Stack style={{ ...styles.reviewLabel, flex: 3 }}>
                <Typography variant="body2">Start date:</Typography>
                <Typography variant="body2" fontWeight={"bold"}>
                  {reviewData.startDate}
                </Typography>
              </Stack>
              <Box style={styles.divider} />
              <Stack style={{ ...styles.reviewLabel, flex: 3 }}>
                <Typography variant="body2">End date:</Typography>
                <Typography variant="body2" fontWeight={"bold"}>
                  {reviewData.endDate}
                </Typography>
              </Stack>
              <Box style={styles.divider} />
              <Stack style={{ ...styles.reviewLabel, flex: 2 }}>
                <Typography variant="body2">Rows:</Typography>
                <Typography variant="body2" fontWeight={"bold"}>
                  {reviewData.rows}
                </Typography>
              </Stack>
              <Box style={styles.divider} />
              <Stack style={{ ...styles.reviewLabel, flex: 2 }}>
                <Typography variant="body2">Total:</Typography>
                <Typography variant="body2" fontWeight={"bold"}>
                  {reviewData.total}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid2>
        <Grid2 size={6}>
          <Card
            style={{
              ...styles.card,
              ...(!currentStep.includes(AnalysisStep.TO_ANALYZE)
                ? styles.disabled
                : {}),
            }}
          >
            <Stack style={styles.buttonsWrapper}>
              <Button
                onClick={onPressAnalyzeData}
                variant="contained"
                style={{ ...styles.button, backgroundColor: "#204795" }}
                endIcon={<TroubleshootIcon />}
              >
                Analyze
              </Button>

              <Button
                onClick={onPressDownloadData}
                variant="contained"
                style={{
                  ...styles.button,
                  backgroundColor: "#1D6F42",
                  ...(!currentStep.includes(AnalysisStep.ANALYZED)
                    ? styles.disabled
                    : {}),
                }}
                endIcon={<DownloadIcon />}
              >
                Download
              </Button>
            </Stack>
          </Card>
        </Grid2>
      </Grid2>

      <DataGrid
        style={{
          ...styles.table,
          ...(!currentStep.includes(AnalysisStep.ANALYZED)
            ? styles.disabled
            : {}),
        }}
        getRowId={() => `${Math.random()}`}
        hideFooter
        columns={currentStep.includes(AnalysisStep.ANALYZED) ? tableHeader : []}
        rows={tableData}
      />
    </Stack>
  );
}
