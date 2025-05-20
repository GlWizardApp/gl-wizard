import {
  Stack,
  Table,
  TableContainer,
  Paper,
  TableRow,
  TableCell,
  Tooltip,
  Typography,
  Checkbox,
  Button,
  TableBody,
} from "@mui/material";
import { useMemo, useRef } from "react";

import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelRounded from "@mui/icons-material/CancelRounded";
import {
  AnyType,
  exportTableToExcel,
  getCellSingleValue,
  getCellTotalValue,
  getCellUniqueValues,
  getElipsis,
  getValue,
} from "./functions";

import { styles } from "./table-style";

interface Props {
  title: string;
  sortedDataDisplayHeader: Record<string, AnyType>[];
  mappingValue: string;
  overviewTableData: Record<string, AnyType>;
  valueKey: string;
  selectedRow?: string;
  setSelectedRow?: React.Dispatch<React.SetStateAction<string>>;
  selectedFilter: Filters;
  setDataDisplayHeader: React.Dispatch<
    React.SetStateAction<Record<string, AnyType>[]>
  >;
}

interface Filters {
  header: string;
  value: string;
}

export const DataTable = (props: Props) => {
  const {
    title,
    sortedDataDisplayHeader,
    mappingValue,
    selectedRow,
    overviewTableData,
    valueKey,
    setSelectedRow,
    setDataDisplayHeader,
  } = props;

  const tableRef = useRef(null);

  const visibleColumns = useMemo(
    () =>
      sortedDataDisplayHeader
        .map((item) => item[mappingValue])
        .indexOf("total"),
    [sortedDataDisplayHeader, mappingValue]
  );

  const onClickRow = (value: string) => {
    if (selectedRow === value) {
      setSelectedRow?.("");
      return;
    }
    setSelectedRow?.(value);
  };

  return (
    <Stack style={styles.tableScrollableWrapper}>
      <Stack style={styles.tableHeader}>
        <Typography style={styles.tableTitle}>{title}</Typography>
        <Button
          onClick={() => exportTableToExcel(tableRef, sortedDataDisplayHeader)}
          variant="contained"
          style={{
            ...styles.button,
            backgroundColor: "#1D6F42",
          }}
          endIcon={<DownloadIcon />}
        >
          Download
        </Button>
      </Stack>
      <TableContainer style={styles.tableContainer} component={Paper}>
        <Table ref={tableRef} style={styles.table}>
          <TableBody>
            {Object.keys(sortedDataDisplayHeader[0])
              .filter((item) => item !== "active")
              .map((key: AnyType) => (
                <TableRow style={styles.tableRow}>
                  {/* Header cells side header (CoA headers) */}
                  <TableCell style={styles.headerSideCell}>
                    {String(key)}
                  </TableCell>
                  {sortedDataDisplayHeader?.map(
                    (item: Record<string, AnyType>, index: number) => (
                      // Header cell value cells (CoA Values)
                      <TableCell
                        key={Math.random()}
                        style={{
                          ...styles.headerTableCell,
                          opacity: index > visibleColumns ? 0.5 : 1,
                          ...(item[mappingValue] === "total"
                            ? styles.totalCell
                            : {}),
                        }}
                      >
                        <Tooltip title={String(item[String(key)])}>
                          <Typography
                            style={{
                              ...styles.headerTableCellText,
                              ...(key === mappingValue
                                ? {
                                    fontSize: 16,
                                    fontWeight: "bold",
                                  }
                                : {}),
                            }}
                          >
                            {item[mappingValue] !== "total"
                              ? getElipsis(String(item[String(key)]))
                              : ""}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))}
            <TableRow style={styles.tableRow}>
              {/* Data cells side header cell */}
              <TableCell style={styles.headerSideCell}>Include</TableCell>
              {sortedDataDisplayHeader.map(
                (item: Record<string, AnyType>, index: number) => (
                  // Checkbox cell
                  <TableCell
                    style={{
                      ...styles.headerCheckboxCell,
                      opacity: index > visibleColumns ? 0.5 : 1,
                      ...(item[mappingValue] === "total"
                        ? styles.totalCell
                        : {}),
                    }}
                  >
                    {item[mappingValue] !== "total" ? (
                      <Checkbox
                        checkedIcon={
                          <CheckCircleIcon style={{ color: "green" }} />
                        }
                        icon={<CancelRounded style={{ color: "red" }} />}
                        value={item.active}
                        checked={Boolean(item.active)}
                        onChange={(_, checked) =>
                          setDataDisplayHeader((prev) =>
                            prev.map((header) => ({
                              ...header,
                              active:
                                header[mappingValue] === item[mappingValue]
                                  ? checked
                                  : header.active,
                            }))
                          )
                        }
                      />
                    ) : (
                      "Total"
                    )}
                  </TableCell>
                )
              )}
            </TableRow>

            {Object.keys(overviewTableData).map((item: string) => {
              return (
                <TableRow style={styles.tableRowOverview}>
                  <TableCell
                    onClick={() => onClickRow(getCellUniqueValues(item))}
                    style={{
                      ...styles.headerSideCell,
                      ...(selectedRow === getCellUniqueValues(item)
                        ? styles.selectedRow
                        : {}),
                    }}
                  >
                    <Tooltip title={getCellUniqueValues(item)}>
                      <Typography style={{ fontSize: 12, fontWeight: "bold" }}>
                        {getElipsis(getCellUniqueValues(item), 20)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  {sortedDataDisplayHeader.map(
                    (header: Record<string, AnyType>, index: number) => (
                      <TableCell
                        key={Math.random()}
                        style={{
                          ...styles.tableCell,
                          ...(header[mappingValue] === "total"
                            ? styles.totalCell
                            : {}),
                          opacity: index > visibleColumns ? 0.5 : 1,
                          justifyContent: "flex-end",
                        }}
                      >
                        {header[mappingValue] === "total"
                          ? getCellTotalValue(
                              overviewTableData[item] as Record<
                                string,
                                AnyType
                              >[],
                              sortedDataDisplayHeader,
                              mappingValue,
                              valueKey
                            )
                          : getCellSingleValue(
                              overviewTableData[item] as Record<
                                string,
                                AnyType
                              >[],
                              header,
                              mappingValue,
                              valueKey
                            )}
                      </TableCell>
                    )
                  )}
                </TableRow>
              );
            })}
            <TableRow style={styles.tableRowOverview}>
              <TableCell style={styles.totalCell}>Total</TableCell>
              {sortedDataDisplayHeader.map((header, index) => (
                <TableCell
                  style={{
                    ...styles.tableCell,
                    justifyContent: "flex-end",
                    opacity: index > visibleColumns ? 0.5 : 1,
                    ...styles.totalCell,
                  }}
                >
                  {getValue(
                    Object.values(overviewTableData)
                      .flat()
                      .filter(
                        (item) =>
                          item["coaData" as keyof typeof item]?.[
                            mappingValue
                          ] === header[mappingValue as keyof typeof header]
                      )
                      .reduce(
                        (prev: number, acc) =>
                          (prev += Number(acc[valueKey as keyof typeof acc])),
                        0
                      )
                      .toFixed(2)
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
