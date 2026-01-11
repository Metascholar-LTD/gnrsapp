import { MouseEvent, useState } from 'react';
import { useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconifyIcon from '../base/IconifyIcon';

const NotificationActionMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { direction } = useTheme();
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button 
        color="inherit" 
        variant="text" 
        onClick={handleClick} 
        sx={{ 
          minWidth: 'auto', 
          p: 0.5,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <IconifyIcon icon="material-symbols:more-horiz" />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'notification-action',
          },
        }}
        transformOrigin={{ horizontal: direction === 'rtl' ? 'left' : 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: direction === 'rtl' ? 'left' : 'right', vertical: 'bottom' }}
        sx={{
          '& .MuiPaper-root': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        <MenuItem 
          onClick={handleClose} 
          sx={{ 
            color: 'error.main',
            '&:hover': {
              bgcolor: 'error.lighter',
            },
          }}
        >
          Remove Notification
        </MenuItem>
        <MenuItem 
          onClick={handleClose}
          sx={{
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          Report issue
        </MenuItem>
      </Menu>
    </div>
  );
};

export default NotificationActionMenu;
