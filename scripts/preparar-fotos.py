#!/usr/bin/env python3
"""As fotografias e o logótipo da primeira versão do site, a partir do material da Mimices.

Corre-se uma vez, à mão (as fotografias seguintes entram pelo painel):

    python3 scripts/preparar-fotos.py

Lê, de _cliente/ (fora do git):
  whatsapp/2026-10-15/fotografias/   as 40 fotografias que a Susana mandou (1144×2040, ao alto)
  redes-sociais/instagram/*.webp     as publicações do Instagram (a primeira imagem de cada, 1440 px)
  redes-sociais/facebook/            o logótipo (1081×1081, fundo branco) e a capa (2048×1148)

Escreve:
  media/fotos/<nome>.jpg             cada fotografia inteira, sem cortes (o site corta pelo ponto de
                                     foco de content/fotos.json; o painel vê a inteira)
  media/marca/logo.png               o logótipo da Mimices com o fundo branco transparente. Não se
                                     redesenha nada: são os píxeis do ficheiro do Facebook. Só o branco
                                     de fora da mancha passa a transparente (com as bordas suaves).

Ficaram de fora, de propósito: as capturas de ecrã do telemóvel (susana-29, susana-37), a fotografia
com crianças nas molduras (susana-39) e a do Instagram com o bebé de touca (DeEPS60s1DF): o site não
mostra crianças sem uma autorização dos pais para o site (memória autorizacao-de-imagem-e-por-uso).
"""
import os
import sys


from PIL import Image, ImageFilter, ImageOps

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
CLIENTE = os.path.join(RAIZ, '_cliente')
WA = os.path.join(CLIENTE, 'whatsapp', '2026-10-15', 'fotografias')
IG = os.path.join(CLIENTE, 'redes-sociais', 'instagram')
FB = os.path.join(CLIENTE, 'redes-sociais', 'facebook')
FOTOS = os.path.join(RAIZ, 'media', 'fotos')
MARCA = os.path.join(RAIZ, 'media', 'marca')


def wa(n):
    """A fotografia n.º n (1–40) da conversa, pela ordem em que chegou."""
    nomes = sorted(f for f in os.listdir(WA) if f.endswith('.jpg'))
    return os.path.join(WA, nomes[n - 1])


def ig(sc):
    return os.path.join(IG, f'{sc}.webp')


