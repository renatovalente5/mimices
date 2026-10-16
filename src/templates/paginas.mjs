// As páginas do site. Cada função devolve { caminho, titulo, descricao, conteudo, ... } e o
// build.mjs veste-a com a moldura (layout.mjs).
import { esc, euros, precoDe, markdown, inline, textoSimples, numeroWhatsApp, moradaCompleta } from './util.mjs';
import { icones } from './icones.mjs';
import { numeroPortugues, opcoesDe, personalizacaoDe, quantidadeMinimaDe, temSuplementos } from '../lib/regras.mjs';
import { imagem, preco, cartaoProduto, migalhas, botaoSeta, desconto, promocaoAte } from './componentes.mjs';
import { categoriasComArtigos } from './layout.mjs';

const produtosDe = (ctx, cat) => ctx.produtos.filter((p) => p.categoria === cat);
const categoriaDe = (ctx, slug) => ctx.categorias.find((c) => c.slug === slug);
const paragrafos = (t) => String(t || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('');

/* A primeira frase do prazo de produção (mostra-se na ficha e no carrinho): «Cada conjunto fica
   pronto em …». Sem prazo dito, a marca «por confirmar» (em produção a construção pára antes). */
const prazoCurto = (ctx) => String(ctx.site.entrega.prazo || '').trim().split(/(?<=\.)\s+/)[0];

// ---------------------------------------------------------------- página inicial
/* A CAPA, como a do ithos: um filme a toda a largura, uma frase e um botão por cima (16 out 2026, a
   pedido do Renato: «na foto de capa quero um vídeo como no ithos»). O filme é o do
   scripts/filme.py, em dois cortes (largo e alto), e por baixo dele está o seu primeiro fotograma:
   é o que se vê antes de ele arrancar, e o que fica para quem pediu menos movimento ou poupa dados
   (o site.js decide). Com o filme desligado (capa.filme: false), a fotografia da capa.
   AS PALAVRAS ASSENTAM NUM VÉU BRANCO LISO por cima da capa inteira, com uma opacidade declarada
   (memória texto-sobre-fotografia-precisa-de-chao): o pior chão possível debaixo de um véu branco é
   um pixel preto, e mesmo aí a tinta fica a 3,3:1 (texto grande: 3:1). Um véu escuro, como o do
   ithos, punha os tons pastel do linho cinzentos. */
const CORTE_ALTO_ATE = '48rem';   // abaixo, o corte alto do filme e a imagem alta; a partir dele, os largos (o CSS usa o mesmo)
function imagemDaCapa(ctx, f, alt) {
  const largo = ctx.manifesto.capa[f.largo.imagem];
  const alto = ctx.manifesto.capa[f.alto.imagem];
  const srcset = (nome, m, fmt) => m.larguras.map((w) => `${ctx.asset(`img/${nome}-${m.resumo}-${w}.${fmt}`)} ${w}w`).join(', ');
  const fontes = (nome, m, media) => m.formatos.map((fmt) => `<source${media ? ` media="${media}"` : ''} type="image/${fmt}" srcset="${srcset(nome, m, fmt)}" sizes="100vw">`).join('');
  const meio = alto.larguras.find((w) => w >= 720) || alto.larguras[alto.larguras.length - 1];
  return `<picture class="capa__imagem">${fontes(f.largo.imagem, largo, `(min-width: ${CORTE_ALTO_ATE})`)}${fontes(f.alto.imagem, alto, '')}<img src="${ctx.asset(`img/${f.alto.imagem}-${alto.resumo}-${meio}.webp`)}" width="${alto.largura}" height="${alto.altura}" alt="${esc(alt)}" fetchpriority="high" decoding="async"></picture>`;
}

export function inicio(ctx) {
  const h = ctx.inicio;
  const f = ctx.ficheiros.filme;
  const altCapa = ctx.fotos[h.capa.foto]?.alt || '';
  const fundo = f
    ? `${imagemDaCapa(ctx, f, 'Velas de batismo com laços de linho em vários tons')}
  <video class="capa__filme" data-filme-largo="${ctx.asset(f.largo.video)}" data-filme-alto="${ctx.asset(f.alto.video)}" data-filme-a="${CORTE_ALTO_ATE}" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>`
    : imagem(ctx, h.capa.foto, { tamanhos: '100vw', prioridade: true, classe: 'capa__imagem', alt: altCapa });
  const capa = `<section class="capa" aria-labelledby="capa-titulo">
  ${fundo}
  <div class="capa__veu"></div>
  <div class="capa__palavras">
    <h1 class="capa__titulo" id="capa-titulo">${esc(h.capa.titulo)}</h1>
    <a class="botao botao--cheio capa__botao" href="${ctx.url(h.capa.ligacao || '/loja/')}">${esc(h.capa.botao)}</a>
  </div>
  ${f ? `<button class="capa__pausa" type="button" aria-pressed="false" data-filme-botao hidden>${icones.pausa}<span class="visualmente-escondido">Parar o filme</span></button>` : ''}
</section>`;

  /* Uma montra de uma categoria (como «Os mais vendidos» do ithos): o título, os quatro primeiros
     artigos e o botão para os ver todos. Sem artigos, não aparece. */
  const montra = (s, id, { maximo = 4 } = {}) => {
    const c = categoriaDe(ctx, s.categoria);
    const lista = c ? produtosDe(ctx, c.slug) : [];
    if (!lista.length) return '';
    return `<section class="montra" aria-labelledby="${id}">
  <h2 class="titulo-seccao" id="${id}">${esc(s.titulo)}</h2>
  <div class="grelha">${lista.slice(0, maximo).map((p) => cartaoProduto(ctx, p)).join('\n')}</div>
  ${lista.length > maximo ? `<p class="montra__mais"><a class="botao botao--contorno" href="${ctx.url(`/loja/${c.slug}/`)}">${esc(s.botao)} (${lista.length})</a></p>` : ''}
</section>`;
  };

  const a = h.apresentacao;
  const apresentacao = `<section class="ola" aria-labelledby="ola-titulo">
  <div class="ola__caixa">
    <div class="ola__texto">
      <h2 class="ola__titulo" id="ola-titulo">${esc(a.titulo)}</h2>
      ${paragrafos(a.texto)}
      ${a.assinatura ? `<p class="ola__assinatura">${esc(a.assinatura)}</p>` : ''}
    </div>
    <div class="ola__foto">${imagem(ctx, a.foto, { tamanhos: '(min-width: 900px) 44vw, 100vw' })}</div>
  </div>
</section>`;

  const org = organizacao(ctx);
  return {
    caminho: '/',
    titulo: h.seo.titulo,
    descricao: h.seo.descricao,
    classe: 'pagina-inicio',
    jsonld: [org, { '@context': 'https://schema.org', '@type': 'WebSite', '@id': ctx.absoluto('/#site'), name: ctx.site.marca, url: ctx.absoluto('/'), inLanguage: 'pt-PT', publisher: { '@id': ctx.absoluto('/#loja') } }],
    conteudo: [capa, montra(h.destaque, 'destaque-titulo'), apresentacao, montra(h.lembrancas, 'lembrancas-titulo')].filter(Boolean).join('\n\n'),
  };
}

/* ---------------------------------------------------------------- os tons de linho */
/* As amostras dos tons (círculo, número e nome), na página inicial e na página dos tons. */
function amostras(ctx, { grandes = false } = {}) {
  return `<ul class="amostras${grandes ? ' amostras--grandes' : ''}">${(ctx.site.cores || []).map((c) => `<li class="amostra"><span class="amostra__cor" style="--cor:${esc(c.hex)}" aria-hidden="true"></span><span class="amostra__numero">${c.numero}</span><span class="amostra__nome">${esc(c.nome)}</span></li>`).join('')}</ul>`;
}
function sugestoes(ctx) {
  const lista = (ctx.site.sugestoesCores || []).filter((s) => s && s.titulo && Array.isArray(s.cores));
  if (!lista.length) return '';
  const porNumero = Object.fromEntries((ctx.site.cores || []).map((c) => [c.numero, c]));
  return `<div class="sugestoes">
  <h3 class="sugestoes__titulo">As nossas sugestões</h3>
  <ul>${lista.map((s) => `<li class="sugestao">
    <p class="sugestao__titulo">${esc(s.titulo)}</p>
    <ul class="sugestao__cores">${s.cores.map((n) => porNumero[n]).filter(Boolean).map((c) => `<li><span class="amostra__cor" style="--cor:${esc(c.hex)}" aria-hidden="true"></span><span>${c.numero} · ${esc(c.nome.split(' / ')[0].replace(/\s*\(.*\)$/, ''))}</span></li>`).join('')}</ul>
    ${s.texto ? `<p class="sugestao__texto">${esc(s.texto)}</p>` : ''}
  </li>`).join('')}</ul>
</div>`;
}

export function tonsDeLinho(ctx) {
  const m = migalhas(ctx, [{ nome: 'Início', caminho: '/' }, { nome: 'Tons de linho', caminho: '/tons-de-linho/' }]);
  const conteudo = `<div class="contentor tons-pagina">
  ${m.html}
  <h1 class="titulo-pagina">Tons de linho</h1>
  <p class="texto__intro">Os laços das velas e das conchas, e o bordado das toalhas, fazem-se nos tons de linho que escolher. Escolha pelo número, ao encomendar. As cores no ecrã são aproximadas: se tiver dúvidas, pergunte-nos pelo WhatsApp e mostramos o linho.</p>
  ${amostras(ctx, { grandes: true })}
  ${sugestoes(ctx)}
  ${ctx.fotos['tons-de-linho'] ? `<figure class="tons-pagina__quadro">${imagem(ctx, 'tons-de-linho', { tamanhos: '(min-width: 900px) 640px, 100vw' })}<figcaption>O quadro dos tons, como o publicámos no Instagram.</figcaption></figure>` : ''}
</div>`;
  return { caminho: '/tons-de-linho/', titulo: 'Tons de linho para o batismo', descricao: `Os ${(ctx.site.cores || []).length} tons de linho da ${ctx.site.marca} para os laços das velas, das conchas e o bordado das toalhas de batismo, com sugestões para menino, menina e neutro.`, jsonld: [m.ld], conteudo };
}

export function organizacao(ctx) {
  const c = ctx.site.contactos;
  const e = ctx.site.empresa;
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': ctx.absoluto('/#loja'),
    name: ctx.site.marca,
    description: ctx.site.descricao,
    url: ctx.absoluto('/'),
    logo: ctx.absoluto(`/assets/img/${ctx.manifesto.logo.altura[256].png}`),
    image: ctx.absoluto(`/assets/img/${ctx.manifesto.partilha._site}`),
    address: { '@type': 'PostalAddress', addressLocality: ctx.site.local.localidade, addressRegion: ctx.site.local.distrito, addressCountry: 'PT' },
    areaServed: { '@type': 'Country', name: 'Portugal' },
    currenciesAccepted: 'EUR',
    paymentAccepted: 'MB WAY, transferência bancária',
    sameAs: [c.instagram && `https://www.instagram.com/${c.instagram}/`, c.facebook && `https://www.facebook.com/${c.facebook}`].filter(Boolean),
  };
  if (ctx.site.fundadores) ld.founder = { '@type': 'Person', name: ctx.site.fundadores };
  if (c.email) ld.email = c.email;
  if (c.whatsapp) ld.telephone = `+${numeroWhatsApp(c.whatsapp)}`;
  if (e.nif) ld.vatID = `PT${e.nif.replace(/\D/g, '')}`;
  return ld;
}

