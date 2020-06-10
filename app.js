const vm = new Vue({
    el: "#app",
    data: {
        produtos: [],
        produto: false,
        carrinho: [],
        carrinhoAtivo: false,
        mensagemAlerta: "",
        alertaAtivo: false
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
        clickForaCarrinho({ target, currentTarget }) {
            if (target === currentTarget) this.carrinhoAtivo = false
        },
        adicionarItem() {
            this.produto.estoque--
            const { nome, id, preco } = this.produto
            this.carrinho.push({ id, nome, preco })
            this.alerta(`${nome} foi adicionado ao carrinho`)
        },
        removerItem(index) {
            console.log("AAA");

            this.carrinho.splice(index, 1)
        },
        checarLocalStorage() {
            if (window.localStorage.carrinho) {
                this.carrinho = JSON.parse(window.localStorage.carrinho)
            }
        },
        alerta(mensagem) {
            this.mensagemAlerta = mensagem
            this.alertaAtivo = true
            setTimeout(() => {
                this.alertaAtivo = false
            }, 1500)
        },
        router() {
            const hash = document.location.hash;
            if (hash) {
                this.puxarProduto(hash.replace("#", ""))
            }
        }

    },
    watch: {
        produto() {
            document.title = this.produto.nome || "Techno"
            const hash = this.produto.id || ""
            history.pushState(null, null, `#${hash}`)
        },
        carrinho() {
            window.localStorage.carrinho = JSON.stringify(this.carrinho)
        }
    },
    created() {
        this.puxarProdutos()
        this.checarLocalStorage()
        this.router()
    }


})