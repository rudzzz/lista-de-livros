//classe pra representar  o livro
class Book {
    constructor(title, author, numeracao){
        this.title = title;
        this.author = author;
        this.numeracao = numeracao;
    }
}

// classe para lidar com elementos visuais da tela
class UI {

    // método que mostra os livros
    static displayBooks() {
        const StoredBooks = Store.getBooks();

        const books = StoredBooks;

        books.forEach(book => UI.addBookToList(book));
    }

    // método para adicionar os livros na tabela
    static addBookToList(book) {
        const list = document.querySelector("#book-list");
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.numeracao}</td>
            <td><a href="#" class="delete-book">X</a></td>
        `;

        list.appendChild(row);
    }

    // método para excluir um livro
    static deleteBook(elemento){
        if(elemento.classList.contains("delete-book")){
            elemento.parentElement.parentElement.remove();
        }
    }

    // método que limpa os inputs depois de adicionado o livro
    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#numeracao").value = "";
    }

    // metodo que cria a div personalizada de alerta na tela, que some após 2 segundos
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");
        container.insertBefore(div, form);

        // div desaparecer depois de 3seg
        setTimeout(() => document.querySelector(".alert").remove(), 2000);
    }
}

//classe para salvar as coisas no LocalStorage
class Store {
    // pega os livros do localStorage
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    // adiciona liveos e converte para JSON
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    // remove livros do localStorage
    static removeBook(numeracao) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.numeracao === numeracao){
                console.log(book);
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Evento para mostrar os livros
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Evento para adicionar livros
document.querySelector("#book-form").addEventListener('submit', (evento) => {

    // prevenindo o comportamento padrão de enviar o formulario, por ser um evento de submit
    evento.preventDefault();

    //pegando os valores os inputs
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const numeracao = document.querySelector("#numeracao").value;

    //validando os inputs
    if(title === '' || author === '' || numeracao == ''){
        UI.showAlert("Preencha todos os campos!", 'danger');
    }
    else{
        //instanciando a classe e criando um novo livro com os valores dos inputs a partir da classe de livros criada.
    const book = new Book(title, author, numeracao);
    // console.log(book);

    //adicionando na tabela
    UI.addBookToList(book);

    //adicionando livro no LocalStorage
    Store.addBook(book);

    // Mostrar mensagem de sucesso
    UI.showAlert("Livro adicionado com sucesso!", 'success')

    // limpar os inputs depois de adicionar o livro
    UI.clearFields();
    }
    
});

//Evento para remover livros
document.querySelector("#book-list").addEventListener('click', (evento) => {
    // removendo livro da tela
     UI.deleteBook(evento.target);

     // exibindo mensagem de exclusao do livro
     UI.showAlert("Livro excluído", 'danger');

     //removendo livro do localStorage
     Store.removeBook(evento.target.parentElement.previousElementSibling.textContent);
});