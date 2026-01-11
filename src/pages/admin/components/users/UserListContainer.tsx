import { ChangeEvent, MouseEvent, useCallback, useState, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useGridApiRef, GridPaginationModel } from '@mui/x-data-grid';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import IconifyIcon from './IconifyIcon';
import UsersTable from './UsersTable';
import FilterSection from './FilterSection';
import { users } from '../../data/users';

const UserListContainer = () => {
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const apiRef = useGridApiRef();

  // Pagination calculations
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Pagination model for DataGrid
  const paginationModel: GridPaginationModel = useMemo(
    () => ({
      page: currentPage - 1, // DataGrid uses 0-based indexing
      pageSize: itemsPerPage,
    }),
    [currentPage, itemsPerPage],
  );

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
        <UsersTable
          apiRef={apiRef}
          filterButtonEl={filterButtonEl}
          paginationModel={paginationModel}
        />
      </Box>

      {users.length > 0 && (
        <Box
          sx={{
            marginTop: 2,
            padding: '1rem 1.5rem',
            background: 'white',
            borderRadius: '1rem',
            border: '1px solid #e5e7eb',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' },
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '0.875rem',
              color: '#6b7280',
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            <span>
              Showing <strong>{startIndex + 1}</strong> to{' '}
              <strong>{Math.min(endIndex, users.length)}</strong> of{' '}
              <strong>{users.length}</strong> users
            </span>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 0.5,
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.25rem',
                height: '2.25rem',
                border: '1.5px solid #e5e7eb',
                borderRadius: '0.5rem',
                background: currentPage === 1 ? '#f9fafb' : 'white',
                color: currentPage === 1 ? '#9ca3af' : '#111827',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: currentPage === 1 ? 0.4 : 1,
              }}
            >
              <ChevronsLeft size={18} />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.25rem',
                height: '2.25rem',
                border: '1.5px solid #e5e7eb',
                borderRadius: '0.5rem',
                background: currentPage === 1 ? '#f9fafb' : 'white',
                color: currentPage === 1 ? '#9ca3af' : '#111827',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: currentPage === 1 ? 0.4 : 1,
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
              {getPageNumbers().map((page, index) =>
                page === '...' ? (
                  <span
                    key={`ellipsis-${index}`}
                    style={{
                      padding: '0 0.25rem',
                      color: '#9ca3af',
                      fontSize: '0.875rem',
                      userSelect: 'none',
                    }}
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    style={{
                      minWidth: '2.25rem',
                      height: '2.25rem',
                      padding: '0 0.5rem',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      background: currentPage === page ? '#111827' : 'white',
                      color: currentPage === page ? 'white' : '#111827',
                      fontSize: '0.875rem',
                      fontWeight: currentPage === page ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {page}
                  </button>
                ),
              )}
            </Box>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.25rem',
                height: '2.25rem',
                border: '1.5px solid #e5e7eb',
                borderRadius: '0.5rem',
                background: currentPage === totalPages ? '#f9fafb' : 'white',
                color: currentPage === totalPages ? '#9ca3af' : '#111827',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: currentPage === totalPages ? 0.4 : 1,
              }}
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.25rem',
                height: '2.25rem',
                border: '1.5px solid #e5e7eb',
                borderRadius: '0.5rem',
                background: currentPage === totalPages ? '#f9fafb' : 'white',
                color: currentPage === totalPages ? '#9ca3af' : '#111827',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: currentPage === totalPages ? 0.4 : 1,
              }}
            >
              <ChevronsRight size={18} />
            </button>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              whiteSpace: 'nowrap',
              justifyContent: { xs: 'center', md: 'flex-end' },
            }}
          >
            <label
              htmlFor="items-per-page"
              style={{
                fontSize: '0.875rem',
                color: '#6b7280',
              }}
            >
              Show:
            </label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                padding: '0.4rem 0.6rem',
                paddingRight: '1.75rem',
                border: '1.5px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                color: '#111827',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                appearance: 'none',
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.4rem center',
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
            </select>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UserListContainer;
