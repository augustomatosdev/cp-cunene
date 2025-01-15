import React from "react";

const Instructions = () => {
  const Section = ({ title, children }: any) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-zinc-800 mb-2">{title}</h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  );

  const Item = ({ children }: any) => (
    <li className="text-sm text-zinc-600 flex items-start">
      <span className="text-blue-500 mr-2">•</span>
      <span>{children}</span>
    </li>
  );

  return (
    <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
      <h2 className="text-lg font-semibold text-zinc-800 mb-4">
        Como preencher o formulário
      </h2>

      <Section title="1. Dados da empresa">
        <Item>
          Preencha o nome completo da empresa ou designação comercial conforme
          consta no registro comercial
        </Item>
        <Item>
          O NIF deve conter todos os dígitos sem espaços ou caracteres especiais
        </Item>
        <Item>
          Selecione a natureza jurídica que corresponde ao tipo de constituição
          da sua empresa
        </Item>
        <Item>
          A data de abertura deve corresponder à data de constituição legal da
          empresa
        </Item>
      </Section>

      <Section title="2. Localização e contactos">
        <Item>Forneça o endereço completo da sede da empresa</Item>
        <Item>O email deve ser corporativo e regularmente monitorado</Item>
        <Item>O Telefone 1 é obrigatório e deve ser o principal contacto</Item>
        <Item>O Telefone 2 é opcional e pode ser usado como alternativa</Item>
      </Section>

      <Section title="3. Quadro societário">
        <Item>Liste todos os sócios começando pelo sócio maioritário</Item>
        <Item>Forneça o nome completo conforme documento de identificação</Item>
        <Item>Inclua um número de telefone direto para contacto</Item>
        <Item>Especifique o cargo atual na empresa</Item>
      </Section>

      <Section title="4. Outras informações">
        <Item>
          A data de início corresponde ao primeiro dia de fornecimento
        </Item>
        <Item>
          Selecione o tipo: Produto para bens materiais, Serviço para prestações
        </Item>
        <Item>O estado inicial será "Activo" por padrão</Item>
        <Item>Detalhe os principais produtos ou serviços oferecidos</Item>
      </Section>

      <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-md">
        <p className="text-sm text-blue-700 font-medium mb-2">
          Observações importantes:
        </p>
        <ul className="space-y-1">
          <li className="text-sm text-blue-600 flex items-start">
            <span className="mr-2">•</span>
            <span>Todos os campos marcados com * são obrigatórios</span>
          </li>
          <li className="text-sm text-blue-600 flex items-start">
            <span className="mr-2">•</span>
            <span>Verifique todas as informações antes de cadastrar</span>
          </li>
          <li className="text-sm text-blue-600 flex items-start">
            <span className="mr-2">•</span>
            <span>Você receberá uma confirmação após o cadastro</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Instructions;
