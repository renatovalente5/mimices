#!/usr/bin/env node
// Testes do gerador da Mimices (Node 22, sem dependências nem browser).
//
//   node scripts/testar.mjs          (precisa da cache das imagens: python3 scripts/imagens.py)
//
// Cada construção faz-se com o --conteudo= e o --saida= do gerador, numa pasta temporária, a partir de
// uma cópia do content/ e com a cache das imagens (--sem-imagens): nunca se mexe no content/ nem no
// _site/. O CONTEÚDO É DA SUSANA, QUE O MUDA NO PAINEL: os testes não afirmam o que o content/ diz hoje;
// cada um põe na sua cópia os dados de que precisa (e as páginas de ensaio são só dele).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { esc } from '../src/templates/util.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const comeco = Date.now();
let passaram = 0;
let falharam = 0;
function teste(nome, fn) {
  try {
    fn();
    passaram++;
    console.log(`  ✓ ${nome}`);
  } catch (e) {
    falharam++;
    process.exitCode = 1;
    console.error(`  ✗ ${nome}\n${e.stack}`);
  }
}

if (!fs.existsSync(path.join(RAIZ, '.cache/imagens/manifesto.json'))) {
  console.error('  ✗ Faltam as imagens (.cache/imagens): corra primeiro «python3 scripts/imagens.py».');
  process.exit(1);
}
const temporaria = fs.mkdtempSync(path.join(os.tmpdir(), 'mimices-teste-'));
process.on('exit', () => fs.rmSync(temporaria, { recursive: true, force: true }));

/* Uma cópia do content/ (o media/, os modelos e a cache das imagens são sempre os do repositório). */
function conteudo(nome) {
  const destino = path.join(temporaria, nome, 'content');
  fs.cpSync(path.join(RAIZ, 'content'), destino, { recursive: true });
  return destino;
}
/* O gerador sobre essa cópia, para o _site/ ao lado dela. Sem o GITHUB_ACTIONS: as anotações ::error
   das construções que param de propósito não podem chegar ao painel. */
function construir(dir, args = []) {
  const saida = path.join(path.dirname(dir), '_site');
  const r = spawnSync(process.execPath, ['scripts/build.mjs', '--sem-imagens', `--conteudo=${dir}`, `--saida=${saida}`, ...args], { cwd: RAIZ, encoding: 'utf8', env: { ...process.env, GITHUB_ACTIONS: '' } });
  return { saida, codigo: r.status, texto: `${r.stdout}\n${r.stderr}` };
}
function json(dir, rel, mudar) {
  const f = path.join(dir, rel);
  const dados = JSON.parse(fs.readFileSync(f, 'utf8'));
  mudar(dados);
  fs.writeFileSync(f, `${JSON.stringify(dados, null, 2)}\n`);
}

/* Os parágrafos partidos no <main> de uma página: o texto que fica solto onde entra o Markdown das
   páginas de texto (o artigo, a introdução, os passos, os cartões e as respostas), fora de um <p>, de um
   título ou de uma lista (um parágrafo que perdeu o <p> e se cola ao de baixo), e um bloco dentro de um
   <p> (o browser fecha o <p> antes dele). → as descrições */
