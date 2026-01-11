import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import UserListContainer from './components/users/UserListContainer';
import PageHeader from './components/users/PageHeader';

// Create a light theme for the user list page (matching aurora design)
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

const AdminUsersList = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack direction="column" height={1}>
        <PageHeader
          title="User list"
          actionComponent={
            <Button variant="outlined" color="inherit">
              Export
            </Button>
          }
        />
        <Paper sx={{ flex: 1, p: { xs: 3, md: 5 } }}>
          <UserListContainer />
        </Paper>
      </Stack>
    </ThemeProvider>
  );
};

export default AdminUsersList;