// ---------------------------------------------------------------- loja e categorias
const TEXTO_LOJA = 'Tudo feito à mão, por encomenda. Escolha as peças, o tom de linho e escreva o nome e a data; no fim, envie-nos a encomenda pelo WhatsApp e confirmamos consigo o total, o prazo e o pagamento.';
export function loja(ctx, cat = null) {
  const c = cat && categoriaDe(ctx, cat);
  const lista = c ? produtosDe(ctx, cat) : ctx.produtos;
  const caminho = c ? `/loja/${c.slug}/` : '/loja/';
  const m = migalhas(ctx, [{ nome: 'Início', caminho: '/' }, { nome: 'Loja', caminho: '/loja/' }, ...(c ? [{ nome: c.titulo, caminho }] : [])]);
  const chips = [{ slug: '', nome: 'Tudo', n: ctx.produtos.length }, ...categoriasComArtigos(ctx).map((k) => ({ ...k, n: produtosDe(ctx, k.slug).length }))]
    .map((k) => {
      const href = ctx.url(k.slug ? `/loja/${k.slug}/` : '/loja/');
      const atual = (k.slug || null) === (cat || null);
      return `<li><a class="chip" href="${href}"${atual ? ' aria-current="page"' : ''}><span>${esc(k.nome)}</span><span class="chip__n">${k.n}</span></a></li>`;
    }).join('');
  const conteudo = `<div class="contentor loja">
  ${m.html}
  <header class="loja__topo">
    <h1 class="titulo-pagina">${esc(c ? c.titulo : 'Loja')}</h1>
    ${c ? `<div class="loja__texto">${markdown(c.resumo, ctx.url)}</div>` : `<p class="loja__texto">${esc(TEXTO_LOJA)}</p>`}
  </header>
  <nav class="chips" aria-label="Categorias"><ul>${chips}</ul></nav>
  <div class="grelha">
    ${lista.map((p) => cartaoProduto(ctx, p, { titulo: 'h2' })).join('\n')}
  </div>
</div>`;
  return {
    caminho,
    titulo: c ? c.titulo : 'Loja — conjuntos de batismo e lembranças personalizadas',
    descricao: c ? textoSimples(c.resumo).slice(0, 158) : 'Conjuntos de batismo personalizados, lembranças para batizados, comunhões e casamentos, e a coleção de Natal, feitos à mão pela Mimices.',
    jsonld: [m.ld, {
      '@context': 'https://schema.org', '@type': 'ItemList',
      itemListElement: lista.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: ctx.absoluto(`/produtos/${p.slug}/`), name: p.nome })),
    }],
    conteudo,
  };
}

