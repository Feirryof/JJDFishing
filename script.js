document.addEventListener('DOMContentLoaded', () => {
    const carrinho = {};  // Armazena os produtos no carrinho
    const itensCarrinho = document.querySelector('.itens-carrinho');
    const totalEl = document.getElementById('total');
    let numeroPedido = 1;  // Contador de pedidos

    // Função para atualizar a visualização do carrinho
    const atualizarCarrinho = () => {
        itensCarrinho.innerHTML = '';
        let total = 0;

        Object.values(carrinho).forEach(item => {
            total += item.quantidade * item.preco;

            const itemEl = document.createElement('div');
            itemEl.className = 'item-carrinho';
            itemEl.innerHTML = `
                <div>
                    <img src="${item.img}" alt="${item.nome}">
                    <span>${item.nome}</span>
                </div>
                <div>
                    <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
                    <div class="quantidade">
                        <button class="btn-remover" data-id="${item.id}">-</button>
                        <span>${item.quantidade}</span>
                        <button class="btn-adicionar" data-id="${item.id}">+</button>
                    </div>
                </div>
            `;
            itensCarrinho.appendChild(itemEl);
        });

        totalEl.textContent = total.toFixed(2);
    };

    // Função para adicionar produto ao carrinho
    const adicionarAoCarrinho = (id, nome, preco, img) => {
        if (!carrinho[id]) {
            carrinho[id] = { id, nome, preco, img, quantidade: 1 };
        } else {
            carrinho[id].quantidade += 1;
        }
        atualizarCarrinho();
    };

    // Função para remover produto do carrinho
    const removerDoCarrinho = (id) => {
        if (carrinho[id]) {
            carrinho[id].quantidade -= 1;
            if (carrinho[id].quantidade <= 0) {
                delete carrinho[id];
            }
        }
        atualizarCarrinho();
    };

    // Função para gerar a mensagem do pedido para o WhatsApp
    const gerarMensagemWhatsApp = (dadosCliente) => {
        const produtos = Object.values(carrinho)
            .map(item => `${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}`)
            .join('\n');
        
        const total = totalEl.textContent;
        const mensagem = `
            Número do Pedido: #${String(numeroPedido).padStart(4, '0')}
            Descrição do Pedido:
            ${produtos}
            
            Valor Total: R$ ${total}
            Método de Pagamento: Pix
            
            Nome: ${dadosCliente.nome}
            E-mail: ${dadosCliente.email}
            Telefone: ${dadosCliente.telefone}
            Endereço: ${dadosCliente.endereco}
        `;

        numeroPedido++;  // Incrementa o número do pedido para a próxima compra
        return mensagem;
    };

    // Função para abrir o modal
    const abrirModal = () => {
        const modal = document.getElementById('modal');
        modal.style.display = 'flex';
    };

    // Função para fechar o modal
    const fecharModal = () => {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    };

    // Evento para adicionar produtos ao carrinho
    document.querySelectorAll('.btn-adicionar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const produtoEl = e.target.closest('.produto');
            const nome = produtoEl.querySelector('h3').textContent;
            const precoTexto = produtoEl.querySelector('p').textContent; 
            const preco = parseFloat(precoTexto.replace('R$', '').replace(',', '.').trim());
            const img = produtoEl.querySelector('img').src;
            const id = nome;

            adicionarAoCarrinho(id, nome, preco, img);
        });
    });

    // Evento para os botões dentro do carrinho
    itensCarrinho.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-adicionar')) {
            const id = e.target.dataset.id;
            const produto = carrinho[id];
            adicionarAoCarrinho(produto.id, produto.nome, produto.preco, produto.img);
        } else if (e.target.classList.contains('btn-remover')) {
            const id = e.target.dataset.id;
            removerDoCarrinho(id);
        }
    });

    // Evento para o botão "Comprar"
    document.getElementById('btn-comprar').addEventListener('click', () => {
        if (Object.keys(carrinho).length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        abrirModal();
    });

    // Evento para o envio do formulário de dados do cliente
    document.getElementById('form-dados-cliente').addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const endereco = document.getElementById('endereco').value;

        const mensagem = gerarMensagemWhatsApp({ nome, email, telefone, endereco });

        const telefoneWhatsApp = "5547996941882"; // Número do WhatsApp para onde o pedido será enviado
        const linkWhatsApp = `https://wa.me/${telefoneWhatsApp}?text=${encodeURIComponent(mensagem)}`;

        // Abrir link do WhatsApp
        window.open(linkWhatsApp, '_blank');

        fecharModal(); // Fecha o modal após o envio
        Object.keys(carrinho).forEach(id => delete carrinho[id]); // Limpa o carrinho
        atualizarCarrinho(); // Atualiza o carrinho (vai aparecer vazio)
    });
});

$('.order').click(function (e) {
    let button = $(this);

    if(!button.hasClass('animate')) {
        button.addClass('animate');
        setTimeout(() => {
            button.removeClass('animate');
        }, 10000);
    }
})

// Seleciona o botão de fechar e o modal
const closeModalButton = document.getElementById('close-modal');
const modal = document.getElementById('modal');

// Evento para fechar o modal
closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none'; // Oculta o modal
});

// (Opcional) Fecha o modal ao clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

