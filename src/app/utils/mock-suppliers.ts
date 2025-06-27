import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";

export const uploadSupplier = async () => {
  const sampleSuppliers = [
    {
      name: "TechSupply",
      nif: "00688888888",
      email: "contact@techsupply.com",
      telefone1: "923123456",
      createdAt: { seconds: 1730219346, nanoseconds: 125000000 },
      socios: [
        {
          telefoneResponsavel: "923123456",
          responsavel: "Carlos Silva",
          cargoResponsavel: "Diretor",
        },
      ],
      status: "Activo",
      natureza: "Sociedade por Quotas",
      provincia: "Benguela",
      tipo: "Serviço",
      registro: "2024-10-20",
      address: "Rua Principal, Benguela",
      inicio: "2024-10-20",
      descricao: "Distribuição de componentes tecnológicos.",
      telefone2: "924123456",
    },
    {
      name: "AgroPrime",
      nif: "00699999999",
      email: "info@agroprime.com",
      telefone1: "923234567",
      createdAt: { seconds: 1730319446, nanoseconds: 125000000 },
      socios: [
        {
          telefoneResponsavel: "923234567",
          responsavel: "Maria Almeida",
          cargoResponsavel: "Coordenadora",
        },
      ],
      status: "Activo",
      natureza: "Sociedade por Quotas",
      provincia: "Huambo",
      tipo: "Produto",
      registro: "2024-09-15",
      address: "Fazenda Central, Huambo",
      inicio: "2024-09-15",
      descricao: "Produtos agrícolas frescos.",
      telefone2: "924234567",
    },
    {
      name: "Construtec",
      nif: "00600011111",
      email: "contact@construtec.com",
      telefone1: "923345678",
      createdAt: { seconds: 1730419546, nanoseconds: 125000000 },
      socios: [
        {
          telefoneResponsavel: "923345678",
          responsavel: "João Pedro",
          cargoResponsavel: "Engenheiro",
        },
      ],
      status: "Inativo",
      natureza: "Empresa Individual",
      provincia: "Namibe",
      tipo: "Serviço",
      registro: "2024-08-30",
      address: "Av. dos Pescadores, Namibe",
      inicio: "2024-08-30",
      descricao: "Serviços de construção civil.",
      telefone2: "924345678",
    },
    {
      name: "FarmLife",
      nif: "00611122222",
      email: "sales@farmlife.com",
      telefone1: "923456789",
      createdAt: { seconds: 1730519646, nanoseconds: 125000000 },
      socios: [
        {
          telefoneResponsavel: "923456789",
          responsavel: "Ana Costa",
          cargoResponsavel: "Gestora",
        },
      ],
      status: "Activo",
      natureza: "Cooperativa",
      provincia: "Cuanza Norte",
      tipo: "Produto",
      registro: "2024-08-10",
      address: "Zona Agrícola, Cuanza Norte",
      inicio: "2024-08-10",
      descricao: "Produtos alimentares naturais.",
      telefone2: "924456789",
    },
    {
      name: "CleanAir",
      nif: "00622233333",
      email: "contact@cleanair.com",
      telefone1: "923567890",
      createdAt: { seconds: 1730619746, nanoseconds: 125000000 },
      socios: [
        {
          telefoneResponsavel: "923567890",
          responsavel: "Luis Mota",
          cargoResponsavel: "CEO",
        },
      ],
      status: "Activo",
      natureza: "Sociedade por Ações",
      provincia: "Luanda",
      tipo: "Serviço",
      registro: "2024-07-28",
      address: "Centro Empresarial, Luanda",
      inicio: "2024-07-28",
      descricao: "Consultoria ambiental e industrial.",
      telefone2: "924567890",
    },
    {
      name: "Energix",
      nif: "00633344444",
      email: "support@energix.com",
      telefone1: "923678901",
      createdAt: { seconds: 1730719846, nanoseconds: 125000000 },
      socios: [
        {
          telefoneResponsavel: "923678901",
          responsavel: "Rui Teixeira",
          cargoResponsavel: "Diretor Técnico",
        },
      ],
      status: "Activo",
      natureza: "Sociedade por Quotas",
      provincia: "Bengo",
      tipo: "Produto",
      registro: "2024-07-15",
      address: "Rua das Energias, Bengo",
      inicio: "2024-07-15",
      descricao: "Soluções de energia renovável.",
      telefone2: "924678901",
    },
    {
      name: "HydroSol",
      nif: "00644455555",
      email: "sales@hydrosol.com",
      telefone1: "923789012",
      createdAt: { seconds: 1730819946, nanoseconds: 125000000 },
      socios: [
        {
          telefoneResponsavel: "923789012",
          responsavel: "Fernanda Silva",
          cargoResponsavel: "Fundadora",
        },
      ],
      status: "Inativo",
      natureza: "Empresa Individual",
      provincia: "Cabinda",
      tipo: "Serviço",
      registro: "2024-07-01",
      address: "Praça Central, Cabinda",
      inicio: "2024-07-01",
      descricao: "Serviços de gestão hídrica.",
      telefone2: "924789012",
    },
    {
      name: "SteelWorks",
      nif: "00655566666",
      email: "info@steelworks.com",
      telefone1: "923890123",
      createdAt: { seconds: 1730919946, nanoseconds: 125000000 },
      socios: [
        {
          telefoneResponsavel: "923890123",
          responsavel: "Miguel Santos",
          cargoResponsavel: "Gerente",
        },
      ],
      status: "Activo",
      natureza: "Sociedade por Ações",
      provincia: "Uíge",
      tipo: "Produto",
      registro: "2024-06-20",
      address: "Zona Industrial, Uíge",
      inicio: "2024-06-20",
      descricao: "Produtos de aço e ferro.",
      telefone2: "924890123",
    },
    // Additional 11 suppliers with unique values
  ];

  // Adding unique suppliers up to 20
  for (let i = sampleSuppliers.length + 1; i <= 20; i++) {
    sampleSuppliers.push({
      name: `Supplier${i}`,
      nif: `006${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `supplier${i}@example.com`,
      telefone1: `923${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
      socios: [
        {
          telefoneResponsavel: `923${Math.floor(
            100000 + Math.random() * 900000
          )}`,
          responsavel: `Responsavel${i}`,
          cargoResponsavel: "Gerente",
        },
      ],
      status: i % 2 === 0 ? "Activo" : "Inativo",
      natureza: "Sociedade Unipessoal por Quotas",
      provincia: "Luanda",
      tipo: i % 3 === 0 ? "Serviço" : "Produto",
      registro: `2024-10-${i}`,
      address: `Endereço Exemplo ${i}`,
      inicio: `2024-10-${i}`,
      descricao: `Descrição para Supplier${i} sobre produtos variados.`,
      telefone2: `924${Math.floor(100000 + Math.random() * 900000)}`,
    });
  }

  const suppliersCollection = collection(db, "suppliers");
  try {
    for (const supplier of sampleSuppliers) {
      await addDoc(suppliersCollection, supplier);
    }
  } catch (error) {
    console.error("Error uploading suppliers: ", error);
  }
};
