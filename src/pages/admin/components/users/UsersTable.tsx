import { RefObject, useMemo } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip, { ChipOwnProps } from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { users } from '../../data/users';
import dayjs from 'dayjs';
import { User } from '../../types/users';
import DashboardMenu from './DashboardMenu';

interface UsersTableProps {
  apiRef: RefObject<GridApiCommunity | null>;
  filterButtonEl: HTMLButtonElement | null;
  paginationModel: { page: number; pageSize: number };
}

const getStatusChipColor = (value: User['status']): ChipOwnProps['color'] => {
  switch (value) {
    case 'online':
      return 'success';
    case 'offline':
      return 'error';
    case 'away':
      return 'warning';
    default:
      return 'default';
  }
};

const UsersTable = ({ apiRef, filterButtonEl, paginationModel }: UsersTableProps) => {
  const columns: GridColDef<User>[] = useMemo(
    () => [
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: 64,
        headerClassName: 'user-table-header',
      },
      {
        field: 'avatar',
        headerName: 'Avatar',
        width: 64,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
        headerClassName: 'user-table-header',
        renderCell: (params: GridRenderCellParams<User>) => (
          <Tooltip title={params.row.name}>
            <Avatar
              src={params.row.avatar}
              alt={params.row.name}
              sx={{
                width: 32,
                height: 32,
              }}
            />
          </Tooltip>
        ),
      },
      {
        field: 'name',
        headerName: 'Name',
        minWidth: 160,
        flex: 1,
        headerClassName: 'user-table-header',
      },
      {
        field: 'email',
        headerName: 'Email',
        minWidth: 230,
        flex: 1,
        headerClassName: 'user-table-header',
        valueGetter: ({ email }) => email,
        renderCell: (params: GridRenderCellParams<User>) => (
          <Link href={`mailto:${params.row.email}`} variant="body2">
            {params.row.email}
          </Link>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 100,
        align: 'center',
        headerAlign: 'center',
        headerClassName: 'user-table-header',
        renderCell: (params: GridRenderCellParams<User>) => (
          <Chip
            label={params.row.status}
            color={getStatusChipColor(params.row.status)}
            sx={{
              textTransform: 'capitalize',
            }}
          />
        ),
      },
      {
        field: 'role',
        headerName: 'Role',
        width: 130,
        headerClassName: 'user-table-header',
        renderCell: (params: GridRenderCellParams<User>) => <Chip label={params.row.role} />,
      },
      {
        field: 'department',
        headerName: 'Department',
        width: 150,
        headerClassName: 'user-table-header',
      },
      {
        field: 'phone',
        headerName: 'Phone',
        width: 160,
        sortable: false,
        filterable: false,
        headerClassName: 'user-table-header',
      },
      {
        field: 'location',
        headerName: 'Location',
        width: 160,
        sortable: false,
        headerClassName: 'user-table-header',
      },
      {
        field: 'createdAt',
        headerName: 'Created At',
        width: 200,
        headerClassName: 'user-table-header',
        renderCell: (params: GridRenderCellParams<User>) => (
          <Typography>{dayjs(params.row.createdAt).format('DD MMMM, YYYY')}</Typography>
        ),
      },
      {
        field: 'action',
        headerName: '',
        filterable: false,
        sortable: false,
        width: 60,
        align: 'right',
        headerAlign: 'right',
        headerClassName: 'user-table-header',
        renderCell: () => (
          <DashboardMenu
            menuItems={[
              {
                label: 'Edit',
              },
              {
                label: 'Delete',
                sx: { color: 'error.main' },
              },
            ]}
          />
        ),
      },
    ],
    [],
  );

  return (
    <Box sx={{ width: 1 }}>
      <DataGrid
        rowHeight={64}
        rows={users}
        apiRef={apiRef}
        columns={columns}
        paginationModel={paginationModel}
        pageSizeOptions={[]}
        hideFooter
        checkboxSelection
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            fontWeight: 700,
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 700,
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-cell:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-row:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-row:focus-within': {
            outline: 'none',
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none',
          },
        }}
        slotProps={{
          panel: {
            target: filterButtonEl,
          },
        }}
      />
    </Box>
  );
};

export default UsersTable;
