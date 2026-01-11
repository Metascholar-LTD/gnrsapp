import { JSX, PropsWithChildren } from 'react';
import { Paper, Stack, SxProps, Typography, useMediaQuery, useTheme } from '@mui/material';

interface PageHeaderProps {
  title: string;
  actionComponent?: JSX.Element;
  sx?: SxProps;
}

const PageHeader = ({
  title,
  actionComponent,
  sx,
}: PropsWithChildren<PageHeaderProps>) => {
  const theme = useTheme();
  const downLg = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Paper sx={{ px: { xs: 3, md: 5 }, py: 3 }}>
      <Stack
        sx={{
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { sm: 'flex-end' },
          justifyContent: 'space-between',
          ...sx,
        }}
      >
        <div>
          <Typography variant="h4" sx={[downLg && { fontSize: 'h5.fontSize' }]}>
            {title}
          </Typography>
        </div>

        {actionComponent}
      </Stack>
    </Paper>
  );
};

export default PageHeader;