# nome no site → origem
FOTOGRAFIAS = {
    # conjuntos com caixa (WhatsApp)
    'conjunto-caixa-tomas-azul': wa(3),
    'conjunto-caixa-tomas-azul-2': wa(1),
    'conjunto-caixa-salvador-verde': wa(19),
    'conjunto-caixa-lourenco-verde': wa(12),
    'conjunto-caixa-julia-rosa': wa(15),
    'conjunto-caixa-maria-eduarda-rosa': wa(13),
    'conjunto-caixa-maria-eduarda-rosa-2': wa(18),
    'conjunto-caixa-camila-bege': wa(21),
    'caixa-aberta-camila': wa(28),
    'caixa-salvador-sol-e-lua': wa(14),
    'caixas-de-batismo-tampas': wa(30),
    # conjuntos vela, toalha e concha (WhatsApp)
    'conjunto-tomas-azul': wa(2),
    'conjunto-mariana-rosa': wa(4),
    'conjunto-isabel-rosa': wa(5),
    'conjunto-constanca-rosa': wa(6),
    'conjunto-daniel-verde': wa(7),
    'conjunto-maria-eduarda-malva': wa(8),
    'conjunto-maria-eduarda-blush': wa(9),
    'conjunto-salvador-verde': wa(10),
    'conjunto-lourenco-verde': wa(11),
    'conjunto-julia-rosa': wa(16),
    'conjunto-maria-eduarda-rosa': wa(17),
    'conjunto-eva-rosa': wa(20),
    'conjunto-duarte-verde': wa(23),
    'conjunto-bernardo-bege': wa(24),
    'conjunto-frederica-cru': wa(25),
    'conjunto-mariana-bege': wa(27),
    # lembranças (WhatsApp)
    'disco-anjo-tomas': wa(31),
    'disco-ilustracao-santiago-carolina': wa(32),
    'disco-letra-beatriz': wa(33),
    'iman-acrilico-dourado-caetana': wa(34),
    'iman-acrilico-dourado-lucas': wa(35),
    'iman-pomba-dourada-maria': wa(36),
    'iman-ursinho-mathieu': wa(38),
    'lembranca-otavio-acrilico-branco': wa(40),
    # Instagram
    'tons-de-linho': ig('DeOaICMs6Wi'),
    'lacos-de-linho': ig('DeJkI2GskUI'),
    'velas-quatro-cores': ig('DYFA8XXDC1E'),
    'vela-concha-rosa': ig('DX_hZtIDCPe'),
    'vela-concha-verde-agua': ig('DXgfYWSDIJ5'),
    'conjunto-linho-azul': ig('DeYxsm-sU_w'),
    'conjunto-angelique': ig('DVa0yFmDLo3'),
    'conjunto-linho-classico': ig('DaPrgQmjJG8'),
    'vela-toalha-beatriz-rosa': ig('Dc8pEzvsbZS'),
    'conjunto-tiago-verde': ig('DdBMPH-sKW7'),
    'gesso-anjos-cartao': ig('DYZRe4yMBWg'),
    'iman-madeira-anjo-gesso': ig('DUSoV7BjAWd'),
    'oracao-asas-gesso': ig('DTAYM7hjFRE'),
    'oracao-anjo-da-guarda': ig('DXB-ZEljDUf'),
    'velinhas-lembranca-anjo': ig('Db2hM5dsoag'),
    'iman-pomba-dourada': ig('DXv-ORYDKQy'),
    'iman-pomba-branca': ig('DX1LjiADHMu'),
    'lembranca-oracao-salvador': ig('DUqCKYVjANf'),
    'porta-chaves-comunhao': ig('DUAmC64DFRC'),
    'lembranca-comunhao-gustavo': ig('DY4gHkBM1E1'),
    'convites-batismo': ig('DWY-qhFDEvV'),
    'convite-batismo-azul': ig('DXRSfJHjJNs'),
    'caixa-padrinhos': ig('DWBVSdijPn-'),
    'caixa-tampa-vidro-xavier': ig('DcvVMJwMGwD'),
    'velas-advento-quatro-semanas': ig('DegfEd8MWn_'),
    'vela-advento-25-dias': ig('DecCMAUMjbW'),
    'vela-natal-professora-pai-natal': ig('DeegVa1As46'),
    'vela-natal-professora-presepio': ig('DeQ8eRzs4pL'),
    'enfeites-natal-nomes': ig('DeJX9GssgRo'),
    'enfeite-linho-bordado': ig('DeRUijwM30y'),
    'decoracao-natal-familia': ig('DeMPpeGs7Xs'),
    'postal-natal-gesso': ig('DeJxbJBstz4'),
    # Facebook: a capa da página (as velas com os laços de linho)
    'capa-velas-de-batismo': os.path.join(FB, 'capa-facebook.png'),
}


# Recortes de uma fotografia (nome → (origem, caixa em píxeis da origem)): a toalha sozinha, sem a
# vela nem a concha ao lado — numa ficha da toalha, a fotografia do conjunto fazia pensar que vinham
# incluídas.
RECORTES = {
    'toalha-frederica': (wa(25), (20, 600, 700, 1450)),
    'toalha-mariana': (wa(27), (10, 650, 690, 1500)),
    'toalha-maria-eduarda': (wa(8), (20, 680, 700, 1530)),
}


def guardar_recorte(nome, origem, caixa):
    destino = os.path.join(FOTOS, f'{nome}.jpg')
    im = ImageOps.exif_transpose(Image.open(origem)).convert('RGB').crop(caixa)
    im.save(destino, 'JPEG', quality=92, optimize=True, progressive=True)
    return im.size


def guardar_foto(nome, origem):
    destino = os.path.join(FOTOS, f'{nome}.jpg')
    im = ImageOps.exif_transpose(Image.open(origem)).convert('RGB')
    im.save(destino, 'JPEG', quality=90, optimize=True, progressive=True)
    return im.size