const DO_MARKDOWN = /(^|\s)(texto|texto__intro|passo__texto|nota-cartao|pergunta__resposta)(\s|$)/;
const BLOCOS = new Set(['article', 'aside', 'blockquote', 'details', 'div', 'dl', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'nav', 'ol', 'p', 'pre', 'section', 'table', 'ul']);
const COM_TEXTO = new Set([...BLOCOS, 'li', 'dd', 'dt', 'td', 'th', 'caption', 'figcaption', 'summary', 'legend', 'label', 'button']);
const VAZIOS = new Set(['area', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
function paragrafosPartidos(html) {
  const main = html.slice(html.indexOf('<main'), html.indexOf('</main>')).replace(/<!--[\s\S]*?-->|<(svg|script|style|template)\b[\s\S]*?<\/\1>/g, '');
  const pilha = [];
  const out = [];
  for (const [, fecho, etiqueta, atributos, texto] of main.matchAll(/<(\/?)([a-zA-Z][\w-]*)([^>]*)>|([^<]+)/g)) {
    if (texto !== undefined) {
      if (!texto.trim()) continue;
      for (let i = pilha.length - 1; i >= 0; i--) {
        if (/^(a|button)$/.test(pilha[i].nome) && pilha[i].classe) break; // um botão ou uma ligação dos modelos
        if (COM_TEXTO.has(pilha[i].nome)) {
          if (DO_MARKDOWN.test(pilha[i].classe)) out.push(`texto fora de um parágrafo: «${texto.trim().slice(0, 60)}»`);
          break;
        }
      }
      continue;
    }
    const nome = etiqueta.toLowerCase();
    if (fecho) {
      const i = pilha.map((x) => x.nome).lastIndexOf(nome);
      if (i >= 0) pilha.length = i;
      continue;
    }
    if (BLOCOS.has(nome) && pilha.some((x) => x.nome === 'p')) out.push(`<${nome}> dentro de um <p>`);
    if (!VAZIOS.has(nome) && !atributos.endsWith('/')) pilha.push({ nome, classe: /\sclass="([^"]*)"/.exec(atributos)?.[1] || '' });
  }
  return out;
}

// ---------------------------------------------------------------- páginas de texto
console.log('páginas de texto (content/paginas, com os marcadores {{…}})');
const PRAZO = 'Entre duas e três semanas, depois de confirmada a encomenda.';
const PAGAMENTO = 'MB WAY ou transferência bancária.';

teste('um parágrafo que é só um marcador fica num <p> (os portes, a identificação, o pagamento e o prazo por dizer…) e os de bloco não (os botões, o quadro, a lista, os parágrafos da privacidade, a figura)', () => {
  const dir = conteudo('marcadores-sozinhos');
  const pagina = path.join(dir, 'paginas/ensaio-marcadores.md');
  // os marcadores que existem, pelo próprio gerador (um marcador que não existe pára-o e diz quais há)
  fs.writeFileSync(pagina, 'titulo: Ensaio dos marcadores\n---\n{{ensaio.inexistente}}\n');
  const lista = construir(dir);
  const marcadores = /o marcador «\{\{ensaio\.inexistente\}\}» não existe \(existem: ([^)]+)\)/.exec(lista.texto)?.[1].split(', ') || [];
  assert.ok(lista.codigo !== 0 && marcadores.includes('portes') && marcadores.includes('avisoGarantia'), `o gerador não disse os marcadores que existem:\n${lista.texto}`);
  // uma página só dos testes (as de content/paginas são do Renato), com cada marcador sozinho num parágrafo
  fs.writeFileSync(pagina, `titulo: Ensaio dos marcadores\n---\n${marcadores.map((m) => `## Ensaio ${m}\n\n{{${m}}}\n`).join('\n')}`);
  const paginas = fs.readdirSync(path.join(dir, 'paginas')).filter((f) => f.endsWith('.md')).map((f) => `${f.slice(0, -3)}/index.html`);
  // com o prazo e o pagamento por dizer (os «[por confirmar: …]») e com eles ditos
  for (const [quando, prazo, pagamento] of [['por dizer', '', ''], ['ditos', PRAZO, PAGAMENTO]]) {
    json(dir, 'site.json', (s) => { Object.assign(s.entrega, { prazo, pagamento }); });
    const r = construir(dir);
    assert.equal(r.codigo, 0, `prazo e pagamento ${quando}: não construiu\n${r.texto}`);
    const ensaio = fs.readFileSync(path.join(r.saida, 'ensaio-marcadores/index.html'), 'utf8');
    assert.ok(ensaio.includes('<p>Enviamos por CTT Expresso.'), `prazo e pagamento ${quando}: os portes sozinhos não ficaram num <p>`);
    if (pagamento) {
      for (const t of [PAGAMENTO, PRAZO]) assert.ok(ensaio.includes(`<p>${esc(t)}</p>`), `«${t}» sozinho não ficou num <p>`);
    } else {
      assert.ok(ensaio.includes('<p><mark class="por-confirmar">[por confirmar: as formas de pagamento'), 'o pagamento por dizer, sozinho, não ficou num <p>');
    }
    for (const rel of paginas) assert.deepEqual(paragrafosPartidos(fs.readFileSync(path.join(r.saida, rel), 'utf8')), [], `prazo e pagamento ${quando}: ${rel}`);
  }
});

const segundos = ((Date.now() - comeco) / 1000).toFixed(1);
console.log(`\n${falharam ? `${falharam} ${falharam === 1 ? 'teste falhou' : 'testes falharam'} (${passaram} passaram, ${segundos} s).` : `${passaram} ${passaram === 1 ? 'teste passou' : 'testes passaram'} (${segundos} s).`}`);
