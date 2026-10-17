# Mimices — o site

Loja da **Mimices** (Susana; Quinta do Conde e Azeitão, distrito de Setúbal): conjuntos de batismo
personalizados (vela, toalha bordada, concha e caixa de madeira, nos tons de linho que a cliente
escolhe), lembranças para os convidados e uma coleção de Natal.

**Não há pagamentos no site.** O carrinho junta as peças (com o tom de linho, as escolhas e o nome e a
data de cada uma), soma os portes da entrega escolhida e acaba no WhatsApp, com a encomenda escrita
numa mensagem para a Susana. A encomenda fica feita quando a Mimices a confirma por lá.

- **https://mimices.pt** (comprado a 16 out 2026 na Hostinger; zona na Cloudflare do Renato,
  kelly/toby): o Worker `mimices-site` (`wrangler.jsonc`, `worker/www.js`), publicado pelo CI. Por
  agora com `--dominio`: na raiz, mas fechado aos motores de busca e com o que falta «[por
  confirmar]», até a Susana dar os dados legais (nome, NIF, morada, IVA), o prazo e os portes —
  aí passa a `--producao`. A antiga pré-visualização (renatovalente5.github.io/mimices/)
  reencaminha cada morada para o domínio.
- Estrutura de desenho escolhida pela cliente: a do **https://ithos-cathelier.pt/** («o site dos
  candeeiros»), com as cores e as letras da Mimices. Refeita a 16 out 2026 a pedido do Renato
  («cores melhores», «um vídeo na capa como no ithos», «poucas secções»): fundo branco, a capa com
  um filme, e na página inicial só os conjuntos, o «Olá» da Susana e as lembranças.
- Plano, decisões e perguntas em aberto: [`docs/PLANO.md`](docs/PLANO.md)
- A base do código é a da Pokóto Wood (`~/Websites/pokoto-wood`), adaptada.

## Como se constrói

Node 22 e Python 3 com Pillow. Sem dependências npm.

```bash
node scripts/build.mjs                        # local → _site/ (servir em http://localhost:4830)
python3 -m http.server 4830 --directory _site
node scripts/build.mjs --dominio               # mimices.pt ainda fechado aos motores de busca (o CI, por agora)
node scripts/build.mjs --producao              # mimices.pt aberto (recusa dados legais por preencher)
node scripts/build.mjs --base=/mimices         # a antiga pré-visualização no GitHub Pages
```

O GitHub Actions (`.github/workflows/publicar.yml`) constrói o site e publica-o na Cloudflare a cada
push e todos os dias à meia-noite de Lisboa (o segredo `CLOUDFLARE_API_TOKEN`, criado pelo Renato, e
a variável `CLOUDFLARE_ACCOUNT_ID`).

## Onde está cada coisa

| | |
|---|---|
| `content/site.json` | marca, contactos, dados legais, aviso do topo, **tons de linho**, zonas de entrega, portes, prazos, pagamento |
| `content/produtos/*.json` | um ficheiro por artigo (o nome do ficheiro é o endereço) |
| `content/categorias.json` | Batismo, Lembranças, Natal |
| `content/inicio.json` | os textos e as fotografias da página inicial |
| `content/paginas/*.md` | páginas de texto (sobre nós, como encomendar, legais…), com marcadores `{{…}}` |
| `content/fotos.json` | texto alternativo e ponto de foco de cada fotografia |
| `media/fotos/` | as fotografias (as versões web faz o `scripts/imagens.py`) |
| `media/video/` | vídeos (MP4 sem som) e a imagem de capa de cada um |
| `media/marca/logo.png` | o logótipo (o do Facebook da Mimices, só com o branco tirado) |
| `media/capa/` | o filme da capa (dois cortes: largo 16:9 e alto 2:3) e o primeiro fotograma de cada um |
| `scripts/filme.py` | faz o filme da capa a partir de seis fotografias (`/usr/bin/python3 scripts/filme.py`) |
| `src/lib/regras.mjs` | as regras dos dados: as mesmas no gerador e (quando existir) no painel |
| `scripts/preparar-fotos.py` | a importação inicial das fotografias e do logótipo, a partir de `_cliente/` |

O FILME DA CAPA é feito das fotografias da Susana, com um movimento de câmara lento e
transições suaves, em ciclo (22,8 s). Os seis vídeos que ela mandou foram medidos e postos de parte:
filmados à mão, tremem, e têm 480 px. Para mudar os planos: a lista `PLANOS` no `scripts/filme.py`
(`--amostra` mostra o início e o fim de cada um), e depois correr o script outra vez. Na página, o
filme só arranca com JavaScript, sem «reduzir movimento» e sem poupança de dados, e tem um botão de
pausa; por baixo está sempre a imagem parada.

O material do cliente (conversa do WhatsApp, fotografias originais, vídeos, áudios, publicações das
redes) está em `_cliente/`, fora do git. As notas de pesquisa (concorrência, UX, legal) estão em
`~/Websites/research_notes/Mimices/`.

## O modelo de um artigo

Além do nome, das fotografias, dos textos e do preço (com promoção):

- `inclui` — a lista do que vem (num conjunto);
- `composicao` — a composição dos tecidos (obrigatória por lei nos artigos com toalha);
- `cores: true` — a ficha pede o tom de linho (os 14 tons de `site.json`, pelo número);
- `opcoes` — até 3 escolhas com valores e acréscimo (ex.: «Desenho da caixa»: Sol e lua, Ramos, Simples);
- `personalizacao` — os campos que a ficha pede: `nome`, `data` (obrigatórios quando ligados) e `frase`
  (opcional), com rótulos próprios (`rotuloNome`: «Nome da professora»);
- `quantidadeMinima` — nas lembranças (o preço passa a ser «/ unidade»).

## Regras que o gerador faz cumprir

- Os dados legais (identificação, NIF, morada, WhatsApp, prazos, pagamento) vêm só de
  `content/site.json`, por marcadores. Em pré-visualização o que falta aparece «[por confirmar: …]»;
  em produção a construção pára.
- Sem preço, um artigo aparece na pré-visualização com «Preço por confirmar» e fica escondido em
  produção. O mesmo para a composição de uma toalha.
- Sem alegações ambientais genéricas nem certificações que não temos (Diretiva (UE) 2024/825).
- Todas as fichas dizem quem fabrica, com a morada e o email (Regulamento (UE) 2023/988,
  art. 19.º). Os avisos de segurança das velas (EN 15494) saíram das fichas a 17 out 2026, a
  pedido do Renato; o mesmo artigo (al. d)) pede-os na oferta à distância, e o bloco está no
  commit 396e7e9 se voltarem.
- Toda a ligação interna, imagem e cartão de partilha tem de existir; nenhuma página sai com
  `undefined`, `NaN` ou `{{`.
