// A moldura de todas as páginas: <head>, aviso, cabeçalho, menu, rodapé e gaveta do carrinho.
// A arrumação é a do ithos (ithos-cathelier.pt), de que a Susana gostou: «Menu» à esquerda, o
// logótipo ao centro, o carrinho à direita, e um menu que abre de lado.
import { esc, numeroWhatsApp } from './util.mjs';
import { icones } from './icones.mjs';
import { imagem } from './componentes.mjs';

const LIVRO = 'https://www.livroreclamacoes.pt/inicio';

function logotipo(ctx, { alto = 64, classe = 'logo' } = {}) {
  const l = ctx.manifesto.logo;
  // a versão mais pequena que ainda chega ao dobro da altura (ecrãs de alta resolução)
  const alturas = Object.keys(l.altura).map(Number).sort((x, y) => x - y);
  const h = alturas.find((x) => x >= alto * 2) || alturas[alturas.length - 1];
  const v = l.altura[h];
  const largo = Math.round((v.largura / h) * alto);
  return `<img class="${classe}" src="${ctx.asset(`img/${v.webp}`)}" width="${largo}" height="${alto}" alt="${esc(ctx.site.marca)}">`;
}

function aviso(ctx) {
  const a = ctx.site.aviso || {};
  if (!a.texto || (a.ate && ctx.hoje > a.ate)) return '';
  const texto = esc(a.texto);
  const corpo = a.ligacao ? `<a href="${ctx.url(a.ligacao)}">${texto}</a>` : texto;
  // data-ate: o site.js esconde o aviso no dia seguinte, mesmo que ninguém publique nada
  return `<div class="aviso"${a.ate ? ` data-ate="${esc(a.ate)}"` : ''}><p>${corpo}</p></div>`;
}

const quantosArtigos = (n) => (n === 1 ? '1 artigo' : `${n} artigos`);
/* As categorias que têm artigos no site (a de Natal some sozinha quando os artigos dela se escondem). */
export const categoriasComArtigos = (ctx) => ctx.categorias.filter((c) => ctx.produtos.some((p) => p.categoria === c.slug));

function cabecalho(ctx) {
  const c = ctx.site.contactos;
  return `<header class="topo" data-topo>
  <div class="topo__barra">
    <button class="topo__menu" type="button" data-abrir="menu" aria-haspopup="dialog">${icones.menu}<span class="topo__menu-texto">Menu</span></button>
    <a class="topo__marca" href="${ctx.url('/')}">${logotipo(ctx, { alto: 82 })}<span class="visualmente-escondido"> — página inicial</span></a>
    <div class="topo__direita">
      ${c.whatsapp ? `<a class="topo__whatsapp" href="https://wa.me/${numeroWhatsApp(c.whatsapp)}" target="_blank" rel="noopener">${icones.whatsapp}<span class="topo__whatsapp-texto">Falar connosco<span class="visualmente-escondido"> no WhatsApp</span></span></a>` : ''}
      <a class="topo__carrinho" href="${ctx.url('/carrinho/')}" data-abrir="carrinho" aria-haspopup="dialog">${icones.carrinho}<span class="visualmente-escondido">Carrinho</span><span class="topo__conta" data-conta hidden></span></a>
    </div>
  </div>
</header>`;
}

function redes(ctx, classe = 'redes', { whatsapp = true } = {}) {
  const c = ctx.site.contactos;
  const r = [];
  if (c.instagram) r.push(`<a href="https://www.instagram.com/${esc(c.instagram)}/" target="_blank" rel="noopener">${icones.instagram}<span class="visualmente-escondido">Instagram</span></a>`);
  if (c.facebook) r.push(`<a href="https://www.facebook.com/${esc(c.facebook)}" target="_blank" rel="noopener">${icones.facebook}<span class="visualmente-escondido">Facebook</span></a>`);
  if (c.whatsapp && whatsapp) r.push(`<a href="https://wa.me/${numeroWhatsApp(c.whatsapp)}" target="_blank" rel="noopener">${icones.whatsapp}<span class="visualmente-escondido">WhatsApp</span></a>`);
  return `<ul class="${classe}">${r.map((x) => `<li>${x}</li>`).join('')}</ul>`;
}

/* O MENU (a gaveta da esquerda, em todas as larguras, como o do ithos): as categorias com a
   miniatura e quantos artigos têm, «Ver toda a loja», as páginas de informação e, em baixo, o
   WhatsApp, por onde chegam as encomendas. No telemóvel ocupa o ecrã; a partir de 48rem é um
   painel de lado, que nunca passa de metade do ecrã. As miniaturas vão sem texto alternativo:
   o nome da categoria está ao lado. */
