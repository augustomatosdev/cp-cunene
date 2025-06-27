import React from "react";

const UserInstructions = () => {
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
        Como preencher o formulário de criação de usuário
      </h2>

      <Section title="1. Dados Pessoais">
        <Item>
          Insira o nome completo do usuário, incluindo nome e sobrenome
        </Item>
        <Item>O nome deve corresponder à identificação oficial da pessoa</Item>
        <Item>Evite abreviações e certifique-se da grafia correta do nome</Item>
      </Section>

      <Section title="2. Informações de Acesso">
        <Item>O endereço de email deve ser válido e único no sistema</Item>
        <Item>
          Certifique-se que o email está escrito corretamente, sem espaços ou
          caracteres especiais
        </Item>
        <Item>Este email será usado para login e comunicações do sistema</Item>
        <Item>
          Caso o email já esteja registrado, o sistema não permitirá o cadastro
        </Item>
      </Section>

      <Section title="3. Definição de Senha">
        <Item>
          A senha deve ter pelo menos 6 caracteres para garantir segurança
          básica
        </Item>
        <Item>
          Recomenda-se usar uma combinação de letras, números e símbolos
        </Item>
        <Item>
          Evite senhas muito simples como "123456" ou sequências de teclado
        </Item>
        <Item>O usuário poderá alterar a senha após o primeiro acesso</Item>
      </Section>

      <Section title="4. Definição de Função">
        <Item>
          <strong>Administrador:</strong> Acesso total ao sistema, incluindo
          gestão de usuários e configurações
        </Item>
        <Item>
          <strong>Usuário:</strong> Acesso limitado às funcionalidades básicas
          do sistema
        </Item>
        <Item>
          Selecione a função de acordo com as responsabilidades da pessoa
        </Item>
        <Item>
          A função pode ser alterada posteriormente por um administrador
        </Item>
      </Section>

      <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-md">
        <p className="text-sm text-red-900 font-medium mb-2">
          Informações importantes:
        </p>
        <ul className="space-y-1">
          <li className="text-sm text-red-800 flex items-start">
            <span className="mr-2">•</span>
            <span>Todos os campos são de preenchimento obrigatório</span>
          </li>
          <li className="text-sm text-red-800 flex items-start">
            <span className="mr-2">•</span>
            <span>Verifique todas as informações antes de criar o usuário</span>
          </li>
          <li className="text-sm text-red-800 flex items-start">
            <span className="mr-2">•</span>
            <span>
              Após a criação, você receberá uma confirmação do registro
            </span>
          </li>
          <li className="text-sm text-red-800 flex items-start">
            <span className="mr-2">•</span>
            <span>
              O novo usuário poderá fazer login imediatamente com as credenciais
              fornecidas
            </span>
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

export default UserInstructions;
