"use client"

import { useCurrentRole } from '@/hooks/use-current-role';
import { UserRole } from '@prisma/client';
import React from 'react'
import { FormError } from '../FormError';

interface RoleGetProps {
    children: React.ReactNode;
    allowedRole: UserRole
}

const RoleGet = ({children, allowedRole}: RoleGetProps) => {

    const role = useCurrentRole()
    if (role !== allowedRole) {
        return (
          <FormError message='You do not have permisson to view this content!' />
        ) 
    }

    return(
        <>
        {children}
        </>
    );
};

export default RoleGet