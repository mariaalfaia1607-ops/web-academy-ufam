import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categoria = await prisma.categoria.create({
    data: { nome: 'Eletrônicos' },
  })
  const sub = await prisma.subcategoria.create({
    data: { nome: 'Celulares', id_categoria: categoria.id_categoria },
  })
  const fab = await prisma.fabricante.create({
    data: { nome: 'Samsung', cnpj: '12345678000199' },
  })
  const produto = await prisma.produto.create({
    data: {
      modelo: 'Galaxy A55',
      preco_base: 1999.9,
      qtd_disponivel: 10,
      id_subcategoria: sub.id_subcategoria,
      id_fabricante: fab.id_fabricante,
      numeros_serie: { create: [{ numero_serie: 'SN-001' }, { numero_serie: 'SN-002' }] },
    },
  })
  console.log(produto)
}

main().finally(() => prisma.$disconnect())