import { ChangeEvent, MouseEvent, useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useGridApiRef } from '@mui/x-data-grid';
import IconifyIcon from './IconifyIcon';
import UsersTable from './UsersTable';
import FilterSection from './FilterSection';

const UserListContainer = () => {
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);
  const apiRef = useGridApiRef();

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      apiRef.current?.setQuickFilterValues([e.target.value]);
    },
    [apiRef],
  );

  const handleToggleFilterPanel = (e: MouseEvent<HTMLButtonElement>) => {
    const clickedEl = e.currentTarget;

    if (filterButtonEl && filterButtonEl === clickedEl) {
      setFilterButtonEl(null);
      apiRef.current?.hideFilterPanel();

      return;
    }

    setFilterButtonEl(clickedEl);
    apiRef.current?.showFilterPanel();
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          alignItems: 'center',
          gap: 1,
        }}
      >
        <TextField
          id="search-box"
          type="search"
          size="medium"
          placeholder="Search user"
          sx={{
            flexGrow: 1,
            maxWidth: { sm: 250 },
            minWidth: { sm: 200 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon
                  icon="material-symbols:search-rounded"
                  sx={{
                    fontSize: 20,
                    color: 'text.secondary',
                  }}
                />
              </InputAdornment>
            ),
          }}
          onChange={handleSearch}
        />

        <Box sx={{ flexShrink: 0 }}>
          <FilterSection apiRef={apiRef} handleToggleFilterPanel={handleToggleFilterPanel} />
        </Box>
      </Stack>

      <Box>
        <UsersTable apiRef={apiRef} filterButtonEl={filterButtonEl} />
      </Box>
    </Box>
  );
};

export default UserListContainer;
