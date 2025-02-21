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

      <Section title="1. Identificação do Fornecedor">
        <Item>
          Selecione o nome do fornecedor da lista disponível no sistema usando o
          campo de autocompletar
        </Item>
        <Item>
          Certifique-se que o fornecedor selecionado corresponde à empresa
          correta
        </Item>
        <Item>
          Se o fornecedor já estiver pré-selecionado, este campo não será
          editável
        </Item>
      </Section>

      <Section title="2. Dados do Documento">
        <Item>
          Insira o número ou referência único do documento no campo
          correspondente
        </Item>
        <Item>
          Forneça uma descrição clara e detalhada do documento no campo de
          descrição
        </Item>
        <Item>
          Selecione a data de emissão do documento usando o seletor de data
        </Item>
      </Section>

      <Section title="3. Anexos">
        <Item>
          Clique no botão "Anexar ficheiro" para adicionar os documentos
          necessários
        </Item>
        <Item>É possível anexar múltiplos arquivos de uma vez</Item>
        <Item>
          Após adicionar os arquivos, você verá uma mensagem de confirmação
          "Documento adicionado!"
        </Item>
      </Section>

      <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-md">
        <p className="text-sm text-red-900 font-medium mb-2">
          Informações importantes:
        </p>
        <ul className="space-y-1">
          <li className="text-sm text-red-800 flex items-start">
            <span className="mr-2">•</span>
            <span>
              Os campos de fornecedor, referência, descrição e data de emissão
              são obrigatórios
            </span>
          </li>
          <li className="text-sm text-red-800 flex items-start">
            <span className="mr-2">•</span>
            <span>
              Verifique todas as informações antes de clicar no botão "Enviar"
            </span>
          </li>
          <li className="text-sm text-red-800 flex items-start">
            <span className="mr-2">•</span>
            <span>
              Você receberá uma notificação de sucesso após o envio do documento
            </span>
          </li>
          <li className="text-sm text-red-800 flex items-start">
            <span className="mr-2">•</span>
            <span>
              Em caso de erro, uma mensagem específica será exibida para
              auxiliar na correção
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Instructions;
