import React from 'react';
import { Outlet } from 'react-router-dom';
import { PageLayout } from './PageLayout';

export const RootLayout: React.FC = () => {
    return (
        <PageLayout>
            <Outlet />
        </PageLayout>
    );
};
