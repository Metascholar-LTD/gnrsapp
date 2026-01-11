import { MouseEvent, RefObject, useCallback } from 'react';
import { Box, Button, Stack } from '@mui/material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { users } from '../../data/users';
import { useMediaQuery, useTheme } from '@mui/material';
import IconifyIcon from './IconifyIcon';
import FilterMenu from './FilterMenu';

interface FilterSectionProps {
  apiRef: RefObject<GridApiCommunity | null>;
  handleToggleFilterPanel: (e: MouseEvent<HTMLButtonElement>) => void;
}

const statuses = Array.from(new Set(users.map((user) => user.status)));
const roles = Array.from(new Set(users.map((user) => user.role)));
const departments = Array.from(new Set(users.map((user) => user.department)));

const FilterSection = ({ apiRef, handleToggleFilterPanel }: FilterSectionProps) => {
  const theme = useTheme();
  const upSm = useMediaQuery(theme.breakpoints.up('sm'));

  const handleFilter = useCallback(
    (
      field?: 'department' | 'status' | 'role',
      value?: string | number,
      defaultOperator: string = 'contains',
    ) => {
      if (!field) {
        apiRef.current?.setFilterModel({ items: [] });
      } else {
        const operator = field === 'status' ? 'equals' : defaultOperator;
        apiRef.current?.setFilterModel({
          items: [{ field, operator, value: value?.toString() }],
        });
      }
    },
    [apiRef],
  );

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        gap: 1,
        overflowX: { xs: 'auto', md: 'initial' },
        scrollbarWidth: 'thin',
        flexWrap: 'nowrap',
      }}
    >
      <FilterMenu
        label="Department"
        field="department"
        handleFilter={handleFilter}
        menuItems={departments}
      />
      <FilterMenu
        label="Status"
        field="status"
        handleFilter={handleFilter}
        menuItems={statuses}
      />
      <FilterMenu label="Role" field="role" handleFilter={handleFilter} menuItems={roles} />
      <Button
        variant="text"
        sx={{ flexShrink: 0, ml: 1 }}
        color="inherit"
        onClick={handleToggleFilterPanel}
      >
        {upSm && (
          <IconifyIcon icon="material-symbols:swap-vert-rounded" fontSize={'20px !important'} />
        )}
        {!upSm && (
          <IconifyIcon icon="material-symbols:filter-alt-outline" fontSize={'20px !important'} />
        )}
        {upSm && <Box component="span" sx={{ ml: 0.5 }}>More filters</Box>}
      </Button>
    </Stack>
  );
};

export default FilterSection;
