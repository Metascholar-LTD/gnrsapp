import { Icon } from '@iconify/react';
import { Box, SxProps, Theme } from '@mui/material';

interface IconifyIconProps {
  icon: string;
  sx?: SxProps<Theme>;
  fontSize?: string | number;
  color?: string;
}

export const IconifyIcon = ({ icon, sx, fontSize, color, ...rest }: IconifyIconProps) => {
  return (
    <Box
      component={Icon}
      icon={icon}
      sx={[
        { verticalAlign: 'baseline', fontSize: fontSize || 'inherit', color: color || 'inherit' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    />
  );
};

export default IconifyIcon;
