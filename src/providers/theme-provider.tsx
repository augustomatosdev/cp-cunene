"use client";
import { createTheme, ThemeProvider as Provider } from "@mui/material";
import React from "react";

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = createTheme({
    palette: {
      primary: { main: "#800706" },
    },
  });

  return <Provider theme={theme}>{children}</Provider>;
};

export default ThemeProvider;
