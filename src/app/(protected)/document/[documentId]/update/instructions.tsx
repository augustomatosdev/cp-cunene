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
      <span className="text-red-900 mr-2">•</span>
      <span>{children}</span>
    </li>
  );

  return (
    <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
      <h2 className="text-lg font-semibold text-zinc-800 mb-4">
        Como preencher o formulário de documento
      </h2>

      <Section title="1. Dados do Documento (Obrigatório)">
        <Item>
          Insira o número ou referência único do documento no campo
          correspondente
        </Item>
        <Item>Forneça um título claro e descritivo para o documento</Item>
        <Item>Adicione uma descrição detalhada do conteúdo do documento</Item>
        <Item>
          Selecione a data de emissão do documento usando o seletor de data
        </Item>
      </Section>

      <Section title="2. Informações Adicionais (Opcional)">
        <Item>
          <strong>Departamento/Escritório:</strong> Especifique o departamento,
          escritório ou seção relacionada ao documento (ex: Departamento
          Jurídico, Escritório de Lisboa)
        </Item>
        <Item>
          <strong>Fornecedor:</strong> Selecione um fornecedor apenas se o
          documento estiver relacionado a uma empresa específica usando o campo
          de autocompletar
        </Item>
        <Item>
          <strong>Pasta:</strong> Escolha uma pasta para organizar o documento
          dentro do sistema de arquivos
        </Item>
      </Section>

      <Section title="3. Anexos (Obrigatório)">
        <Item>
          Clique no botão "Anexar ficheiros" para adicionar os documentos
          necessários
        </Item>
        <Item>
          É possível anexar múltiplos arquivos de uma vez (PDF, DOC, XLS,
          imagens)
        </Item>
        <Item>
          Após selecionar os arquivos, você verá a quantidade de ficheiros
          selecionados
        </Item>
        <Item>
          É obrigatório anexar pelo menos um ficheiro para criar o documento
        </Item>
      </Section>
    </div>
  );
};

export default Instructions;
