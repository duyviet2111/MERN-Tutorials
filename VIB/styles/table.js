import { TableRow, TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&": {
    padding: "0px 16px",
    textAlign: "center",
  },
}));
export const StyledTableCell2 = styled(TableCell)(({ theme }) => ({
  "&": {
    padding: "0px 16px",
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&": {
    height: 30,
  },
}));
