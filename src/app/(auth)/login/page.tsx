"use client";
import { Loading } from "@/app/components/loading";
import { firebaseErrorTranslator, signinValidator } from "@/lib/validators";
import { Button, TextField } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession() as any;
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>(null);
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <Loading />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const isValid = signinValidator(state, setErrors);
    if (!isValid) {
      return;
    }
    setLoading(true);
    try {
      const session = await signIn("credentials", {
        email: state.email,
        password: state.password,
        redirect: false,
        callbackUrl: "/",
      });

      if (session?.ok) {
        router.push("/");
        return;
      }
      if (session?.error) {
        const { field, message } = firebaseErrorTranslator(session.error);
        setErrors(
          () =>
            ({
              [field]: message,
            } as any)
        );
      }
    } catch (error: any) {
      const { field, message } = firebaseErrorTranslator(error.code);
      setErrors(
        () =>
          ({
            [field]: message,
          } as any)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center items-center p-4">
      <div className="mt-4">
        <img
          className="h-24"
          src="https://govcsucp.netlify.app/static/media/logo.f46d1ad7.png"
        />
      </div>
      <div className="my-4">
        <p className="text-2xl text-center font-semibold">
          Governo Provincial do Cunene
        </p>
        <p className="text-xl text-center">Sistema de Gestão de Fornecedores</p>
      </div>
      <div className="w-full">
        <div className="my-4">
          <TextField
            value={state.email}
            name="email"
            onChange={handleChange}
            type="email"
            label="Email"
            fullWidth
            helperText={errors?.email}
            error={errors?.email ? true : false}
          />
        </div>
        <div className="my-4">
          <TextField
            value={state.password}
            name="password"
            onChange={handleChange}
            type="password"
            label="Senha"
            fullWidth
            helperText={errors?.password}
            error={errors?.password ? true : false}
          />
        </div>
        <div className="my-8">
          <Button
            onClick={handleSubmit}
            size="large"
            fullWidth
            variant="contained"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                Entrando...
              </div>
            ) : (
              "Entrar"
            )}
          </Button>
        </div>

        <p className="text-xs text-center my-8 ">
          Copyright © Governo Provincial do Cunene 2025.
        </p>
      </div>
    </div>
  );
};

export default Page;