def logo_transparente(origem, destino):
    """O branco de FORA do logótipo (ligado às bordas) passa a transparente; dentro dele nada muda.
    Nas bordas da mancha e das letras que saem dela, o «cor para alfa» contra o branco: a cor fica a
    mesma sobre um fundo branco, e sem halo branco sobre um fundo de cor."""
    im = Image.open(origem).convert('RGB')
    w, h = im.size
    px = im.load()
    claro = lambda c: min(c) >= 238   # quase branco
    # Todo o quase-branco é fundo, também o que fica preso entre as letras e a mancha (dentro da
    # mancha não há branco nenhum: é rosa, e as letras e o laço são cor de malva).
    fora = [[claro(px[x, y]) for x in range(w)] for y in range(h)]
    # ... menos os pontinhos claros que a compressão JPEG deixou DENTRO da mancha (grupos de poucos
    # píxeis): ficam opacos, senão eram furos. «Dentro» é a mancha rosa fechada (dilatar e erodir
    # 25 px tapa as letras e o laço; a borda de fora, que é convexa, não muda).
    rosa_px = lambda c: abs(c[0] - 235) <= 14 and abs(c[1] - 210) <= 14 and abs(c[2] - 206) <= 14
    mancha = Image.new('L', (w, h), 0)
    pm = mancha.load()
    for y in range(h):
        for x in range(w):
            if rosa_px(px[x, y]):
                pm[x, y] = 255
    mancha = mancha.filter(ImageFilter.MaxFilter(25)).filter(ImageFilter.MinFilter(25))
    pm = mancha.load()
    visto = [[False] * w for _ in range(h)]
    for y0 in range(h):
        for x0 in range(w):
            if not fora[y0][x0] or visto[y0][x0]:
                continue
            grupo, pilha = [], [(x0, y0)]
            visto[y0][x0] = True
            while pilha:
                x, y = pilha.pop()
                grupo.append((x, y))
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and fora[ny][nx] and not visto[ny][nx]:
                        visto[ny][nx] = True
                        pilha.append((nx, ny))
            if len(grupo) >= 40:
                continue
            # só os que estão dentro da mancha; um claro preso numa volta de uma letra fora da mancha
            # continua fundo
            if sum(1 for x, y in grupo if pm[x, y] == 255) * 2 > len(grupo):
                for x, y in grupo:
                    fora[y][x] = False
                    px[x, y] = (235, 210, 206)
    # bordas: os píxeis que tocam o branco de fora (até 3 px) passam pelo «cor para alfa»
    borda = [[False] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            if fora[y][x]:
                continue
            for dy in range(-3, 4):
                yy = y + dy
                if 0 <= yy < h and any(0 <= x + dx < w and fora[yy][x + dx] for dx in range(-3, 4)):
                    borda[y][x] = True
                    break
    out = Image.new('RGBA', (w, h))
    po = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if fora[y][x]:
                po[x, y] = (255, 255, 255, 0)
            elif borda[y][x]:
                a = max(255 - r, 255 - g, 255 - b) / 255   # quanto se afasta do branco
                if a <= 0.004:
                    po[x, y] = (255, 255, 255, 0)
                else:
                    cor = tuple(max(0, min(255, round((c - 255 * (1 - a)) / a))) for c in (r, g, b))
                    po[x, y] = cor + (round(a * 255),)
            else:
                po[x, y] = (r, g, b, 255)
    caixa = out.getbbox()
    out = out.crop(caixa)
    out.save(destino, 'PNG', optimize=True)
    return out.size


def principal():
    os.makedirs(FOTOS, exist_ok=True)
    os.makedirs(MARCA, exist_ok=True)
    faltam = [n for n, o in FOTOGRAFIAS.items() if not os.path.exists(o)]
    if faltam:
        sys.exit('faltam origens: ' + ', '.join(faltam))
    for nome, origem in FOTOGRAFIAS.items():
        w, h = guardar_foto(nome, origem)
        print(f'{nome}: {w}×{h}')
    for nome, (origem, caixa) in RECORTES.items():
        w, h = guardar_recorte(nome, origem, caixa)
        print(f'{nome} (recorte): {w}×{h}')
    print('logo:', logo_transparente(os.path.join(FB, 'logo-facebook.jpg'), os.path.join(MARCA, 'logo.png')))


if __name__ == '__main__':
    principal()