function menu(ctx) {
  const linha = (href, conteudo) => `<li><a class="menu__linha" href="${href}">${conteudo}${icones.direita}</a></li>`;
  const cats = categoriasComArtigos(ctx).map((c) => linha(ctx.url(`/loja/${c.slug}/`),
    `<span class="menu__mini">${imagem(ctx, c.foto, { tamanhos: '64px', alt: '' })}</span><span class="menu__texto"><span class="menu__nome">${esc(c.nomeMenu || c.nome)}</span><span class="menu__conta">${quantosArtigos(ctx.produtos.filter((p) => p.categoria === c.slug).length)}</span></span>`)).join('');
  const c = ctx.site.contactos;
  return `<dialog class="menu" id="menu" aria-label="Menu">
  <div class="menu__corpo">
    <div class="menu__topo">
      <a class="menu__marca" href="${ctx.url('/')}">${logotipo(ctx, { alto: 52 })}</a>
      <button class="menu__fechar" type="button" data-fechar>${icones.fechar}<span class="visualmente-escondido">Fechar o menu</span></button>
    </div>
    <nav class="menu__nav" aria-label="Menu">
      <h2 class="menu__titulo" id="menu-loja">Loja</h2>
      <ul class="menu__lista" aria-labelledby="menu-loja">${cats}</ul>
      <a class="menu__tudo" href="${ctx.url('/loja/')}">Ver toda a loja · ${quantosArtigos(ctx.produtos.length)} ${icones.seta}</a>
      <ul class="menu__lista menu__lista--info">
        ${linha(ctx.url('/tons-de-linho/'), `<span class="menu__icone">${icones.paleta}</span><span class="menu__nome">Tons de linho</span>`)}
        ${linha(ctx.url('/como-encomendar/'), `<span class="menu__icone">${icones.whatsapp}</span><span class="menu__nome">Como encomendar</span>`)}
        ${linha(ctx.url('/sobre-nos/'), `<span class="menu__icone">${icones.laco}</span><span class="menu__nome">Sobre a Mimices</span>`)}
        ${linha(ctx.url('/contactos/'), `<span class="menu__icone">${icones.email}</span><span class="menu__nome">Contactos</span>`)}
      </ul>
    </nav>
    <div class="menu__pe">
      ${c.whatsapp ? `<a class="botao botao--whatsapp botao--largo" href="https://wa.me/${numeroWhatsApp(c.whatsapp)}" target="_blank" rel="noopener">${icones.whatsapp}<span>Falar connosco no WhatsApp</span></a>` : ''}
      ${redes(ctx, 'redes redes--menu', { whatsapp: false })}
    </div>
  </div>
</dialog>`;
}

/* O RODAPÉ, em quatro colunas como o do ithos: apoio ao cliente, a loja, as condições (as
   páginas legais) e os contactos. */
