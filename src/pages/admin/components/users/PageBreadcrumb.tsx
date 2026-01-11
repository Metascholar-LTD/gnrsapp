import { Breadcrumbs, Link, SxProps, Typography } from '@mui/material';

export interface PageBreadcrumbItem {
  label: string;
  url?: string;
  active?: boolean;
}

interface PageBreadcrumbProps {
  items: PageBreadcrumbItem[];
  sx?: SxProps;
}

const PageBreadcrumb = ({ items, sx }: PageBreadcrumbProps) => {
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ ...sx }}>
      {items.map(({ label, url, active }, index) => (
        <Typography
          key={`${label}-${index}`}
          variant="body2"
          aria-current={active ? 'page' : undefined}
          component={active ? 'span' : Link}
          href={!active ? url : undefined}
          sx={{
            color: active ? 'text.primary' : 'primary.main',
            fontWeight: 'medium',
          }}
        >
          {label}
        </Typography>
      ))}
    </Breadcrumbs>
  );
};

export default PageBreadcrumb;
