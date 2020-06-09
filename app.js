const vm = new Vue({
    el: "#app",
    data: {
        produtos: [],
        produto: false,
        carrinho: [],
    },
    filters: {
        numeroPreco(valor) {
            return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        }
    },
    computed: {
        carrinhoTotal() {
            let total = 0
            if (this.carrinho.length) {
                this.carrinho.forEach(item => {
                    total += item.preco
                });
            }
            return total;
        }
    },

    methods: {
        puxarProdutos() {
            fetch('./api/produtos.json')
                .then(r => r.json())
                .then(r => {
                    this.produtos = r
                })
        },
        puxarProduto(id) {
            fetch(`./api/produtos/${id}/dados.json`)
                .then(r => r.json())
                .then(r => {
                    this.produto = r
                })
        },
        abrirModal(id) {
            this.puxarProduto(id)

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })

        },
        fecharModal({ target, currentTarget }) {
            if (target === currentTarget) this.produto = false
        },
        adicionarItem() {
            this.produto.estoque--
            const { nome, id, preco } = this.produto
            this.carrinho.push({ id, nome, preco })
        },
        removerItem(index) {
            console.log("AAA");

            this.carrinho.splice(index, 1)
        }


    },
    created() {
        this.puxarProdutos()
    }


})