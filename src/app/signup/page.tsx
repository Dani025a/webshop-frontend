'use client'
import React from 'react';
import { SignUpForm } from '../../components/signup/form/form'
import { PublicRoute } from '@/components/publicRoutes';

function Signup() {
  return (
    <div>
      <SignUpForm />
    </div>
  );
}

export default PublicRoute(Signup)