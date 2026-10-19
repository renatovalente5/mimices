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

## 3-A. Refeito a 16 out 2026 (pedido do Renato)

«Não adorei o site, consegues refazer e melhorar, usar umas cores melhores e na foto de capa quero
um Video como no ITHos, Cria tu o Vídeo. E quero poucas seções no site como no Ithos, às vezes
simples é mais!»

- **Cores:** fundo branco (o creme confundia-se com as fotografias de linho), tinta quase preta,
  rosa-terracota da marca (#97564F) nos botões, preços e ligações, linho claro (#F7F3EE) nas
  secções suaves e no rodapé. Contrastes no cabeçalho do site.css.
- **A capa é um filme** (`scripts/filme.py`): seis fotografias da Susana com um movimento lento de
  câmara, dissolvidas umas nas outras, em ciclo, num corte largo (1600×900, 3 MB) e num alto
  (720×1080, 1,9 MB). Os vídeos dela não serviam: tremem (medido) e têm 480 px. Por cima, um véu
  branco a 48 % e só o título e o botão (o véu escuro do ithos punha os tons pastel cinzentos).
- **Página inicial:** só a capa, «Conjuntos de batismo», o «Olá» da Susana e as lembranças. Saíram
  os tons de linho (ficam na ficha e na página própria), o Natal (fica no menu), os passos de «Como
  encomendar» (página própria) e o bloco do Instagram (está no rodapé).
- **Cartões** sem as bolinhas dos tons (eram iguais em todos). **Ficha:** as amostras só com a cor
  (o nome aparece ao escolher), ajudas mais curtas, sem a caixa de fundo nem o acordeão da
  personalização.
- **17 out 2026 (Renato):** o nome do tom numa dica própria, que aparece logo ao passar o rato (o
  «title» do browser levava cerca de 1 s); e **sem os avisos de segurança das velas**, a pedido
  dele. O RGSP (art. 19.º, al. d)) pede-os na oferta à distância: o bloco está no commit 396e7e9.
- **Rodapé refeito (17 out 2026, Renato: «Não gosto nada do rodapé… E falta o Logo»; «Podes ver os
  rodapés de outras aplicações minhas»):** na arrumação dos rodapés da Pokóto, da Pau Ferro e da AMMA.
  À esquerda o logótipo, a assinatura e as redes; ao lado «Loja», «A Mimices» e «Contactos»; as
  páginas legais numa linha, com o Livro de Reclamações num botão. Fundo de linho: no rosa claro a
  mancha do logótipo some, e num fundo escuro o «M» e o «s», que saem da mancha, deixam de se ler.
- **Mais tarde no mesmo dia** («Não gosto de como está a ficar, improvisa… sem ser baseado nos meus
  outros projetos»): uma linguagem da própria marca — a MANCHA do logótipo, o PESPONTO das toalhas
  e o LAÇO (cabeçalho de site.css). O menu ficou com as categorias em fotografias recortadas em
  mancha e as páginas ao centro, na letra dos títulos. O rodapé: um centrado foi rejeitado («muito
  grande… gostei mais do outro. Deste gosto das ondinhas e dos traços»), e ficou o de colunas com a
  orla recortada e o pesponto. O WhatsApp passou a ir só como ligação, sem o número; o telefone
  leva «(Chamada para a rede móvel nacional)» entre parênteses e mais pequeno, em todo o site.
- **As páginas, na mesma linguagem** («melhora também as páginas do site, pensa bem como o fazer»):
  a cabeça de cada página ao centro, com o título numa mancha rosa, um subtítulo curto (`subtitulo:`
  no Markdown) ou a data nas legais, e o laço entre pespontos. «Como encomendar» (`modelo: passos`):
  os passos ligados por um pesponto, cada número numa mancha de um tom de linho, e o resto em
  cartões. «Perguntas frequentes» (`modelo: perguntas`): abrem e fecham. Contactos com o WhatsApp à
  cabeça. Os tons de linho em manchas (três por fila no telemóvel). O carrinho vazio e a página que
  não existe mostram as categorias. As páginas que não são legais acabam num convite (WhatsApp e loja).
- **A barra de cima, como a do ithos:** no topo sem chão (na inicial sobre o filme), ao descer vidro
  fosco, uma sombra e mais baixa. O botão de parar o filme saiu da vista (fica para o teclado).

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

## 4-A. O que a Susana respondeu (WhatsApp, 16 out 2026, 14:40–14:49) — já no site

- **Domínio:** «Posso comprar o domínio mimices.pt?» — «Sim sim» (10:49). Compra-o o Renato.
- **Tipo de loja:** perguntou o que é melhor (pagamento no site ou WhatsApp); o Renato explicou o
  preço (e-commerce: 100 €/ano + 200 € no 1.º ano, e taxas) e ficaram de falar depois das 15h. O
  site continua no modelo A (WhatsApp) até decidirem.
- **Conjuntos:** 64 € a base (toalha em algodão com linho ou 100 % linho, bordada na cor pretendida;
  vela com o nome gravado e laço em 100 % linho; concha natural com laço em 100 % linho), e os
  extras: caixa de madeira de tampa de encaixe, natural ou branca, 18 €, ou com fecho ou tampa de
  vidro, 20 €; toalha 100 % linho + 3 €; flores secas na vela e na concha + 1,50 €; corda na vela
  + 1,50 € (14 voltas) ou + 3 € (até meio da vela). No site: «Conjunto de Batismo» desde 64 € e
  «Conjunto de Batismo com Caixa» desde 82 €, com os extras como escolhas (o «Conjunto Tomás» dela,
  86,50 €, e o «Conjunto Daniel», 67 €, saem certos no carrinho — provado).
