# Mimices — plano e estado

Escrito a 15–16 out 2026, no arranque. Pedido do Renato (15 out, 23:4x): um site e-commerce **sem
pagamentos no site** (o botão «Encomendar» abre o WhatsApp com o resumo da encomenda para a dona), com
um **backoffice próprio** para a Mimices ser totalmente autónoma; o domínio será **mimices.pt**,
comprado no fim. «Estuda muito bem a empresa, estuda sobre design de websites.»

## 1. O que a cliente disse (WhatsApp «Mimices Site», 14–15 out 2026)

A conversa transcrita, os 2 áudios do Renato (transcritos), as 40 fotografias e os 6 vídeos estão em
`_cliente/whatsapp/2026-10-15/`.

- **Quem:** Susana (a dona; tem outro trabalho). Telemóvel/WhatsApp **961 022 575**,
  mimices1720@gmail.com. Instagram **@_mimices** (2 434 seguidores, 2 744 publicações), Facebook
  **mimicesdospequenotes** (28 mil seguidores; 103 opiniões, 96 % recomendam; categoria «Loja de
  recordações»; área de serviço **Quinta do Conde · Vila Nogueira de Azeitão**; pagamentos
  «transferência ou MBWay»).
- **Foco:** «venda de conjuntos de Batismo e Lembranças». Coleções pontuais (Natal, Páscoa, final de
  ano letivo), mas «estamos a reduzir variedade e o principal foco ser mesmo os Batizados».
- **Desenho:** «Gostei muito da estrutura do site dos candeeiros» = **ithos-cathelier.pt** (o áudio
  do Renato das 10:19 confirma-o).
- **Modelo comercial (áudios do Renato, 15 out):** o «modelo A», o da Pokóto Wood: 100 €/ano + 50 € no
  1.º ano (domínio, alojamento, suporte e backoffice incluídos); carrinho que acaba no WhatsApp. Só
  pagam com o site pronto e no Google. O Renato vai ao México a 23 out (2 semanas) e termina antes.

## 2. O que se estudou

- **A empresa** (um ano de Instagram, 444 publicações, e o Facebook): o catálogo, o estilo (madeira
  natural, laços de linho, bordados em tons nude, «simplicidade natural que o torne elegante»), o
  processo («trabalho de equipa entre nós e o cliente»), o «recomeço» de agosto de 2026 (menos
  variedade, foco nos batizados), a paleta oficial de **14 tons de linho** com sugestões para menino,
  menina e neutro.
- **Concorrência, UX e legal:** `~/Websites/research_notes/Mimices/` (`concorrencia.md`, `ux.md`,
  `legal.md`, 16 out 2026). Em resumo: conjunto completo 95–160 € no mercado; ninguém mostra a
  personalização antes de encomendar; peças com nome não têm livre resolução (com a cor só, têm);
  velas com avisos da EN 15494 e fabricante à vista (RGSP, art. 19.º); gesso perfumado e velas
  perfumadas podem cair no CLP; toalhas com a composição no site.

## 3. Decisões tomadas por mim (dizer ao Renato; fáceis de mudar)

- **Base do código:** a da Pokóto Wood (gerador estático, carrinho → WhatsApp, páginas legais,
  regras partilhadas com o painel). **Desenho:** a arrumação do ithos (Menu à esquerda, logótipo ao
  centro, carrinho à direita; capa a toda a largura; grelhas de quatro; «Olá»; rodapé em quatro
  colunas; caixa de confiança na ficha), com as **cores da Mimices** (marfim do linho, o rosa da mancha
  do logótipo, o malva do laço) e as letras do ithos (Cormorant Garamond + Montserrat). Contrastes
  medidos (ver o cabeçalho de `src/estilos/site.css`).
- **Logótipo:** o do Facebook (1081 px), só com o branco tirado (`scripts/preparar-fotos.py`). Falta o
  ficheiro original.
- **Capa:** a capa do Facebook da Mimices (8 velas com laços de linho), com o texto num painel liso.
- **Fotografias:** as 40 do WhatsApp (sem crianças; ficaram de fora 2 capturas de ecrã e as molduras
  com fotografias de crianças) e a primeira imagem de 30 publicações do Instagram (1440 px). A do bebé
  com a touca ficou de fora (autorização de imagem é por uso).
- **Catálogo (21 artigos):** Batismo (conjunto com caixa, conjunto vela+toalha+concha, vela, vela e
  concha, toalha, caixa, convite), Lembranças (íman com nome em acrílico, íman com pomba, madeira
  gravada, íman ursinho, gesso perfumado, oração do Anjo da Guarda, velinha, porta-chaves) e Natal (velas
  do Advento 4 semanas e 25 dias, vela da professora, enfeite com nome, postal com pendente, decoração
  «Família»). Os nomes e os textos são meus, a partir das legendas dela: **a Susana confirma**.
- **Portes por encomenda** (não por peça), com «grátis a partir de» opcional no continente.
- **Nenhuma escolha marcada à partida** (tom, desenho, acrílico): obriga a escolher e evita encomendas
  erradas (pesquisa de UX). Os preços com acréscimo dizem «Desde».
- **Opiniões no site:** ficam para depois (a Pokóto tem o sistema; trazê-lo com o painel).

## 4. Perguntas para a Susana (o que trava o site no domínio)

1. **Preços** de cada artigo (e dos acréscimos, se houver: caixa com tampa de vidro, desenhos). Para as
   lembranças: o preço por unidade e o **mínimo** (o mercado usa 10).
2. **Prazo** de produção e entrega («cada conjunto fica pronto em … semanas») e com quanta
   antecedência pede as encomendas.
3. **Portes:** continente e ilhas (e se há portes grátis a partir de um valor). Envia para Espanha?
4. **Dados legais:** nome (empresa ou empresário em nome individual), **NIF**, **morada** (a que pode
   ser publicada; aparece em cada ficha como «Feito por»), IVA incluído ou isento (art. 53.º).
5. **Composição das toalhas** (ex.: «100 % algodão») e dos laços («linho» só se for mesmo linho).
6. **Fragrâncias:** que velas e gessos leva perfume ou óleo essencial, de que fornecedor (as fichas de
   segurança). Sem fragrância, o CLP não se aplica.
7. **Mostra a maquete** antes de fazer? (O texto diz que confirmamos o nome, a data e as cores pelo
   WhatsApp antes de começar.)
8. **Logótipo original** e, se possível, as fotografias originais (as do WhatsApp chegam comprimidas).
9. **Nomes dos artigos e textos**, e se o catálogo está certo (falta algum? sobra algum? a coleção de
   Natal fica visível?). E a **touca de batismo**, o **livro de honra** e os **convites**: vendem-se?
10. **Email do backoffice** (o mimices1720@gmail.com?) e quem entra.

## 5. O que falta fazer

- [ ] Publicar a pré-visualização (GitHub Pages) e mostrar à Susana.
- [ ] **Painel (backoffice)** `mimices-painel`, a partir do `pokoto-painel`, com os campos novos
      (tons de linho, escolhas, personalização por campos, quantidade mínima, portes da loja,
      composição).
- [ ] Testes: as regras e o caminho do cliente (os da Pokóto não servem ao modelo novo).
- [ ] Domínio mimices.pt → Cloudflare (site + painel), Search Console, IndexNow.
- [ ] Opcional: pré-visualização do nome na peça (diferenciador: nenhuma concorrente a tem); «pronto
      a partir de» com data; filtro por ocasião (batismo, comunhão, casamento).
