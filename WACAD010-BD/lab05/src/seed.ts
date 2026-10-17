import { PrismaClient } from '@prisma/client'
import { fakerPT_BR as faker } from '@faker-js/faker'

const prisma = new PrismaClient()

const catalogo: Record<string, string[]> = {
  'Eletrônicos': ['Celulares', 'TVs', 'Áudio'],
  'Informática': ['Notebooks', 'Periféricos', 'Monitores'],
  'Eletrodomésticos': ['Cozinha', 'Limpeza', 'Climatização'],
}

async function main() {
  // limpa na ordem das chaves estrangeiras (permite rodar o seed várias vezes)
  await prisma.itemCompra.deleteMany()
  await prisma.compra.deleteMany()
  await prisma.produtoNumeroSerie.deleteMany()
  await prisma.produto.deleteMany()
  await prisma.fabricante.deleteMany()
  await prisma.subcategoria.deleteMany()
  await prisma.categoria.deleteMany()
  await prisma.endereco.deleteMany()
  await prisma.cliente.deleteMany()

  // categorias e subcategorias
  const subIds: number[] = []
  for (const [nome, subs] of Object.entries(catalogo)) {
    const cat = await prisma.categoria.create({
      data: {
        nome,
        subcategorias: {
          create: subs.map((s) => ({ nome: s, descricao: `Produtos de ${s.toLowerCase()}` })),
        },
      },
      include: { subcategorias: true },
    })
    cat.subcategorias.forEach((s) => subIds.push(s.id_subcategoria))
  }

  // fabricantes
  const fabIds: number[] = []
  for (let i = 0; i < 5; i++) {
    const f = await prisma.fabricante.create({
      data: { nome: faker.company.name().slice(0, 100), cnpj: String(10000000000000 + i) },
    })
    fabIds.push(f.id_fabricante)
  }

  // produtos, cada um com 1 a 3 números de série
  for (let i = 0; i < 30; i++) {
    const qtdSeries = faker.number.int({ min: 1, max: 3 })
    await prisma.produto.create({
      data: {
        modelo: faker.commerce.productName().slice(0, 100),
        preco_base: Number(faker.commerce.price({ min: 50, max: 5000 })),
        qtd_disponivel: faker.number.int({ min: 0, max: 100 }),
        id_subcategoria: faker.helpers.arrayElement(subIds),
        id_fabricante: faker.helpers.arrayElement(fabIds),
        numeros_serie: {
          create: Array.from({ length: qtdSeries }, (_, k) => ({ numero_serie: `SN-${i + 1}-${k + 1}` })),
        },
      },
    })
  }

  // clientes, cada um com 1 ou 2 endereços
  const clientes = []
  for (let i = 0; i < 15; i++) {
    const qtdEnd = faker.number.int({ min: 1, max: 2 })
    const c = await prisma.cliente.create({
      data: {
        nome: faker.person.fullName().slice(0, 100),
        cpf: String(10000000000 + i),
        celular: faker.string.numeric(11),
        email: `cliente${i + 1}@exemplo.com`,
        d_nascimento: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
        enderecos: {
          create: Array.from({ length: qtdEnd }, () => ({
            rua: faker.location.street(),
            numero: String(faker.number.int({ min: 1, max: 999 })),
            bairro: faker.helpers.arrayElement(['Centro', 'Flores', 'Cidade Nova', 'Adrianópolis', 'Parque 10']),
            cidade: faker.location.city().slice(0, 60),
            estado: faker.location.state({ abbreviated: true }),
            cep: faker.string.numeric(8),
          })),
        },
      },
      include: { enderecos: true },
    })
    clientes.push(c)
  }

  // compras com itens (produtos distintos em cada compra)
  const produtos = await prisma.produto.findMany()
  for (let i = 0; i < 40; i++) {
    const cliente = faker.helpers.arrayElement(clientes)
    const endereco = faker.helpers.arrayElement(cliente.enderecos)
    const escolhidos = faker.helpers.arrayElements(produtos, faker.number.int({ min: 1, max: 4 }))

    const itens = escolhidos.map((p) => ({
      id_produto: p.id_produto,
      quantidade: faker.number.int({ min: 1, max: 5 }),
      preco_unitario: Number(p.preco_base),
    }))
    const subtotal = itens.reduce((soma, it) => soma + it.quantidade * it.preco_unitario, 0)
    const desconto = Number((subtotal * faker.helpers.arrayElement([0, 0, 0.05, 0.1])).toFixed(2))

    await prisma.compra.create({
      data: {
        id_cliente: cliente.id_cliente,
        id_endereco: endereco.id_endereco,
        forma_pagamento: faker.helpers.arrayElement(['PIX', 'Cartão de crédito', 'Cartão de débito', 'Boleto']),
        desconto,
        total: Number((subtotal - desconto).toFixed(2)),
        itens: { create: itens },
      },
    })
  }

  console.log('Seed concluído: 3 categorias, 9 subcategorias, 5 fabricantes, 30 produtos, 15 clientes, 40 compras.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())