/* ---------------------------------------------------------------- vídeo */
function capaDoVideo(ctx, nome) {
  const poster = ctx.manifesto.posters[`video-${nome}`];
  const w = poster.larguras[0];
  return `<img src="${ctx.asset(`img/video-${nome}-${poster.resumo}-${w}.webp`)}" width="${w}" height="${Math.round((w * poster.altura) / poster.largura)}" alt="" loading="lazy" decoding="async">`;
}
export function video(ctx, nome) {
  const poster = ctx.manifesto.posters[`video-${nome}`];
  if (!poster) throw new Error(`vídeo «${nome}» sem capa em media/video/${nome}.jpg`);
  const posterUrl = ctx.asset(`img/video-${nome}-${poster.resumo}-${poster.larguras[poster.larguras.length - 1]}.webp`);
  return `<div class="video" data-video>
  <video muted loop playsinline preload="none" poster="${posterUrl}" width="${poster.largura}" height="${poster.altura}" aria-label="Vídeo sem som: ${esc(ctx.videos[nome] || nome)}">
    <source src="${ctx.asset(ctx.ficheiros.videos[nome])}" type="video/mp4">
  </video>
  <button class="video__botao" type="button" aria-pressed="false" data-video-botao>${icones.tocar}<span class="visualmente-escondido">Ver o vídeo</span></button>
</div>`;
}

// ---------------------------------------------------------------- ficha de artigo
/* A segurança das velas (as velas de batismo, as velinhas, as do Advento): os avisos da norma das
   velas (EN 15494) que a lei geral da segurança dos produtos pede junto do artigo vendido à
   distância (Regulamento (UE) 2023/988, art. 19.º). */
