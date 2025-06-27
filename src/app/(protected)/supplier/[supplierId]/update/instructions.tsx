import React from "react";
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

const Instructions = () => {
  const sections = [
    {
      title: "Dados da empresa",
      icon: <BusinessIcon color="primary" />,
      items: [
        "Preencha o nome completo da empresa ou designação comercial conforme consta no registro comercial",
        "O NIF deve conter todos os dígitos sem espaços ou caracteres especiais",
        "Selecione a natureza jurídica que corresponde ao tipo de constituição da sua empresa",
        "A data de abertura deve corresponder à data de constituição legal da empresa",
      ],
    },
    {
      title: "Localização e contactos",
      icon: <LocationOnIcon color="primary" />,
      items: [
        "Forneça o endereço completo da sede da empresa",
        "O email deve ser corporativo e regularmente monitorado",
        "O Telefone 1 é obrigatório e deve ser o principal contacto",
        "O Telefone 2 é opcional e pode ser usado como alternativa",
      ],
    },
    {
      title: "Quadro societário",
      icon: <PeopleIcon color="primary" />,
      items: [
        "Liste todos os sócios começando pelo sócio maioritário",
        "Forneça o nome completo conforme documento de identificação",
        "Inclua um número de telefone direto para contacto",
        "Especifique o cargo atual na empresa",
      ],
    },
    {
      title: "Outras informações",
      icon: <InfoIcon color="primary" />,
      items: [
        "A data de início corresponde ao primeiro dia de fornecimento",
        "Selecione o tipo: Produto para bens materiais, Serviço para prestações",
        'O estado inicial será "Activo" por padrão',
        "Detalhe os principais produtos ou serviços oferecidos",
      ],
    },
  ];

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        position: "sticky",
        top: 20,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <HelpOutlineIcon />
        <Typography variant="h6" fontWeight={500}>
          Como preencher o formulário
        </Typography>
      </Box>

      {/* Instructions accordions */}
      {sections.map((section, index) => (
        <Accordion
          key={index}
          disableGutters
          elevation={0}
          defaultExpanded={index === 0}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: "action.hover",
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:hover": {
                backgroundColor: "action.selected",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {section.icon}
              <Typography variant="subtitle1" fontWeight={500}>
                {index + 1}. {section.title}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2 }}>
            <List dense disablePadding>
              {section.items.map((item, itemIndex) => (
                <ListItem
                  key={itemIndex}
                  alignItems="flex-start"
                  sx={{ py: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleOutlineIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item}
                    primaryTypographyProps={{
                      variant: "body2",
                      color: "text.secondary",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Important notes */}
      <Box sx={{ p: 2.5 }}>
        <Typography
          variant="subtitle1"
          fontWeight={500}
          color="primary"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1.5,
          }}
        >
          <NewReleasesIcon color="primary" />
          Observações importantes:
        </Typography>

        <Alert
          severity="info"
          variant="outlined"
          sx={{ mb: 2, borderRadius: 1 }}
        >
          Todos os campos marcados com * são obrigatórios
        </Alert>

        <Alert
          severity="warning"
          variant="outlined"
          sx={{ mb: 2, borderRadius: 1 }}
        >
          Verifique todas as informações antes de cadastrar
        </Alert>

        <Alert severity="success" variant="outlined" sx={{ borderRadius: 1 }}>
          Você receberá uma confirmação após o cadastro
        </Alert>
      </Box>
    </Paper>
  );
};

export default Instructions;