function rodape(ctx) {
  const c = ctx.site.contactos;
  const contactos = [];
  if (c.whatsapp) contactos.push(`<li><a href="https://wa.me/${numeroWhatsApp(c.whatsapp)}" target="_blank" rel="noopener">${icones.whatsapp}<span>WhatsApp ${esc(ctx.numeroLegivel(c.whatsapp))}</span></a><span class="rodape__nota">${esc(ctx.custoChamada(c.whatsapp))}</span></li>`);
  if (c.email) contactos.push(`<li><a href="mailto:${esc(c.email)}">${icones.email}<span>${esc(c.email)}</span></a></li>`);
  contactos.push(`<li><span class="rodape__local">${icones.local}<span>${esc(ctx.site.local.localidade)}, ${esc(ctx.site.local.distrito)}</span></span></li>`);
  return `<footer class="rodape">
  <div class="rodape__grelha">
    <div class="rodape__coluna">
      <h2>Apoio ao cliente</h2>
      <ul>
        <li><a href="${ctx.url('/como-encomendar/')}">Como encomendar</a></li>
        <li><a href="${ctx.url('/perguntas-frequentes/')}">Perguntas frequentes</a></li>
        <li><a href="${ctx.url('/tons-de-linho/')}">Tons de linho</a></li>
        <li><a href="${ctx.url('/desistir/')}">Desistir de uma compra</a></li>
        <li><a href="${LIVRO}" target="_blank" rel="noopener">Livro de Reclamações</a></li>
      </ul>
    </div>
    <div class="rodape__coluna">
      <h2>A loja</h2>
      <ul>
        ${categoriasComArtigos(ctx).map((k) => `<li><a href="${ctx.url(`/loja/${k.slug}/`)}">${esc(k.titulo)}</a></li>`).join('')}
        <li><a href="${ctx.url('/loja/')}">Toda a loja</a></li>
        <li><a href="${ctx.url('/sobre-nos/')}">Sobre a Mimices</a></li>
      </ul>
    </div>
    <div class="rodape__coluna">
      <h2>Condições</h2>
      <ul>
        <li><a href="${ctx.url('/termos-e-condicoes/')}">Termos e condições</a></li>
        <li><a href="${ctx.url('/politica-de-privacidade/')}">Política de privacidade</a></li>
        <li><a href="${ctx.url('/politica-de-cookies/')}">Política de cookies</a></li>
        <li><a href="${ctx.url('/garantia/')}">Garantia legal</a></li>
        <li><a href="${ctx.url('/resolucao-de-litigios/')}">Resolução de litígios</a></li>
      </ul>
    </div>
    <div class="rodape__coluna rodape__coluna--contactos">
      <h2>Fale connosco</h2>
      <ul class="rodape__contactos">${contactos.join('')}</ul>
      ${redes(ctx, 'redes redes--rodape', { whatsapp: false })}
    </div>
  </div>
  <div class="rodape__fim">
    <p>© ${ctx.hoje.slice(0, 4)} ${esc(ctx.site.marca)} · ${esc(ctx.site.assinatura)}</p>
  </div>
</footer>`;
}

function gavetaCarrinho() {
  return `<dialog class="gaveta" id="carrinho" aria-labelledby="carrinho-titulo">
  <div class="gaveta__corpo">
    <div class="gaveta__topo">
      <h2 id="carrinho-titulo">O seu carrinho</h2>
      <button class="gaveta__fechar" type="button" data-fechar>${icones.fechar}<span class="visualmente-escondido">Fechar o carrinho</span></button>
    </div>
    <div class="gaveta__conteudo" data-carrinho-gaveta>
      <p class="gaveta__vazio">O carrinho está vazio.</p>
    </div>
  </div>
</dialog>`;
}

export function pagina(ctx, { titulo, descricao, caminho, conteudo, partilha, tipo = 'website', jsonld = [], classe = '', indexar = true }) {
  const tituloCompleto = titulo.includes(ctx.site.marca) ? titulo : `${titulo} | ${ctx.site.marca}`;
  const cartao = partilha || ctx.manifesto.partilha._site;
  const l = ctx.manifesto.logo;
  const imgAbs = ctx.absoluto(`/assets/img/${cartao}`);
  return `<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(tituloCompleto)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${ctx.absoluto(caminho)}">
${!ctx.producao ? '<meta name="robots" content="noindex, nofollow">\n' : indexar === false ? '<meta name="robots" content="noindex">\n' : ''}<meta property="og:type" content="${tipo}">
<meta property="og:site_name" content="${esc(ctx.site.marca)}">
<meta property="og:locale" content="pt_PT">
<meta property="og:title" content="${esc(tituloCompleto)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${ctx.absoluto(caminho)}">
<meta property="og:image" content="${imgAbs}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(ctx.site.marca)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FBF7F2">
<link rel="icon" type="image/png" sizes="32x32" href="${ctx.asset(`img/${l.icones[32]}`)}">
<link rel="icon" type="image/png" sizes="48x48" href="${ctx.asset(`img/${l.icones[48]}`)}">
<link rel="apple-touch-icon" href="${ctx.asset(`img/${l.icones.apple}`)}">
<link rel="preload" href="${ctx.asset('fontes/montserrat-latin.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${ctx.asset('fontes/cormorant-latin.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${ctx.asset(ctx.ficheiros.css)}">
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`).join('\n')}
<script src="${ctx.asset(ctx.ficheiros.js)}" defer></script>
</head>
<body class="${esc(classe)}" data-catalogo="${ctx.asset(ctx.ficheiros.catalogo)}" data-base="${ctx.url('/')}">
<a class="saltar" href="#conteudo">Saltar para o conteúdo</a>
${aviso(ctx)}
${cabecalho(ctx)}
<main id="conteudo" tabindex="-1">
${conteudo}
</main>
${rodape(ctx)}
${gavetaCarrinho()}
${menu(ctx)}
</body>
</html>
`;
}
