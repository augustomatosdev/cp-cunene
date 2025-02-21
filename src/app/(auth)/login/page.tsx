"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/loading";
import { firebaseErrorTranslator, signinValidator } from "@/lib/validators";
import { Mail, Lock } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string } | null>(null);
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
    if (!isValid) return;

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
        setErrors(() => ({ [field]: message }));
      }
    } catch (error: any) {
      const { field, message } = firebaseErrorTranslator(error.code);
      setErrors(() => ({ [field]: message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-950 flex items-center justify-center p-4">
      <Container maxWidth="sm">
        <Paper elevation={4} className="p-8 rounded-lg">
          <div className="flex flex-col items-center mb-8">
            <img
              src="https://govcsucp.netlify.app/static/media/logo.f46d1ad7.png"
              alt="Logo"
              className="h-32 mb-6"
            />
            <div className="text-center">
              <Typography variant="h5" className="font-bold text-red-900 mb-2">
                Governo Provincial do Cunene
              </Typography>
              <Typography variant="subtitle1" className="text-gray-600">
                Sistema de Gestão de Fornecedores
              </Typography>
            </div>
          </div>

          <Box className="space-y-6">
            <div className="relative">
              <TextField
                value={state.email}
                name="email"
                onChange={handleChange}
                type="email"
                label="Email"
                fullWidth
                error={!!errors?.email}
                helperText={errors?.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton>
                        <Mail className="text-gray-500" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="relative">
              <TextField
                value={state.password}
                name="password"
                onChange={handleChange}
                type="password"
                label="Senha"
                fullWidth
                error={!!errors?.password}
                helperText={errors?.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton>
                        <Lock className="text-gray-500" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <Button
              onClick={handleSubmit}
              size="large"
              fullWidth
              variant="contained"
              disabled={loading}
              className="bg-red-900 hover:bg-red-800 mt-6 py-3 text-lg"
              sx={{
                backgroundColor: "#800706",
                "&:hover": {
                  backgroundColor: "#6a0605",
                },
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                  <span>Entrando...</span>
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </Box>

          <Typography
            variant="caption"
            className="text-gray-500 text-center block mt-8"
          >
            Copyright © Governo Provincial do Cunene {new Date().getFullYear()}
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};

export default Page;
