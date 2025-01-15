export function adicionarIndicadorPais(numero: string) {
  if (numero.startsWith("00")) {
    numero = numero.slice(2);
  }
  numero = numero.replace(/\s|\+|[^\d]/g, "");
  if (/^\d+$/.test(numero)) {
    if (numero.length > 9) {
      return numero;
    } else {
      return "244" + numero;
    }
  } else {
    return null;
  }
}

export const signupValidator = (state: any, setErrors: any) => {
  let errors: any = {};
  if (!state.email.trim()) {
    errors.email = "Email é obrigatório.";
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(state.email)) {
    errors.email = "Formato de email inválido.";
  }

  if (!state.password.trim()) {
    errors.password = "Senha é obrigatória.";
  } else if (state.password.length < 6) {
    errors.password = "A senha deve ter pelo menos 6 caracteres.";
  }
  setErrors(errors);

  // Retorna verdadeiro se não houver erros
  return Object.keys(errors).length === 0;
};

export const signinValidator = (state: any, setErrors: any) => {
  let errors: any = {};

  if (!state.email.trim()) {
    errors.email = "Email é obrigatório.";
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(state.email)) {
    errors.email = "Formato de email inválido.";
  }

  if (!state.password.trim()) {
    errors.password = "Senha é obrigatória.";
  } else if (state.password.length < 6) {
    errors.password = "A senha deve ter pelo menos 6 caracteres.";
  }

  setErrors(errors);

  // Retorna verdadeiro se não houver erros
  return Object.keys(errors).length === 0;
};

export const firebaseErrorTranslator = (errorCode: string) => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return {
        field: "email",
        message: "Este e-mail já está sendo utilizado por outra conta.",
      };
    case "auth/invalid-credential":
    case "auth/user-not-found":
      return {
        field: "email",
        message: "Não existe nenhuma conta com este e-mail.",
      };
    case "auth/wrong-password":
      return {
        field: "password",
        message: "Senha incorreta. Por favor, tente novamente.",
      };
    case "auth/invalid-email":
      return { field: "email", message: "O e-mail fornecido não é válido." };
    case "auth/user-disabled":
      return { field: "email", message: "Esta conta foi desabilitada." };
    case "auth/too-many-requests":
      return {
        field: "email",
        message:
          "Muitas tentativas de login. Por favor, tente novamente mais tarde.",
      };
    case "auth/weak-password":
      return { field: "password", message: "A senha fornecida é muito fraca." };
    default:
      return {
        field: "email",
        message:
          "Ocorreu um erro durante a autenticação. Por favor, tente novamente.",
      };
  }
};
