"use strict";

var model = {
  //Abrindo o formulario
  activate: function activate() {
    document.querySelector('.modal-overlay').classList.toggle('active');
    document.querySelector('.error').setAttribute('id', 'open');
  }
}; // //array com valores inseridos pelo formulario 

var transactions = JSON.parse(localStorage.getItem('saveProd')) || []; //transações de entrada e saida

var Transaction = {
  //adicionando valores no array
  add: function add(transaction) {
    transactions.push(transaction);
    Service.reload();
  },
  "delete": function _delete(index) {
    transactions.splice(index, 1);
    Service.reload();
  },
  addEntry: function addEntry() {
    //Entradas
    var out = 0;
    transactions.forEach(function (transaction) {
      if (transaction.money > 0) {
        out += transaction.money;
      }
    });
    return out;
  },
  addExits: function addExits() {
    //saidas
    var out = 0;
    transactions.forEach(function (transaction) {
      if (transaction.money < 0) {
        out += transaction.money;
      }
    });
    return out;
  },
  total: function total() {
    //totais
    return Transaction.addExits() + Transaction.addEntry();
  }
};
var DOM = {
  //referencia a tag tbody
  transactionsContainer: document.querySelector('#data-table tbody'),
  //inseri o html dinamicamente na pagina que recebe da function innerHTMLTransaction()    
  addTransaction: function addTransaction(transaction, index) {
    var tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;
    DOM.transactionsContainer.appendChild(tr);
  },
  //cria o HTML para inserção pagina recebendo como parametro o array
  innerHTMLTransaction: function innerHTMLTransaction(transaction, index) {
    var money = transaction.money; //Alterar o background do card se valor for negativo

    var cssClass = money > 0 ? "income" : "expense";
    var value = Number(money);
    var Real = value.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'brl'
    });
    var html = "\n        <tr>\n            <td class=\"description\">".concat(transaction.description, "</td>\n            <td class=\"").concat(cssClass, "\">").concat(Real, "</td>\n            <td class=\"date\">").concat(transaction.dates, "</td>\n            <td onclick=\"Transaction.delete(").concat(index, ")\"><img src=\"/assets/minus.svg\" alt=\"remover esta transa\xE7\xE3o\"></td>\n        </tr>\n        ");
    return html;
  },
  //Atualiza os cards Principais da pagina com valores da function transaction()
  updateCards: function updateCards() {
    document.querySelector('#entry').innerHTML = formatNumber(Transaction.addEntry());
    document.querySelector('#output').innerHTML = formatNumber(Transaction.addExits());
    document.querySelector('#total').innerHTML = formatNumber(Transaction.total()); //Formatando p/ moeda

    function formatNumber(value) {
      value = value.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'brl'
      });
      return value;
    }
  },
  clearContents: function clearContents() {
    DOM.transactionsContainer.innerHTML = "";
  }
}; // ================  formulario =========================== //

var Form = {
  //referenciando dados dos formularios
  description: document.querySelector('input #description'),
  amount: document.querySelector('input #amount'),
  data: document.querySelector('#data'),
  //pegando dados   
  getValues: function getValues() {
    return {
      description: description.value,
      amount: amount.value,
      data: data.value
    };
  },
  //validando dados
  validFields: function validFields() {
    var _Form$getValues = Form.getValues(),
        description = _Form$getValues.description,
        amount = _Form$getValues.amount,
        data = _Form$getValues.data;

    if (description == "" | amount == "" | data == "") {
      document.querySelector('.error').setAttribute('id', 'animate');
      throw error;
    } else {
      document.querySelector('.error').setAttribute('id', 'open');
    }
  },
  //formatando valores
  formatValue: function formatValue() {
    var _Form$getValues2 = Form.getValues(),
        description = _Form$getValues2.description,
        amount = _Form$getValues2.amount,
        data = _Form$getValues2.data;

    amount = amount.replace(",", ".");
    var money = Number(amount);
    data = data.replace("/", "-");
    var dates = data.replace(".", "-");
    var dateValue = data.split("-");
    dates = "".concat(dateValue[2], "-").concat(dateValue[1], "-").concat(dateValue[0]); // retornando os valores alterados acima  

    return {
      description: description,
      money: money,
      dates: dates
    };
  },
  // limpando formulario
  clearForm: function clearForm() {
    description.value = "";
    amount.value = "";
    data.value = "";
  },
  submit: function submit(event) {
    event.preventDefault(); //evitar que o form envie as informações padrões   

    try {
      //validando dados 
      Form.validFields(); //formatando dados

      Form.formatValue(); //recebendo os valores da FormatValue            

      var transaction = Form.formatValue(); //salvando transações            

      Transaction.add(transaction); //apagando dados no form

      Form.clearForm(); //fechar Formulario

      model.activate();
    } catch (error) {
      throw error;
    }
  }
};
var Service = {
  initial: function initial() {
    //exibindo valores na tela
    transactions.forEach(function (transactions, index) {
      DOM.addTransaction(transactions, index);
      DOM.updateCards(); //atualiza card       
    });
  },
  reload: function reload() {
    DOM.clearContents();
    Service.initial();
    localStorage.setItem('saveProd', JSON.stringify(transactions));
  }
};
Service.initial();
