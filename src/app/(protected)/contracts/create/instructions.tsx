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
        Como preencher o formulário de contrato
      </h2>

      <Section title="1. Identificação do Fornecedor">
        <Item>
          Selecione o nome do fornecedor da lista disponível no sistema
        </Item>
        <Item>
          Certifique-se que o fornecedor selecionado corresponde à empresa
          correta
        </Item>
        <Item>
          Caso o fornecedor não esteja na lista, será necessário cadastrá-lo
          primeiro
        </Item>
      </Section>

      <Section title="2. Dados do Contrato">
        <Item>
          O número de referência deve ser único e corresponder ao número oficial
          do contrato
        </Item>
        <Item>Descreva o objeto do contrato de forma clara e específica</Item>
        <Item>
          Inclua todas as observações relevantes sobre o contrato no campo de
          descrição
        </Item>
        <Item>
          As datas de início e término devem corresponder ao período de vigência
          do contrato
        </Item>
      </Section>

      <Section title="3. Informações Financeiras">
        <Item>
          O valor financeiro deve ser inserido em Kwanzas, sem pontos ou
          vírgulas
        </Item>
        <Item>
          Certifique-se que o valor corresponde ao montante total do contrato
        </Item>
        <Item>
          Em caso de contratos com valores variáveis, insira o valor máximo
          previsto
        </Item>
      </Section>

      <Section title="4. Estado e Documentação">
        <Item>
          Selecione o estado atual do contrato (Em andamento, Concluído ou
          Cancelado)
        </Item>
        <Item>
          Anexe todos os documentos relevantes do contrato em formato PDF
        </Item>
        <Item>
          Certifique-se que os documentos estão legíveis e completos antes do
          upload
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
              Todos os campos marcados são de preenchimento obrigatório
            </span>
          </li>
          <li className="text-sm text-red-800 flex items-start">
            <span className="mr-2">•</span>
            <span>
              Verifique todas as informações antes de submeter o contrato
            </span>
          </li>
          <li className="text-sm text-red-800 flex items-start">
            <span className="mr-2">•</span>
            <span>Após o envio, você receberá uma confirmação do registro</span>
          </li>
          <li className="text-sm text-red-800 flex items-start">
            <span className="mr-2">•</span>
            <span>
              Em caso de erro, entre em contacto com o administrador do sistema
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Instructions;
