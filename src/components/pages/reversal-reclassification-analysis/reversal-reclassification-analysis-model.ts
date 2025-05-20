/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Workbook } from "exceljs";
import { formatDate } from "date-fns";
import { GridColDef } from "@mui/x-data-grid";
import { saveAs } from "file-saver";
import {
  AnalysisStep,
  RawData,
  ReviewData,
  GlHeaders,
} from "../general-analysis/general-analysis-model";

export interface SelectedHeaders {
  glHeaders: GlHeaders;
  coaHeaders: CoaHeaders;
}

export interface CoaHeaders {
  mappingValue: string;
}

export interface CoaFilters {
  header: string;
  value: string;
}
export function useReversalReclassificationAnalysis() {
  const [currentStep, setCurrentStep] = useState<AnalysisStep[]>([
    AnalysisStep.TO_UPLOAD_GL,
  ]);
  const [rawData, setRawData] = useState<RawData>({
    glData: [],
    glHeaders: [],
    coaData: [],
    coaHeaders: [],
  });

  const [tableData, setTableData] = useState<Record<string, any>[]>([]);

  const [selectedFilters, setSelectedFilters] = useState<CoaFilters>({
    header: "",
    value: "",
  });
  const [selectedHeaders, setSelectedHeaders] = useState<SelectedHeaders>({
    glHeaders: {
      account: "",
      jen: "",
      date: "",
      value: "",
    },
    coaHeaders: {
      mappingValue: "",
    },
  });

  const reviewData: ReviewData = useMemo(() => {
    const dateValues = rawData.glData
      .map((item) => new Date(item[selectedHeaders.glHeaders.date]).getTime())
      .filter((time) => !isNaN(time));
    return {
      rows: rawData.glData.length,
      total: selectedHeaders.glHeaders.value
        ? rawData.glData.reduce(
            (prev, curr) =>
              (prev += isNaN(curr[selectedHeaders.glHeaders.value])
                ? 0
                : curr[selectedHeaders.glHeaders.value]),
            0
          )
        : 0,
      startDate:
        selectedHeaders.glHeaders.date && dateValues.length > 0
          ? formatDate(new Date(Math.min(...dateValues)), "dd-MM-yyyy")
          : "-",
      endDate:
        selectedHeaders.glHeaders.date && dateValues.length > 0
          ? formatDate(new Date(Math.max(...dateValues)), "dd-MM-yyyy")
          : "-",
    };
  }, [rawData, selectedHeaders]);

  const glHeaderOptions = useMemo(
    () =>
      rawData.glHeaders.map((item) => ({
        value: item,
        title: item,
      })),
    [rawData]
  );

  const coaHeaderOptions = useMemo(
    () =>
      rawData.coaHeaders.map((item) => ({
        value: item,
        title: item,
      })),
    [rawData]
  );

  const coaFilterOptions = useMemo(
    () =>
      [
        ...new Set(
          rawData.coaData
            .map((item) => item[selectedFilters.header])
            .filter(Boolean)
        ),
      ].map((item) => ({
        value: item,
        title: item,
      })),
    [rawData.coaData, selectedFilters]
  );

  const tableHeader: GridColDef[] = useMemo(
    () => [
      ...Object.keys(selectedHeaders.glHeaders).map((item) => ({
        field: selectedHeaders.glHeaders[item as keyof GlHeaders],
        headerName: selectedHeaders.glHeaders[item as keyof GlHeaders],
        valueGetter: (value: string | Date | string[]) =>
          item === "date" ? formatDate(value as Date, "dd-MM-yyyy") : value,
        sortable: false,
        filterable: false,
        resizable: false,
        disableColumnMenu: true,
        flex: 1,
      })),
      {
        field: selectedFilters.header,
        headerName: selectedFilters.header,
        valueGetter: (_: any, row: any) => row.coaData[selectedFilters.header],
        sortable: false,
        filterable: false,
        resizable: false,
        disableColumnMenu: true,
        flex: 1,
      },
      {
        field: "result",
        headerName: "Rezultat",
        sortable: false,
        filterable: false,
        resizable: false,
        disableColumnMenu: true,
        flex: 1,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedHeaders.glHeaders, tableData, selectedFilters]
  );

  const onGeneralLedgerDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const workbook = new Workbook();
    await workbook.xlsx.load(buffer);

    const sheet = workbook.worksheets[0]; // Get first sheet
    if (!sheet) return;

    // Get column names
    const columnNames: string[] = sheet.getRow(1).values as string[];

    // Read data
    const rows = sheet
      .getSheetValues()
      .slice(2) // Skip header row
      .map((row: any) =>
        columnNames.reduce((acc, col, index) => {
          acc[col] = row[index] || "";
          return acc;
        }, {} as Record<string, any>)
      );

    setRawData((prev) => ({
      ...prev,
      glData: rows,
      glHeaders: columnNames.filter(Boolean),
    }));
    setSelectedHeaders((prev) => ({
      ...prev,
      glHeaders: {
        account: columnNames.filter(Boolean)[0],
        jen: columnNames.filter(Boolean)[1],
        date: columnNames.filter(Boolean)[2],
        value: columnNames.filter(Boolean)[3],
      },
    }));
    setCurrentStep((prev) => [...prev, AnalysisStep.TO_UPLOAD_COA]);
  };

  const onChartOfAccountsDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const workbook = new Workbook();
    await workbook.xlsx.load(buffer);

    const sheet = workbook.worksheets[0]; // Get first sheet
    if (!sheet) return;

    // Get column names
    const columnNames: string[] = sheet.getRow(1).values as string[];

    // Read data
    const rows = sheet
      .getSheetValues()
      .slice(2) // Skip header row
      .map((row: any) =>
        columnNames.reduce((acc, col, index) => {
          acc[col] = row[index]?.result ?? row[index] ?? "";
          return acc;
        }, {} as Record<string, any>)
      );

    setRawData((prev) => ({
      ...prev,
      coaData: rows,
      coaHeaders: columnNames.filter(Boolean),
    }));
    setSelectedHeaders((prev) => ({
      ...prev,
      coaHeaders: {
        mappingValue: columnNames.filter(Boolean)[0],
        filters: {
          header: "",
          value: "",
        },
      },
    }));
    setSelectedFilters((prev) => ({
      ...prev,
      header: columnNames.filter(Boolean)[0],
    }));
    setCurrentStep((prev) => [...prev, AnalysisStep.TO_ANALYZE]);
  };

  const onChangeGlHeader = (key: keyof GlHeaders, value: string) => {
    setSelectedHeaders((prev) => ({
      ...prev,
      glHeaders: { ...prev.glHeaders, [key]: value },
    }));
  };

  const onChangeCoaFilter = (key: keyof CoaFilters, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onChangeCoaHeader = (key: keyof CoaHeaders, value: string) => {
    setSelectedHeaders((prev) => ({
      ...prev,
      coaHeaders: { ...prev.coaHeaders, [key]: value },
    }));
  };

  const onPressResetBtn = () => {
    setCurrentStep([AnalysisStep.TO_UPLOAD_GL]);
    setTableData([]);
    setRawData({
      coaData: [],
      coaHeaders: [],
      glData: [],
      glHeaders: [],
    });
    setSelectedHeaders({
      coaHeaders: {
        mappingValue: "",
      },
      glHeaders: {
        account: "",
        date: "",
        jen: "",
        value: "",
      },
    });
    setSelectedFilters({
      header: "",
      value: "",
    });
  };

  const onPressAnalyzeData = () => {
    const output = rawData.glData.map((item) => {
      const foundCoaItems = rawData.coaData.filter((coaItem) =>
        item[selectedHeaders.glHeaders.account].includes(
          coaItem[selectedHeaders.coaHeaders.mappingValue]
        )
      );
      const betterMatchingCoaItem = foundCoaItems.sort(
        (a, b) => b.length - a.length
      )[0];

      return {
        ...item,
        coaData: betterMatchingCoaItem,
      };
    });

    const filtered = output.filter((item) =>
      selectedFilters.header && selectedFilters.value
        ? item.coaData[selectedFilters.header] === selectedFilters.value
        : true
    );

    const groupedByAccountAndDate: Record<string, any[]> = filtered.reduce(
      (acc, curr) => {
        const key = `${
          curr[
            selectedHeaders.glHeaders.date as Exclude<
              keyof typeof curr,
              "coaData"
            >
          ]
        }_${
          curr[
            selectedHeaders.glHeaders.account as Exclude<
              keyof typeof curr,
              "coaData"
            >
          ]
        }`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(curr);
        return acc;
      },
      {} as Record<string, any[]>
    );

    for (const [, rows] of Object.entries(groupedByAccountAndDate)) {
      let i = 0;
      while (i < rows.length) {
        const chunk = [];
        let sum = 0;

        for (let j = i; j < rows.length; j++) {
          chunk.push(rows[j]);
          sum =
            Number(sum.toFixed(2)) +
            Number(rows[j][selectedHeaders.glHeaders.value].toFixed(2));
          // Check if the sum of the chunk is zero
          if (sum === 0) {
            // Assign the result property to each row in the chunk
            chunk.forEach((row) => (row.result = "reversal/reclassification"));

            // Move to the next unprocessed rows
            i = j + 1;
            break;
          }
        }

        // If the loop ends without finding a zero sum, increase the chunk size
        if (sum !== 0) {
          i++; // Increase starting point to prevent infinite loop
        }
      }
    }

    setTableData(Object.values(groupedByAccountAndDate).flat());
    setCurrentStep((prev) => [...prev, AnalysisStep.ANALYZED]);
  };

  const onPressDownloadData = async () => {
    const dataForExport = tableData.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { coaData, ...rest } = item;

      return {
        ...rest,
        result: Array.isArray(rest.result)
          ? rest.result.join("/")
          : rest.result,
      };
    });

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Extract headers from object keys
    const headers = Object.keys(dataForExport[0]);

    // Set column widths and define headers
    worksheet.columns = headers.map((header) => ({
      header,
      key: header,
      width: 20, // Adjust width as needed
    }));

    // Style headers (bold text, light gray background)
    const headerRow = worksheet.getRow(0);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D3D3D3" }, // Light gray background
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Add rows with formatting
    dataForExport.forEach((obj: Record<string, any>) => {
      const row = headers.map((header) => {
        const value = obj[header];

        // Convert large numbers to string to prevent scientific notation
        if (typeof value === "number" && value > 999999) {
          return `${value}`;
        }

        return value;
      });

      const rowInstance = worksheet.addRow(row);

      // Apply light yellow background to the final column
      rowInstance.getCell(headers.length).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF99" }, // Light yellow background
      };
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create blob and trigger download
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "newFile.xlsx");
  };

  return {
    onChangeGlHeader,
    onChangeCoaHeader,
    onGeneralLedgerDrop,
    onPressAnalyzeData,
    onChartOfAccountsDrop,
    onPressDownloadData,
    onPressResetBtn,
    onChangeCoaFilter,
    coaFilterOptions,
    selectedFilters,
    currentStep,
    tableHeader,
    tableData,
    rawData,
    glHeaderOptions,
    selectedHeaders,
    coaHeaderOptions,
    reviewData,
  };
}
