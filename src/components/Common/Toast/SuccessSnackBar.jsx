import React from "react";
import { SnackbarContent } from "notistack";
import CheckIcon from "@mui/icons-material/Check";
// import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// import IconButton from "@mui/material/IconButton";
import "./Toast.css";

const SuccessSnackbar = React.forwardRef(({ message }, ref) => {
  // const { closeSnackbar } = useSnackbar();

  return (
    <SnackbarContent ref={ref} className="toast-success_container">
      <Box display="flex" alignItems="center" gap={2}>
        <Box className="toast-success_check">
          <CheckIcon fontSize="small" style={{ color: "#fff" }} />
        </Box>
        <Box flex="1">
          <Typography
            fontWeight="500"
            variant="body1"
            sx={{ color: "#333333" }}
          >
            {message?.title}
          </Typography>
          {message?.text && (
            <Typography
              fontWeight="400"
              variant="body2"
              sx={{ color: "#767676", marginTop: "3px" }}
            >
              {message?.text}
            </Typography>
          )}
        </Box>
        {/* <IconButton
          size="small"
          onClick={() => closeSnackbar(id)}
          sx={{ color: "#929292" }}
        >
          <CloseIcon fontSize="medium" />
        </IconButton> */}
      </Box>
    </SnackbarContent>
  );
});

export default SuccessSnackbar;
