'use client';

import React from 'react';
import { Layout } from 'react-admin';

export const CRMLayout: React.FC<any> = (props: any) => (
  <Layout
    {...props}
    sx={{
      '& .RaLayout-appFrame': {
        marginTop: 0,
      },
      '& .RaLayout-contentWithSidebar': {
        marginTop: 0,
        backgroundColor: '#f8fafc',
      },
      '& .RaMenuItemLink-active': {
        backgroundColor: '#ede9fe !important',
        color: '#6366f1 !important',
        borderRadius: '8px',
        margin: '4px 8px',
      },
      '& .MuiListItemButton-root': {
        borderRadius: '8px',
        margin: '2px 8px',
        '&:hover': {
          backgroundColor: '#f3f4f6',
        },
      },
      '& .MuiAppBar-root': {
        backgroundColor: '#ffffff !important',
        color: '#1f2937 !important',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1) !important',
      },
      '& .MuiDrawer-paper': {
        backgroundColor: '#ffffff !important',
        borderRight: '1px solid #e5e7eb !important',
      },
    }}
  />
}
