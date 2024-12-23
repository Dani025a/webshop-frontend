'use client'
import React from 'react';
import { LoginForm } from "@//components/login/form/form";
import { PublicRoute } from '@/components/publicRoutes';

function Login() {
  return (
    <div className="login-page">
      <LoginForm />
    </div>
  );
}

export default PublicRoute(Login)