import {
  Stack,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

export interface DropdownItem {
  title: string;
  value: string;
}

export interface Props {
  items: DropdownItem[];
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<unknown>) => void;
}

export function Dropdown(props: Props) {
  const { items, label, value, onChange } = props;

  return (
    <Stack>
      <InputLabel style={{ textAlign: "left", fontSize: 14 }}>
        {label}
      </InputLabel>
      <Select
        style={{ height: 38, borderRadius: 8 }}
        sx={{
          "& .MuiSelect-select": {
            textAlign: "left",
          },
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200,
              maxWidth: 200,
            },
          },
        }}
        value={value}
        onChange={onChange}
      >
        {items.map(({ title, value }, index) => (
          <MenuItem
            key={`dropdown-item-${index}-${title}`}
            value={value}
            style={{ textAlign: "left", fontSize: 14 }}
          >
            {title}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
}
