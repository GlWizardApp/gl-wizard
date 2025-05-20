/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Workbook } from "exceljs";
import { formatDate } from "date-fns";
import { TableHeader } from "../../composed/basic-table/basic-table";

export interface RawData {
  glData: Record<string, any>[];
  glHeaders: string[];
  coaData: Record<string, any>[];
  coaHeaders: string[];
}

export interface GlHeaders {
  account: string;
  jen: string;
  date: string;
  value: string;
}

export interface CoaHeaders {
  mappingValue: string;
  displayValue: string;
  groupingValue: string;
}

export interface SelectedHeaders {
  glHeaders: GlHeaders;
  coaHeaders: CoaHeaders;
}

export interface ReviewData {
  startDate: string;
  endDate: string;
  rows: number;
  total: number;
}

export enum AnalysisStep {
  TO_UPLOAD_GL,
  TO_UPLOAD_COA,
  TO_ANALYZE,
  ANALYZED,
}

export function useGeneralAnalysis() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentStep, setCurrentStep] = useState<AnalysisStep[]>([
    AnalysisStep.TO_UPLOAD_GL,
  ]);
  const [rawData, setRawData] = useState<RawData>({
    glData: [],
    glHeaders: [],
    coaData: [],
    coaHeaders: [],
  });

  const [dataDisplayHeader, setDataDisplayHeader] = useState<
    Record<string, any>[]
  >([]);

  const [overviewTableData, setOverviewTableData] = useState<
    Record<string, any>
  >({});

  const [tableData, setTableData] = useState<Record<string, any>[]>([]);
  const [selectedHeaders, setSelectedHeaders] = useState<SelectedHeaders>({
    glHeaders: {
      account: "",
      jen: "",
      date: "",
      value: "",
    },
    coaHeaders: {
      displayValue: "",
      mappingValue: "",
      groupingValue: "",
    },
  });

  const [loadingStatus, setLoadingStatus] = useState(false);

  const reviewData: ReviewData = useMemo(() => {
    return {
      rows: rawData.glData.length,
      total: selectedHeaders.glHeaders.value
        ? rawData.glData.reduce(
            (prev, curr) =>
              (prev += Number(curr[selectedHeaders.glHeaders.value])),
            0
          )
        : 0,
      startDate: selectedHeaders.glHeaders.date
        ? formatDate(
            new Date(
              Math.min(
                ...rawData.glData.map((item) =>
                  new Date(item[selectedHeaders.glHeaders.date]).getTime()
                )
              )
            ),
            "dd-MM-yyyy"
          )
        : "",
      endDate: selectedHeaders.glHeaders.date
        ? formatDate(
            new Date(
              Math.max(
                ...rawData.glData.map((item) =>
                  new Date(item[selectedHeaders.glHeaders.date]).getTime()
                )
              )
            ),
            "dd-MM-yyyy"
          )
        : "",
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

  const tableHeader: TableHeader[] = useMemo(
    () => [
      ...Object.keys(selectedHeaders.glHeaders).map((item) => ({
        key: item,
        title: selectedHeaders.glHeaders[item as keyof GlHeaders],
      })),
      {
        key: "result",
        title: "result",
      },
    ],
    [selectedHeaders.glHeaders]
  );

  const onGeneralLedgerDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const validMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validMimeTypes.includes(file.type) && !file.name.endsWith(".xlsx")) {
      setError("Invalid file type. Please upload an Excel file.");

      setTimeout(() => {
        setError(undefined);
      }, 4000);
      return;
    }

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
        displayValue: columnNames.filter(Boolean)[0],
        mappingValue: columnNames.filter(Boolean)[0],
        groupingValue: columnNames.filter(Boolean)[0],
      },
    }));
    setCurrentStep((prev) => [...prev, AnalysisStep.TO_ANALYZE]);
  };

  const onChangeGlHeader = (key: keyof GlHeaders, value: string) => {
    setSelectedHeaders((prev) => ({
      ...prev,
      glHeaders: { ...prev.glHeaders, [key]: value },
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
        displayValue: "",
        mappingValue: "",
        groupingValue: "",
      },
      glHeaders: {
        account: "",
        date: "",
        jen: "",
        value: "",
      },
    });
  };

  const onPressAnalyzeData = () => {
    setLoadingStatus(true);
    const worker = new Worker(
      new URL("../../../workers/general-worker.js", import.meta.url),
      {
        type: "module",
      }
    );

    worker.onmessage = (event) => {
      generateOverviewData(
        Object.values(event.data.groupedByJenAndDate).flat()
      );

      setTableData(
        Object.values(
          event.data.groupedByJenAndDate as Record<string, any>[]
        ).flat()
      );
      setOverviewTableData(event.data.condensedDataByResult);
      setCurrentStep((prev) => [...prev, AnalysisStep.ANALYZED]);
      setLoadingStatus(false);
      worker.terminate();
    };

    worker.onerror = (error) => {
      console.error("Worker error:", error);
      setLoadingStatus(false);
      worker.terminate();
    };

    worker.postMessage({ rawData, selectedHeaders });
  };

  const generateOverviewData = (data: any[]) => {
    const existingCoaKeys = [
      ...new Set(
        data.map(
          (item) => item.coaData?.[selectedHeaders.coaHeaders.mappingValue]
        )
      ),
    ];

    const filteredCoaData = rawData.coaData
      .filter((item) =>
        existingCoaKeys.includes(item[selectedHeaders.coaHeaders.mappingValue])
      )
      .map((item) => ({ ...item, active: true }));
    setDataDisplayHeader(filteredCoaData);
  };

  const sortedDataDisplayHeader = useMemo(() => {
    const active = dataDisplayHeader
      .filter((item) => item.active)
      .sort(
        (a, b) =>
          a[selectedHeaders.coaHeaders.mappingValue] -
          b[selectedHeaders.coaHeaders.mappingValue]
      );

    const inactive = dataDisplayHeader
      .filter((item) => !item.active)
      .sort(
        (a, b) =>
          a[selectedHeaders.coaHeaders.mappingValue] -
          b[selectedHeaders.coaHeaders.mappingValue]
      );
    return [
      ...active,
      { [selectedHeaders.coaHeaders.mappingValue]: "total" },
      ...inactive,
    ];
  }, [dataDisplayHeader, selectedHeaders.coaHeaders.mappingValue]);

  return {
    onChangeGlHeader,
    onChangeCoaHeader,
    onGeneralLedgerDrop,
    onPressAnalyzeData,
    onChartOfAccountsDrop,
    onPressResetBtn,
    setDataDisplayHeader,
    loadingStatus,
    error,
    overviewTableData,
    sortedDataDisplayHeader,
    currentStep,
    tableHeader,
    tableData,
    rawData,
    glHeaderOptions,
    selectedHeaders,
    coaHeaderOptions,
    reviewData,
    dataDisplayHeader,
  };
}
