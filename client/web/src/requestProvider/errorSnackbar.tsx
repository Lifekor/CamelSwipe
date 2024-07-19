import MuiAlert, { AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import React from 'react'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface ErrorSnackbarProps {
    error: string;
    onClose: () => void;
}

const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({ error, onClose }) => {

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        onClose();
    };
    

    return (
      <Snackbar
      open={error !== ''}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          border: '2px solid #E3AC52',
          borderRadius: '0 20px 20px 0',
          marginTop: '10px',
          width: '100%'
        },
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Alert
        onClose={handleClose}
        severity="error"
        sx={{
          backgroundColor: 'black',
          color: 'white',
          border: '2px solid red',
          '& .MuiAlert-icon': {
            color: 'white',
          },
        }}
      >
        {error}
      </Alert>
    </Snackbar>
    );
};

export default ErrorSnackbar;