- **Vela:** desde 23 € (com as flores e a corda como escolhas, os mesmos acréscimos do conjunto:
  CONFIRMAR com ela). **A vela e concha «Eva»: eliminar** (descontinuada) — saiu, com as duas
  fotografias.
- **Lembranças:** 1,90 € cada; o íman ursinho e a de gesso perfumado 2,10 €.
- **Natal:** 4 velas (Advento) 17,80 €; vela do Advento (25 dias) 17,40 €; vela da professora
  4,80 €; enfeite em linho alentejano bordado 7,40 € (o artigo passou a chamar-se assim, só com a
  fotografia do bastidor de linho); postal com gesso 3,50 €; decoração «Família» 3,50 €.
- **Entrega:** CTT Expresso, ou levantamento grátis em **Azeitão** (o site dizia Quinta do Conde).
- **Ainda por saber:** o preço da toalha sozinha, da caixa sozinha e do convite; quanto custam os
  portes do CTT Expresso; o prazo; as percentagens da toalha de algodão com linho (a lei pede-as,
  ex.: «55 % linho, 45 % algodão»); se há mínimo de unidades nas lembranças; se o porta-chaves, a
  velinha e a oração do Anjo da Guarda são mesmo 1,90 €; os dados legais e o IVA.

## 4-B. O que a Susana respondeu a 19 out 2026 (WhatsApp, 09:42) — já no site

- **Prazo:** «depende do tipo de trabalho mas apontar 15 dias» → «Cada encomenda fica pronta em cerca de
  15 dias, conforme a peça.»
- **Portes (CTT Expresso):** continente 4,80 €, ilhas 10,80 € («depende do peso normalmente»): os textos
  dizem que numa encomenda maior os portes podem subir e que se confirma o valor antes do pagamento.
- **Toalha sozinha:** algodão 24 €, linho 28 € (escolha «100 % linho» + 4 €). **As toalhas são 100 %
  algodão ou 100 % linho** (não «algodão com linho»): a composição e as escolhas dos conjuntos mudaram.
- **Convite:** desde 1,90 € (a ficha diz que o preço final depende do modelo).
- **Quem faz as peças:** «Morada apenas Azeitão quem faz as peças Susana» → empresa.nome «Susana» e
  empresa.localidade «Azeitão». Sem atividade aberta (encerrou-a: a empresa onde trabalhava entrou em
  insolvência), por isso sem NIF nem IVA: os termos já não mostram «por confirmar» para eles.
- **Ainda sem resposta:** o preço da caixa sozinha. **Pedidos dela:** juntar mais fotografias; e trocar a
  coleção de Natal pela de Páscoa (e assim por diante) no painel — o Renato prometeu que ela o pode fazer.

## 4-C. As fotografias e a pasta de acessórios (WhatsApp, 19 out 2026, 10:51–12:06) — já no site

- «Gostava de uma pasta com acessórios/complementos: cinto para vestido igual à vela» → categoria nova
  **Acessórios** (entre as lembranças e o Natal) com o cinto (100 % linho, como os laços), a coroa de
  flores e a touca, sem preço por enquanto. Ficaram de fora duas fotografias com bebés.
- O quadro dos cinco modelos de toalha → na ficha da toalha.
- Convites (4), lembranças (7; uma já estava no site) e Natal (os guardanapos e enfeites bordados) → nas
  fichas desses artigos. Duas peças novas, sem preço: o enfeite de Natal (rena) para a professora e o jogo
  do galo personalizado.
- O menu passa a mostrar quatro categorias numa fila.
- Originais em `_cliente/whatsapp/2026-10-19/`.
- **Os preços (13:27–13:30):** cinto 100 % linho 12 €; coroa de flores preservadas 15,80 €; touca 18,80 €;
  enfeite de Natal para a professora 3,50 €; jogo do galo 2,90 €; caixa de madeira personalizada «desde 23»
  (23 € com tampa de encaixe; + 2 € com fecho ou tampa de vidro, como no conjunto).

## 4-D. Aberto ao Google (19 out 2026)

«Sim abre já o site sem NIF» … «A Susana responsabiliza-se». O `publicar.yml` constrói com `--producao`
(sem noindex, robots aberto, sitemap e a chave do IndexNow). As regras (regras.mjs) deixaram de pedir o NIF
e o IVA (a Mimices não tem atividade aberta), e a morada pede pelo menos a localidade. O painel tem de
receber a cópia nova das regras e o SITE_PRODUCAO = "1".

## 5. O que falta fazer

- [x] Publicar a pré-visualização (GitHub Pages).
- [x] Refazer o desenho (16 out): cores, filme na capa, menos secções.
- [ ] Mostrar à Susana (o Renato decide quando).
- [ ] **Painel (backoffice)** `mimices-painel`, a partir do `pokoto-painel`, com os campos novos
      (tons de linho, escolhas, personalização por campos, quantidade mínima, portes da loja,
      composição).
- [ ] Testes: as regras e o caminho do cliente (os da Pokóto não servem ao modelo novo).
- [ ] Domínio mimices.pt → Cloudflare (site + painel), Search Console, IndexNow.
- [ ] Opcional: pré-visualização do nome na peça (diferenciador: nenhuma concorrente a tem); «pronto
      a partir de» com data; filtro por ocasião (batismo, comunhão, casamento).
