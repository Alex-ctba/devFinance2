    

 const model = {
 
//Abrindo o formulario
  activate() {
 document.querySelector('.modal-overlay').classList.toggle('active') 
 document.querySelector('.error').setAttribute('id', 'open') 
   }
 }
 


// //array com valores inseridos pelo formulario 
const transactions = JSON.parse(localStorage.getItem('saveProd')) || []

//transações de entrada e saida
const Transaction = {    
    //adicionando valores no array
    add(transaction){      
        transactions.push(transaction)                        
        Service.reload()
    },

    delete(index){
       
      transactions.splice(index, 1)  
        
        Service.reload()
},
    addEntry(){//Entradas
        let out = 0;        
        transactions.forEach(transaction =>{
            if(transaction.money > 0){              
                out+= transaction.money
            }            
        })
       
        return out
    },
   
    addExits(){//saidas
        let out = 0;
        transactions.forEach(transaction =>{
            if(transaction.money < 0){               
                out+= transaction.money
            }
        })
        return out
        },

    total(){//totais
        return  Transaction.addExits() + Transaction.addEntry()  
    },
  
}

const DOM = {
        //referencia a tag tbody
        transactionsContainer:document.querySelector('#data-table tbody'),    
      
        //inseri o html dinamicamente na pagina que recebe da function innerHTMLTransaction()    
    addTransaction(transaction, index){     

        const tr = document.createElement('tr')        
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index) 
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
       
    },
    //cria o HTML para inserção pagina recebendo como parametro o array
    innerHTMLTransaction(transaction, index){
        let { money } = transaction
        //Alterar o background do card se valor for negativo
        const cssClass =  money > 0 ? "income":"expense"    
        let value  =  Number(money)            
        let Real = value.toLocaleString('pt-br', {style:'currency', currency:'brl'})
        const html =`
        <tr>
            <td class="description">${transaction.description}</td>
            <td class="${cssClass}">${Real}</td>
            <td class="date">${transaction.dates}</td>
            <td onclick="Transaction.delete(${index})"><img src="./assets/minus.svg" alt="remover esta transação"></td>
        </tr>
        `
        return html
    },

//Atualiza os cards Principais da pagina com valores da function transaction()
    updateCards(){
       document.querySelector('#entry').innerHTML =formatNumber(Transaction.addEntry())
       document.querySelector('#output').innerHTML  = formatNumber(Transaction.addExits())
       document.querySelector('#total').innerHTML  =formatNumber(Transaction.total()) 
        //Formatando p/ moeda
       
       function formatNumber(value){          
         value = value.toLocaleString('pt-br', {style:'currency', currency:'brl'})          
        return value 
       }      
    },

    clearContents(){
        DOM.transactionsContainer.innerHTML=""                   
    }

 
}

// ================  formulario =========================== //
const  Form = {
    //referenciando dados dos formularios
    description: document.querySelector('input #description'),
    amount: document.querySelector('input #amount'),
    data: document.querySelector('#data'),

    //pegando dados   
    getValues(){        
       return {
        description: description.value,
        amount:amount.value,
        data:data.value        
       }     
    },

    //validando dados
    validFields(){
     const { description, amount, data } = Form.getValues()  
    
        if(description  == ""  |  amount  == "" | data  == ""){
            document.querySelector('.error').setAttribute('id', 'animate') 
            throw error               
        } else{
            document.querySelector('.error').setAttribute('id', 'open') 
        }       
    }, 

    //formatando valores
    formatValue(){
        let { description, amount, data } = Form.getValues()
        amount = amount.replace(",", ".")
        money = Number(amount)
        data = data.replace("/", "-")
        dates = data.replace(".", "-")
        dateValue = data.split("-")
        dates = `${dateValue[2]}-${dateValue[1]}-${dateValue[0]}`
         // retornando os valores alterados acima  
        return {
            description,
            money,
            dates
        }
      
    },

    // limpando formulario
    clearForm(){                
        description.value = ""
        amount.value = ""
        data.value = ""        
    },


    submit(event){
        event.preventDefault()//evitar que o form envie as informações padrões   
      try{
            //validando dados 
            Form.validFields()             

            //formatando dados
            Form.formatValue()            

            //recebendo os valores da FormatValue            
            const transaction = Form.formatValue() 
           
            //salvando transações            
            Transaction.add(transaction)          
            
            //apagando dados no form
            Form.clearForm()
            

            //fechar Formulario
            model.activate()
                 
        }catch(error){
            console.log('error')
        }
        
    }

   
}





const Service = {
    initial(){
    
       //exibindo valores na tela
    transactions.forEach(function(transactions, index){
    DOM.addTransaction(transactions, index)
    DOM.updateCards()//atualiza card       
})
    },

    reload(){
        DOM.clearContents()
        Service.initial()
        localStorage.setItem('saveProd', JSON.stringify(transactions))
    }

}



Service.initial()












