// Importando o bcrypt para hash a senha
const bcrypt = require('bcrypt');

module.exports = {

  // Nome amigável do helper 
  friendlyName: 'Dados service',

  // Descrição do helper
  description: 'Helper to validate, clean, format, and validate data business rules and treat errors',

  // Inputs que o helper receberá
  inputs: {
    // Nome da coluna
    column: {
      type: 'string',
      required: true,
      example: 'name',
      description: 'Name of the column being processed'
    },

    // Valor que se quer dar à coluna
    value: {
      type: 'ref',
      required: true,
      example: 'Senha123*',
      description: 'Value of the column being processed'
    },

    // Tipo que se quer que os dados tenham
    type: {
      type: 'string',
      required: true,
      example: 'string',
      description: 'Desired data type of the column being processed'
    },

    // Regras de negócio adicionais
    rules: {
      type: 'json',
      required: false,
      example: { password: true },
      description: 'Any validation business rule for the column being processed'
    }
  },

  // Possíveis saídas do helper
  exits: {
    // Saída de sucesso
    success: {
      description: 'Data treated successfully',
    },
  
    // Saída de tipo de dado inválido
    invalidDataType: {
      description: 'The expected data type does not correspond to the type of the value filled'
    },

    // Saída para violação de regras de negócio
    businessRuleViolation: {
      description: 'Violation of business rules for the column being processed'
    }
  },

  // Função de chamada do helper
  fn: async function (inputs, exits) {

    // Método que valida o tipo de dados
    const validate = (value, dataType) => {
      switch (dataType) {
        case 'string':
          return typeof value === 'string';
        case 'number':
          return typeof value === 'number';
        case 'date':
          return !isNaN(Date.parse(value));
        default:
          return false;
      };
    }

    // Método que limpa os dados tirando acentos e caracteres especiais
    const clean = (value) => {
      if (typeof value === 'string' && inputs.rules && inputs.rules.password !== true && inputs.column !== 'emails') {
        value = value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return value.replace(/[^a-zA-Z0-9 ]/g, ''); 
      }
      return value;
    }
    
    // Método que valida as regras de negócio
    const validateRules = (value, rules) => {
      //valida o minimo e o maximo para numeros
      if (rules && rules.min && typeof value == 'number' && value < rules.min ) {
        throw 'businessRuleViolation';
      }
      if (rules && rules.max && typeof value == 'number' && value > rules.max) {
        throw 'businessRuleViolation';
      }

      //valida o minimo e o maximo para strings
      if (rules && rules.max && typeof value == 'string' && value.length > rules.max) {
        throw 'businessRuleViolation';
      }
      if (rules && rules.max && typeof value == 'string' && value.length < rules.min) {
        throw 'businessRuleViolation';
      }

      //verifica se senha contem maiuscula, minuscula e caractere especial 
      if (rules && rules.password === true) {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]+$/;
        if (!passwordRegex.test(value)) {
          throw 'businessRuleViolation';
        }
      }
      return true;
    };


    // Método que formata os dados do nome, datas e senhas
    const format = async (value, type) => {
      if (inputs.column == 'names') {
        return capitalizeFirstLetter(value);
      }
      else if (type === 'date') {
        let date = new Date(value);
        return date.toISOString().split('T')[0];
      }
      else if (type === 'string' && inputs.rules && inputs.rules.password) {
          const saltRounds = 10;
          return await bcrypt.hash(value, saltRounds);
      }
      return value;
    }

    try {
        // Validando o tipo de dados
        if (!validate(inputs.value, inputs.type)) {
          throw 'invalidType';
        }
        
        // Limpando os dados
        let value = clean(inputs.value);

        // Validando as regras de negócio
        if (inputs.rules) {
          validateRules(value, inputs.rules);
        }

        // Formatando os dados
        value = await format(value, inputs.type);
  
        // Sucesso caso tenha passado em todo teste
        return exits.success(value);

      } catch (error) {

        // Explicando o erro de dado inválido
        if (error === 'invalidType') {
          return exits.invalidDataType(`Invalid data type for column ${inputs.column}`);
        }

        // Explicando o erro de violação de regra de negócio
        if (error === 'businessRuleViolation') {
          return exits.businessRuleViolation(`Business rule violation for column ${inputs.column}`);
        }

        // Erro sem tipo
        return exits.error(`Error processing field ${inputs.column}: ${error.message}`);
      }
  }
};

// Função para deixar a primeira letra de cada palavra em maiúscula
const capitalizeFirstLetter = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};