const AVISOS_VELA = [
  'Nunca deixe uma vela acesa sem vigilância.',
  'Mantenha afastada de objetos que possam incendiar-se.',
  'Mantenha fora do alcance de crianças e animais.',
  'Use um castiçal resistente ao calor.',
  'Retire o laço, a corda e as flores antes de acender: são decoração.',
];
/* O sinal geral de perigo (ISO 7010 W001), que a norma das velas pede junto dos avisos. */
const SINAL_PERIGO = '<svg class="sinal-perigo" viewBox="0 0 48 42" width="40" height="35" role="img" aria-label="Sinal de perigo"><path d="M24 2 46 40H2Z" fill="#F9C80E" stroke="#1A1A1A" stroke-width="3" stroke-linejoin="round"/><path d="M24 14v13" stroke="#1A1A1A" stroke-width="4.5" stroke-linecap="round"/><circle cx="24" cy="33.5" r="2.6" fill="#1A1A1A"/></svg>';
const nomeCurtoDaCor = (n) => String(n).split(' / ')[0].replace(/\s*\(.*\)$/, '');
const eVela = (p) => /\bvel(a|as|inha|inhas)\b/i.test(`${p.nome} ${p.resumo}`);

export function produto(ctx, p) {
  const c = categoriaDe(ctx, p.categoria);
  const caminho = `/produtos/${p.slug}/`;
  const m = migalhas(ctx, [{ nome: 'Início', caminho: '/' }, { nome: c.titulo, caminho: `/loja/${c.slug}/` }, { nome: p.nome, caminho }]);
  const v = precoDe(p, ctx.hoje);
  const pct = desconto(ctx, p);

  // A galeria: a fotografia inteira (sem cortes), numa moldura com a forma da mais alta do
  // artigo (memória o-quadrado-come-o-produto); o vídeo logo a seguir à capa.
  const itens = p.fotos.map((f, i) => ({ foto: f, n: i + 1 }));
  if (p.video && ctx.ficheiros.videos[p.video]) itens.splice(1, 0, { video: p.video });
  const formas = p.fotos.map((f) => { const mm = ctx.manifesto.fotos[f]; return mm ? mm.largura / mm.altura : 0.8; });
  const forma = Math.max(0.56, Math.min(1.2, Math.min(...formas)));
  const galeria = `<div class="galeria" data-galeria style="--forma:${forma.toFixed(3)}">
    <div class="galeria__pista" tabindex="0" role="region" aria-label="${p.video ? 'Fotografias e vídeo' : 'Fotografias'} de ${esc(p.nome)}">
      ${itens.map((it) => (it.video
    ? `<figure class="galeria__foto galeria__foto--video" id="video">${video(ctx, it.video)}</figure>`
    : `<figure class="galeria__foto" id="foto-${it.n}">${imagem(ctx, it.foto, { tamanhos: '(min-width: 1000px) 46vw, 100vw', prioridade: it.n === 1 })}</figure>`)).join('\n')}
    </div>
    ${itens.length > 1 ? `<ul class="galeria__miniaturas">${itens.map((it, i) => `<li>${it.video
    ? `<button class="galeria__mini-video" type="button" data-foto="${i}">${capaDoVideo(ctx, it.video)}<span class="galeria__tocar">${icones.tocar}</span><span class="visualmente-escondido">Vídeo</span></button>`
    : `<button type="button" data-foto="${i}"${i === 0 ? ' aria-current="true"' : ''}>${imagem(ctx, it.foto, { tamanhos: '80px', alt: '', prioridade: true }).replace(' fetchpriority="high"', '')}<span class="visualmente-escondido">Fotografia ${it.n} de ${p.fotos.length}</span></button>`}</li>`).join('')}</ul>` : ''}
  </div>`;

  const selos = [
    pct ? `<span class="selo selo--promocao">${esc(promocaoAte(ctx, p) || 'Promoção')}</span>` : '',
    p.novidade ? '<span class="selo selo--novidade">Novidade</span>' : '',
  ].filter(Boolean).join('');

  const comToalha = /\btoalhas?\b/i.test(`${p.nome} ${(p.inclui || []).join(' ')}`);
  const composicao = p.composicao ? `<p class="composicao"><strong>Composição:</strong> ${esc(p.composicao)}</p>` : (comToalha ? `<p class="composicao"><strong>Composição:</strong> ${ctx.marcador('de que é feita a toalha (ex.: 100 % algodão)')}</p>` : '');
  const inclui = p.inclui?.length ? `<div class="inclui"><p class="inclui__titulo">Inclui</p><ul>${p.inclui.map((t) => `<li>${icones.certo}<span>${esc(t)}</span></li>`).join('')}</ul>${composicao}</div>` : composicao;

  // --- o formulário: cor, escolhas, personalização, quantidade -------------------------
  const cores = ctx.site.cores || [];
  const blocoCores = p.cores && cores.length ? `<fieldset class="campo cores" data-cores>
    <legend>Tom de linho <span class="cores__escolhido" data-cor-nome aria-hidden="true"></span></legend>
    <div class="cores__lista">${cores.map((k) => `<label class="cor" title="${k.numero} · ${esc(nomeCurtoDaCor(k.nome))}"><input type="radio" name="cor" value="${k.numero}" required data-nome="${esc(k.nome)}"><span class="cor__amostra" style="--cor:${esc(k.hex)}" aria-hidden="true">${icones.certo}</span><span class="visualmente-escondido">${k.numero} · ${esc(k.nome)}</span></label>`).join('')}</div>
    <p class="campo__ajuda"><a href="${ctx.url('/tons-de-linho/')}">Ver os 14 tons com o nome</a> · as cores no ecrã são aproximadas.</p>
  </fieldset>` : '';

  /* As escolhas (o desenho da caixa, o acrílico…): nenhuma marcada à partida, porque mudam a peça
     (pesquisa de UX de 16 out 2026: obrigar a escolher evita encomendas erradas). O preço anunciado
     continua a poder pagar-se: com acréscimos, o cartão diz «Desde». */
  const grupos = opcoesDe(p);
  const blocoOpcoes = grupos.map((g, i) => `<fieldset class="campo escolha" data-escolha="${i}">
    <legend>${esc(g.nome)}</legend>
    <div class="escolha__lista">${g.valores.map((x, j) => `<label class="escolha__opcao"><input type="radio" name="opcao-${i}" value="${j}" required><span>${esc(x.nome)}${x.suplemento ? ` <span class="escolha__mais">+ ${euros(x.suplemento)}</span>` : ''}</span></label>`).join('')}</div>
  </fieldset>`).join('');

  const campos = personalizacaoDe(p);
  const idCampo = (id) => `pz-${id}-${p.slug}`;
  const blocoPers = campos.length ? `<fieldset class="campo personaliza">
    <legend>Personalização</legend>
    ${campos.map((k) => {
      if (k.id === 'data') return `<div class="campo"><label for="${idCampo('data')}">${esc(k.rotulo)}</label><input id="${idCampo('data')}" name="data" type="date" required data-sem-passado></div>`;
      if (k.id === 'frase') return `<div class="campo"><label for="${idCampo('frase')}">${esc(k.rotulo)} <span class="campo__opcional">(opcional)</span></label><textarea id="${idCampo('frase')}" name="frase" rows="2" maxlength="160" spellcheck="true"></textarea></div>`;
      return `<div class="campo"><label for="${idCampo('nome')}">${esc(k.rotulo)}</label><input id="${idCampo('nome')}" name="nome" type="text" maxlength="40" autocomplete="off" autocapitalize="words" autocorrect="off" spellcheck="false" required aria-describedby="${idCampo('nome')}-ajuda"><p class="campo__ajuda" id="${idCampo('nome')}-ajuda">Como vai ficar escrito na peça.</p></div>`;
    }).join('')}
    <p class="aviso-pers">Peça personalizada: não tem devolução por desistência. Um defeito ou um erro nosso, resolvemos sempre.</p>
  </fieldset>` : '';

  const minimo = quantidadeMinimaDe(p);
  const form = `<form class="comprar" data-comprar="${esc(p.slug)}" data-minimo="${minimo}" novalidate>
      ${blocoCores}
      ${blocoOpcoes}
      ${blocoPers}
      <div class="comprar__linha">
        <div class="quantidade" data-quantidade>
          <button type="button" data-menos>${icones.menos}<span class="visualmente-escondido">Menos um</span></button>
          <label class="visualmente-escondido" for="qtd-${p.slug}">Quantidade</label>
          <input id="qtd-${p.slug}" name="quantidade" type="number" inputmode="numeric" min="${minimo}" max="999" value="${minimo}">
          <button type="button" data-mais>${icones.mais}<span class="visualmente-escondido">Mais um</span></button>
        </div>
        <button class="botao botao--cheio botao--largo" type="submit">${icones.carrinho}<span>Adicionar ao carrinho</span></button>
      </div>
      ${minimo > 1 ? `<p class="comprar__minimo">Mínimo de ${minimo} unidades.</p>` : ''}
      <p class="comprar__total" data-total aria-live="polite"></p>
      <p class="comprar__erro" data-erro role="alert" hidden></p>
    </form>
    <noscript><p><a class="botao botao--whatsapp" href="${ctx.whatsapp(`Olá! Gostava de encomendar: ${p.nome}.`)}">${icones.whatsapp}Encomendar pelo WhatsApp</a></p></noscript>`;

  // --- a caixa de confiança (como a do ithos): prazo, entrega, pagamento, feito à mão ------
  const portes = ctx.site.entrega.portes || {};
  const portesTexto = ['continente', 'ilhas'].map((z) => {
    const zona = ctx.site.entrega.zonas.find((x) => x.id === z);
    return zona ? `${esc(zona.curto)} ${Number.isFinite(portes[z]) ? euros(portes[z]) : 'a confirmar'}` : '';
  }).filter(Boolean).join(' · ');
  const prazo = prazoCurto(ctx);
  const confianca = `<ul class="confianca">
    <li>${icones.relogio}<span>${prazo ? esc(prazo) : ctx.marcador('o prazo de produção (ex.: «Cada conjunto fica pronto em 2 a 3 semanas»)')}</span></li>
    <li>${icones.camiao}<span>Envio por CTT Expresso, com portes por encomenda: ${portesTexto}. Levantamento grátis em ${esc(ctx.site.local.localidade)}.</span></li>
    <li>${icones.cartao}<span>Paga depois de confirmarmos pelo WhatsApp: MB WAY ou transferência.</span></li>
  </ul>`;

  const e = ctx.site.empresa;
  /* Quem fabrica, com a morada postal e o email, à vista em cada ficha (Regulamento (UE) 2023/988,
     art. 19.º). Sem morada ainda, a marca «por confirmar» (no domínio a construção pára antes). */
  const fabricante = [e.nome ? esc(`${e.nome} (${ctx.site.marca})`) : esc(ctx.site.marca), e.morada ? esc(moradaCompleta(e)) : ctx.marcador('a morada postal de quem faz as peças'), esc(ctx.site.contactos.email)].filter(Boolean).join(' · ');
  const medidas = p.medidas?.length ? `<table class="medidas"><tbody>${p.medidas.map((l) => `<tr><th scope="row">${esc(l.rotulo)}</th><td>${esc(l.valor)}</td></tr>`).join('')}</tbody></table>` : '';
  const acordeoes = `<div class="acordeoes">
    ${medidas ? `<details><summary>${icones.regua}Medidas</summary><div class="acordeoes__corpo">${medidas}<p class="nota">Medidas aproximadas: cada peça é feita à mão.</p></div></details>` : ''}
    <details><summary>${icones.whatsapp}Como encomendar</summary><div class="acordeoes__corpo"><p>Junte as peças ao carrinho e envie-nos a encomenda pelo WhatsApp: confirmamos consigo o total e o prazo, e só depois paga. Uma ideia diferente (outra cor, um desenho, uma frase)? Escreva-a nas observações do carrinho.</p><p><a href="${ctx.url('/como-encomendar/')}">Saber mais</a></p></div></details>
  </div>
  ${eVela(p) ? `<div class="seguranca"><div class="seguranca__topo">${SINAL_PERIGO}<p class="seguranca__titulo">Avisos de segurança</p></div><ul>${AVISOS_VELA.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
  <p class="feito-por">${icones.laco}<span><strong>Feito por:</strong> ${fabricante}</span></p>`;

  const relacionados = ctx.produtos.filter((x) => x.slug !== p.slug)
    .sort((a, b) => (b.categoria === p.categoria) - (a.categoria === p.categoria) || (a.ordem ?? 500) - (b.ordem ?? 500)).slice(0, 4);

  const conteudo = `<div class="contentor produto">
  ${m.html}
  <div class="produto__grelha">
    ${galeria}
    <div class="produto__info">
      ${selos ? `<div class="produto__selos">${selos}</div>` : ''}
      <p class="etiqueta">${esc(c.nome)}</p>
      <h1 class="produto__nome">${esc(p.nome)}</h1>
      ${preco(ctx, p, { grande: true })}
      <div class="produto__resumo">${markdown(p.descricao, ctx.url)}</div>
      ${inclui}
      ${form}
      ${confianca}
      ${acordeoes}
    </div>
  </div>
  <section class="relacionados" aria-labelledby="rel-titulo">
    <h2 id="rel-titulo" class="titulo-seccao">Também lhe pode interessar</h2>
    <div class="grelha">${relacionados.map((x) => cartaoProduto(ctx, x)).join('\n')}</div>
  </section>
</div>`;

  const ldProduto = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nome,
    description: p.resumo,
    image: p.fotos.slice(0, 4).map((f) => {
      const mm = ctx.manifesto.fotos[f];
      return ctx.absoluto(`/assets/img/${f}-${mm.resumo}-${mm.larguras[mm.larguras.length - 1]}.webp`);
    }),
    brand: { '@type': 'Brand', name: ctx.site.marca },
    category: c.titulo,
  };
  if (v.atual !== null) {
    ldProduto.offers = {
      '@type': 'Offer',
      url: ctx.absoluto(caminho),
      priceCurrency: 'EUR',
      price: v.atual.toFixed(2),
      availability: 'https://schema.org/MadeToOrder',   // tudo é feito por encomenda
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': ctx.absoluto('/#loja') },
      /* A devolução, como os termos a dizem: uma peça personalizada (com o nome ou a data) não tem
         livre resolução; as outras têm 14 dias, com os custos da devolução a cargo do cliente. */
      hasMerchantReturnPolicy: campos.length
        ? { '@type': 'MerchantReturnPolicy', applicableCountry: 'PT', returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted' }
        : { '@type': 'MerchantReturnPolicy', applicableCountry: 'PT', returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow', merchantReturnDays: 14, returnMethod: 'https://schema.org/ReturnByMail', returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility' },
      ...(v.ate ? { priceValidUntil: v.ate } : {}),
    };
  }
  return {
    caminho,
    titulo: p.nome,
    descricao: `${p.resumo}${v.atual !== null ? ` ${temSuplementos(p) ? 'Desde ' : ''}${euros(v.atual)}.` : ''} Feito à mão pela ${ctx.site.marca}.`.slice(0, 160),
    tipo: 'product',
    partilha: ctx.manifesto.partilha[p.slug],
    jsonld: [m.ld, ldProduto],
    conteudo,
  };
}

// ---------------------------------------------------------------- carrinho
export function carrinho(ctx) {
  const zonas = ctx.site.entrega.zonas;
  const conteudo = `<div class="contentor carrinho-pagina">
  <h1 class="titulo-pagina">O seu carrinho</h1>
  <div class="carrinho-pagina__grelha" data-carrinho-pagina>
    <section class="carrinho-pagina__artigos" aria-labelledby="artigos-titulo">
      <h2 id="artigos-titulo" class="visualmente-escondido">Artigos</h2>
      <div data-carrinho-lista><p class="carrinho-vazio">O carrinho está vazio. <a href="${ctx.url('/loja/')}">Ver a loja</a></p></div>
    </section>
    <aside class="carrinho-pagina__resumo" aria-labelledby="encomenda-titulo">
      <form class="encomenda" id="encomenda" novalidate data-encomenda>
        <h2 id="encomenda-titulo" class="encomenda__titulo">Finalizar a encomenda</h2>
        <fieldset class="encomenda__entrega">
          <legend>Como quer receber?</legend>
          ${zonas.map((z, i) => `<label class="opcao-entrega"><input type="radio" name="entrega" value="${esc(z.id)}"${i === 0 ? ' checked' : ''} required><span class="opcao-entrega__nome">${esc(z.nome)}</span><span class="opcao-entrega__preco" data-preco-zona="${esc(z.id)}"></span></label>`).join('\n')}
        </fieldset>
        <div class="totais" data-totais aria-live="polite"></div>
        <fieldset class="encomenda__dados">
          <legend>Os seus dados</legend>
          <div class="campo"><label for="e-nome">Nome</label><input id="e-nome" name="nome" type="text" autocomplete="name" required maxlength="80"></div>
          <div class="campo"><label for="e-data">Data da celebração <span class="campo__opcional">(opcional)</span></label><input id="e-data" name="dataCelebracao" type="date" aria-describedby="e-data-ajuda"><p class="campo__ajuda" id="e-data-ajuda">Para sabermos até quando precisa da encomenda.</p></div>
          <div class="campo" data-so-envio><label for="e-morada">Morada</label><input id="e-morada" name="morada" type="text" autocomplete="street-address" maxlength="160" data-obrigatorio-envio></div>
          <div class="campos-lado" data-so-envio>
            <div class="campo"><label for="e-cp">Código postal</label><input id="e-cp" name="codigoPostal" type="text" autocomplete="postal-code" maxlength="12" data-obrigatorio-envio></div>
            <div class="campo"><label for="e-local">Localidade</label><input id="e-local" name="localidade" type="text" autocomplete="address-level2" maxlength="60" data-obrigatorio-envio></div>
          </div>
          <div class="campo"><label for="e-nif">NIF para a fatura <span class="campo__opcional">(opcional)</span></label><input id="e-nif" name="nif" type="text" inputmode="numeric" maxlength="12" autocomplete="off"></div>
          <div class="campo"><label for="e-notas">Observações <span class="campo__opcional">(opcional)</span></label><textarea id="e-notas" name="notas" rows="3" maxlength="500"></textarea></div>
        </fieldset>
        <div class="seguir">
          <p class="seguir__titulo">O que acontece a seguir</p>
          <ol>
            <li>Confirmamos consigo, pelo WhatsApp, o total e o prazo: só aí a encomenda fica feita.</li>
            <li>Enviamos-lhe os dados para o pagamento, por MB WAY ou transferência.</li>
            <li>Fazemos as peças à mão, com o nome, a data e o tom que escolheu.</li>
          </ol>
        </div>
        <p class="encomenda__aviso">${icones.info}<span>As peças personalizadas (com o nome, a data ou um texto seu) não têm direito de livre resolução (art. 17.º, n.º 1, al. c), do DL 24/2014); as restantes podem ser devolvidas em 14 dias. <a href="${ctx.url('/termos-e-condicoes/')}">Termos e condições</a></span></p>
        <p class="encomenda__aviso">${icones.whatsapp}<span>Ao carregar no botão abre-se o WhatsApp com a sua encomenda escrita. Nada do que escreve aqui fica guardado neste site.</span></p>
        <p class="comprar__erro" data-erro-encomenda role="alert" hidden></p>
        <button class="botao botao--whatsapp botao--largo" type="submit">${icones.whatsapp}<span>Enviar encomenda pelo WhatsApp</span></button>
        <div class="encomenda__enviada" data-enviada hidden>
          <p class="encomenda__enviada-cabeca">${icones.certo}<span>Abrimos o WhatsApp com a sua encomenda escrita<span data-enviada-quando></span>.</span></p>
          <p>Se ainda não carregou em enviar na conversa, faça-o lá. A encomenda fica feita quando a confirmarmos consigo pelo WhatsApp, com o total, o pagamento e o prazo.</p>
          ${ctx.site.contactos.instagram ? `<p class="encomenda__instagram">${icones.instagram}<span>Enquanto espera, veja os conjuntos que vão saindo no nosso Instagram: <a href="https://www.instagram.com/${esc(ctx.site.contactos.instagram)}/" target="_blank" rel="noopener">@${esc(ctx.site.contactos.instagram)}</a></span></p>` : ''}
          <button class="botao botao--whatsapp botao--largo" type="button" data-continuar>${icones.whatsapp}<span>Continuar no WhatsApp</span></button>
          <button class="botao botao--contorno botao--largo" type="button" data-copiar>${icones.copiar}<span>Copiar a mensagem</span></button>
          <p class="encomenda__enviada-mais"><button class="botao botao--texto" type="button" data-alterar>Alterar a encomenda</button><button class="botao botao--texto" type="button" data-esvaziar>Fazer outra encomenda</button></p>
        </div>
      </form>
    </aside>
  </div>
  <noscript><p class="nota">O carrinho precisa de JavaScript. Pode sempre encomendar diretamente pelo <a href="${ctx.whatsapp('Olá! Gostava de fazer uma encomenda.')}">WhatsApp</a>.</p></noscript>
</div>`;
  return { caminho: '/carrinho/', titulo: 'O seu carrinho', descricao: 'Reveja as peças, escolha a entrega e envie-nos a encomenda pelo WhatsApp.', conteudo, classe: 'pagina-carrinho' };
}

// ---------------------------------------------------------------- páginas de texto
export function texto(ctx, pag) {
  const m = migalhas(ctx, [{ nome: 'Início', caminho: '/' }, { nome: pag.titulo, caminho: pag.caminho }]);
  const conteudo = `<div class="contentor texto-pagina">
  ${m.html}
  <article class="texto">
    <h1 class="titulo-pagina">${esc(pag.titulo)}</h1>
    ${pag.atualizado ? `<p class="texto__data">Atualizado a ${new Date(`${pag.atualizado}T12:00:00Z`).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Lisbon' })}</p>` : ''}
    ${pag.foto ? `<div class="texto__foto">${imagem(ctx, pag.foto, { tamanhos: '(min-width: 900px) 760px, 100vw' })}</div>` : ''}
    ${pag.html}
  </article>
</div>`;
  return { caminho: pag.caminho, titulo: pag.tituloSeo || pag.titulo, descricao: pag.descricao, indexar: pag.indexar, jsonld: [m.ld], conteudo };
}

export function contactos(ctx) {
  const c = ctx.site.contactos;
  const m = migalhas(ctx, [{ nome: 'Início', caminho: '/' }, { nome: 'Contactos', caminho: '/contactos/' }]);
  const cartoes = [];
  if (c.whatsapp) cartoes.push(`<li>${icones.whatsapp}<h2>WhatsApp</h2><p><a href="${ctx.whatsapp('Olá!')}">${esc(ctx.numeroLegivel(c.whatsapp))}</a></p><p class="nota">${esc(ctx.custoChamada(c.whatsapp))}</p></li>`);
  else cartoes.push(`<li>${icones.whatsapp}<h2>WhatsApp</h2><p>${ctx.marcador('o número de WhatsApp das encomendas')}</p></li>`);
  /* O telefone, para ligar, com a nota que a lei pede junto de um número (DL 59/2021). */
  const tel = numeroPortugues(c.telefone);
  if (tel) cartoes.push(`<li>${icones.telefone}<h2>Telefone</h2><p><a href="tel:+351${tel}">${esc(ctx.numeroLegivel(tel))}</a></p><p class="nota">${esc(ctx.custoChamada(tel))}</p></li>`);
  if (c.email) cartoes.push(`<li>${icones.email}<h2>Email</h2><p><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></p></li>`);
  if (c.instagram) cartoes.push(`<li>${icones.instagram}<h2>Instagram</h2><p><a href="https://www.instagram.com/${esc(c.instagram)}/" target="_blank" rel="noopener">@${esc(c.instagram)}</a></p></li>`);
  if (c.facebook) cartoes.push(`<li>${icones.facebook}<h2>Facebook</h2><p><a href="https://www.facebook.com/${esc(c.facebook)}" target="_blank" rel="noopener">${esc(ctx.site.marca)}</a></p></li>`);
  cartoes.push(`<li>${icones.local}<h2>Onde estamos</h2><p>${esc(ctx.site.local.localidade)}, distrito de ${esc(ctx.site.local.distrito)}</p><p class="nota">Levantamentos com marcação, pelo WhatsApp.</p></li>`);
  const conteudo = `<div class="contentor texto-pagina texto-pagina--largo">
  ${m.html}
  <h1 class="titulo-pagina">Contactos</h1>
  <p class="texto__intro">Encomendas, dúvidas sobre os tons de linho ou uma ideia para um conjunto: fale connosco. Respondemos pelo WhatsApp, por email ou pelas redes sociais.</p>
  <ul class="contactos">${cartoes.join('')}</ul>
</div>`;
  return { caminho: '/contactos/', titulo: 'Contactos', descricao: `Fale com a ${ctx.site.marca}: WhatsApp, ${tel ? 'telefone, ' : ''}email, Instagram e Facebook. ${ctx.site.local.localidade}, ${ctx.site.local.distrito}.`, jsonld: [m.ld, organizacao(ctx)], conteudo };
}

export function erro404(ctx) {
  const conteudo = `<div class="contentor texto-pagina erro">
  <h1 class="titulo-pagina">Esta página não existe</h1>
  <p>Pode ter mudado de sítio, ou o endereço tem um erro. Experimente a loja:</p>
  ${botaoSeta(ctx.url('/loja/'), 'Ver a loja', { classe: 'botao botao--cheio' })}
</div>`;
  return { caminho: '/404.html', titulo: 'Página não encontrada', descricao: 'Esta página não existe.', conteudo };
}

// usada pelo build para as páginas de texto com o quadro dos portes
export { inline };
