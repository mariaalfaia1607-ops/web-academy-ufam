-- CreateTable
CREATE TABLE `cliente` (
    `id_cliente` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `cpf` CHAR(11) NOT NULL,
    `celular` VARCHAR(20) NULL,
    `email` VARCHAR(120) NOT NULL,
    `d_nascimento` DATE NULL,

    UNIQUE INDEX `cliente_cpf_key`(`cpf`),
    UNIQUE INDEX `cliente_email_key`(`email`),
    PRIMARY KEY (`id_cliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `endereco` (
    `id_endereco` INTEGER NOT NULL AUTO_INCREMENT,
    `id_cliente` INTEGER NOT NULL,
    `rua` VARCHAR(120) NOT NULL,
    `numero` VARCHAR(10) NOT NULL,
    `complemento` VARCHAR(60) NULL,
    `bairro` VARCHAR(60) NOT NULL,
    `cidade` VARCHAR(60) NOT NULL,
    `estado` CHAR(2) NOT NULL,
    `cep` CHAR(8) NOT NULL,

    INDEX `endereco_id_cliente_idx`(`id_cliente`),
    PRIMARY KEY (`id_endereco`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria` (
    `id_categoria` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(60) NOT NULL,

    UNIQUE INDEX `categoria_nome_key`(`nome`),
    PRIMARY KEY (`id_categoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subcategoria` (
    `id_subcategoria` INTEGER NOT NULL AUTO_INCREMENT,
    `id_categoria` INTEGER NOT NULL,
    `nome` VARCHAR(60) NOT NULL,
    `descricao` VARCHAR(255) NULL,

    INDEX `subcategoria_id_categoria_idx`(`id_categoria`),
    PRIMARY KEY (`id_subcategoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fabricante` (
    `id_fabricante` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `cnpj` CHAR(14) NOT NULL,

    UNIQUE INDEX `fabricante_cnpj_key`(`cnpj`),
    PRIMARY KEY (`id_fabricante`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produto` (
    `id_produto` INTEGER NOT NULL AUTO_INCREMENT,
    `id_subcategoria` INTEGER NOT NULL,
    `id_fabricante` INTEGER NOT NULL,
    `modelo` VARCHAR(100) NOT NULL,
    `preco_base` DECIMAL(10, 2) NOT NULL,
    `qtd_disponivel` INTEGER NOT NULL DEFAULT 0,

    INDEX `produto_id_subcategoria_idx`(`id_subcategoria`),
    INDEX `produto_id_fabricante_idx`(`id_fabricante`),
    PRIMARY KEY (`id_produto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produto_numero_serie` (
    `id_produto` INTEGER NOT NULL,
    `numero_serie` VARCHAR(60) NOT NULL,

    PRIMARY KEY (`id_produto`, `numero_serie`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compra` (
    `id_compra` INTEGER NOT NULL AUTO_INCREMENT,
    `id_cliente` INTEGER NOT NULL,
    `id_endereco` INTEGER NOT NULL,
    `data_hora` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `desconto` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `forma_pagamento` VARCHAR(30) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,

    INDEX `compra_id_cliente_idx`(`id_cliente`),
    INDEX `compra_id_endereco_idx`(`id_endereco`),
    PRIMARY KEY (`id_compra`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_compra` (
    `id_item` INTEGER NOT NULL AUTO_INCREMENT,
    `id_compra` INTEGER NOT NULL,
    `id_produto` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `preco_unitario` DECIMAL(10, 2) NOT NULL,

    INDEX `item_compra_id_produto_idx`(`id_produto`),
    UNIQUE INDEX `item_compra_id_compra_id_produto_key`(`id_compra`, `id_produto`),
    PRIMARY KEY (`id_item`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `endereco` ADD CONSTRAINT `endereco_id_cliente_fkey` FOREIGN KEY (`id_cliente`) REFERENCES `cliente`(`id_cliente`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subcategoria` ADD CONSTRAINT `subcategoria_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `categoria`(`id_categoria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produto` ADD CONSTRAINT `produto_id_subcategoria_fkey` FOREIGN KEY (`id_subcategoria`) REFERENCES `subcategoria`(`id_subcategoria`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produto` ADD CONSTRAINT `produto_id_fabricante_fkey` FOREIGN KEY (`id_fabricante`) REFERENCES `fabricante`(`id_fabricante`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produto_numero_serie` ADD CONSTRAINT `produto_numero_serie_id_produto_fkey` FOREIGN KEY (`id_produto`) REFERENCES `produto`(`id_produto`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `compra` ADD CONSTRAINT `compra_id_cliente_fkey` FOREIGN KEY (`id_cliente`) REFERENCES `cliente`(`id_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `compra` ADD CONSTRAINT `compra_id_endereco_fkey` FOREIGN KEY (`id_endereco`) REFERENCES `endereco`(`id_endereco`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_compra` ADD CONSTRAINT `item_compra_id_compra_fkey` FOREIGN KEY (`id_compra`) REFERENCES `compra`(`id_compra`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_compra` ADD CONSTRAINT `item_compra_id_produto_fkey` FOREIGN KEY (`id_produto`) REFERENCES `produto`(`id_produto`) ON DELETE RESTRICT ON UPDATE CASCADE;
