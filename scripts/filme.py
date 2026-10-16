#!/usr/bin/env python3
"""O filme da capa: as fotografias da Mimices com um movimento de câmara lento, em ciclo.

    /usr/bin/python3 scripts/filme.py            # faz os dois cortes e as duas imagens paradas
    /usr/bin/python3 scripts/filme.py --amostra  # o início e o fim de cada plano, em .cache/ (os enquadramentos)

Escreve em media/capa/:
  filme-largo.mp4   16:9, 1600×900  (o computador e o tablet deitado)
  filme-alto.mp4    2:3,   720×1080 (o telemóvel)
  filme-largo.jpg   o primeiro fotograma de cada corte: é a imagem que está por baixo do filme
  filme-alto.jpg    (o scripts/imagens.py faz-lhe as versões web)

PORQUE NÃO SÃO OS VÍDEOS QUE A SUSANA MANDOU (15 out 2026). São seis, 480×864, filmados à mão: medidos
fotograma a fotograma (correlação de fase), andam 100 a 300 px por segundo com um tremor de 50 a 100
px/s — de mais para o fundo de uma capa, e pequenos de mais para um ecrã de computador (ampliar 480 px
a 1600 é ampliar mais de três vezes). As fotografias dela têm 1440 a 2400 px: o movimento é inventado
aqui, devagar e sem tremer, e a nitidez é a delas.

PORQUE DOIS CORTES (o mesmo que no ithos): a capa é larga no computador e alta no telemóvel, e um filme
16:9 metido numa moldura 2:3 perde dois terços da largura — onde estão as velas. Cada plano tem o seu
enquadramento em cada corte.

PORQUE O CICLO NÃO TEM COSTURA: o último plano desvanece para o primeiro, que já está a mexer-se; o
filme começa nesse primeiro plano no instante em que a transição acaba, e por isso, quando volta ao
princípio, o movimento continua sem salto.

AS IMAGENS PARADAS SÃO O PRIMEIRO FOTOGRAMA DE CADA CORTE (o que o ithos aprendeu): o que aparece antes
de o filme arrancar — e o que fica para quem pediu menos movimento, ou quando o telemóvel recusa vídeos
— é o próprio filme parado, e nada muda quando ele começa.

Precisa do Pillow e do numpy (o /usr/bin/python3 do Mac tem os dois) e do ffmpeg.
"""
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageOps

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
FOTOS = os.path.join(RAIZ, 'media', 'fotos')
SAIDA = os.path.join(RAIZ, 'media', 'capa')

FPS = 25
PLANO = 5.2        # segundos de cada plano, contando com as duas transições
TRANSICAO = 1.4    # segundos de cada transição (os dois planos sobrepostos)
CRF = {'largo': 30, 'alto': 30}   # o do ithos: a trama do linho aguenta-se, e o véu da capa esconde o resto
CORTES = {
    'largo': (1600, 900),
    'alto': (720, 1080),
}

# OS PLANOS. Para cada corte, o enquadramento no início e no fim do plano: o centro (x, y, de 0 a 1
# na fotografia) e a largura da janela (fração da largura da fotografia). A altura sai da forma do
# corte. Uma janela que saia da fotografia é empurrada para dentro.
PLANOS = [
    # as oito velas, cada laço no seu tom (a capa do Facebook da Mimices)
    ('capa-velas-de-batismo', {
        'largo': ((0.49, 0.50, 0.97), (0.55, 0.52, 0.86)),
        'alto': ((0.30, 0.50, 0.36), (0.50, 0.50, 0.36)),
    }),
    # o conjunto em linho natural: a vela, a concha e a toalha bordada
    ('conjunto-linho-classico', {
        'largo': ((0.50, 0.40, 0.95), (0.52, 0.44, 0.84)),
        'alto': ((0.48, 0.45, 0.80), (0.50, 0.42, 0.70)),
    }),
    # os laços, do rosa ao azul
    ('lacos-de-linho', {
        'largo': ((0.50, 0.33, 0.94), (0.50, 0.55, 0.94)),
        'alto': ((0.70, 0.36, 0.55), (0.70, 0.60, 0.55)),
    }),
    # o conjunto azul do Tomás
    ('conjunto-linho-azul', {
        'largo': ((0.50, 0.50, 1.00), (0.52, 0.56, 0.90)),
        'alto': ((0.50, 0.50, 0.85), (0.45, 0.52, 0.72)),
    }),
    # quatro velas, quatro tons
    ('velas-quatro-cores', {
        'largo': ((0.50, 0.52, 0.98), (0.50, 0.56, 0.88)),
        'alto': ((0.30, 0.55, 0.50), (0.62, 0.55, 0.50)),
    }),
    # as lembranças: ímanes de madeira com a pomba
    ('iman-pomba-branca', {
        'largo': ((0.50, 0.56, 1.00), (0.50, 0.64, 0.90)),
        'alto': ((0.45, 0.50, 0.75), (0.50, 0.55, 0.65)),
    }),
]


def abrir(nome):
    im = Image.open(os.path.join(FOTOS, f'{nome}.jpg'))
    return ImageOps.exif_transpose(im).convert('RGB')


def janela(foto, centro, forma):
    """A janela (x0, y0, largura, altura) em px da fotografia, empurrada para dentro dela."""
    W, H = foto
    cx, cy, w = centro
    ww = w * W
    hh = ww / forma
    if hh > H:                      # alta de mais para a fotografia: encolhe
        hh = H
        ww = hh * forma
    x0 = min(max(cx * W - ww / 2, 0), W - ww)
    y0 = min(max(cy * H - hh / 2, 0), H - hh)
    return x0, y0, ww, hh


class Plano:
    """Uma fotografia preparada para um corte: reduzida uma vez (LANCZOS) para que a janela maior
    fique perto do tamanho da saída — a transformação bicúbica do Pillow não filtra ao reduzir, e
    uma janela muito maior do que a saída dava serrilhado nas tramas do linho."""

    def __init__(self, nome, enquadramentos, corte):
        self.nome = nome
        foto = abrir(nome)
        W, H = CORTES[corte]
        forma = W / H
        a, b = enquadramentos[corte]
        ja, jb = janela(foto.size, a, forma), janela(foto.size, b, forma)
        maior = max(ja[2], jb[2])
        escala = min(1.0, 1.15 * W / maior)
        if escala < 1.0:
            foto = foto.resize((round(foto.width * escala), round(foto.height * escala)), Image.LANCZOS)
        self.foto = foto
        self.saida = (W, H)
        self.a = tuple(v * escala for v in ja)
        self.b = tuple(v * escala for v in jb)

    def quadro(self, p):
        """O fotograma no ponto p (0 a 1) do plano: a janela anda a direito do início ao fim
        (velocidade constante, como uma câmara — com aceleração parecia uma apresentação)."""
        x0, y0, ww, hh = (va + (vb - va) * p for va, vb in zip(self.a, self.b))
        W, H = self.saida
        dados = (ww / W, 0, x0, 0, hh / H, y0)
        return np.asarray(self.foto.transform((W, H), Image.AFFINE, dados, resample=Image.BICUBIC), dtype=np.float32)


def suave(x):
    x = min(max(x, 0.0), 1.0)
    return x * x * (3 - 2 * x)


def fotogramas(corte):
    """Os fotogramas do ciclo, um a um. O plano i ocupa [i·(PLANO−TRANSICAO) − TRANSICAO, … + PLANO):
    o primeiro começa antes do zero (a sua entrada é o fim do ciclo, por cima do último plano)."""
    planos = [Plano(n, e, corte) for n, e in PLANOS]
    passo = PLANO - TRANSICAO
    ciclo = len(planos) * passo
    total = round(ciclo * FPS)
    inicio = [i * passo - TRANSICAO for i in range(len(planos))]
    for f in range(total):
        t = f / FPS
        camadas = []
        for i, pl in enumerate(planos):
            for tt in (t, t - ciclo):
                u = tt - inicio[i]
                if 0 <= u < PLANO:
                    entrada = suave(u / TRANSICAO) if u < TRANSICAO else 1.0
                    camadas.append((inicio[i] + (ciclo if tt != t else 0), entrada, pl.quadro(u / PLANO)))
        camadas.sort(key=lambda c: c[0])           # o mais antigo por baixo
        img = camadas[0][2]
        for _, alfa, q in camadas[1:]:
            img = img * (1 - alfa) + q * alfa
        yield np.clip(img + 0.5, 0, 255).astype(np.uint8)


def codificar(corte):
    W, H = CORTES[corte]
    destino = os.path.join(SAIDA, f'filme-{corte}.mp4')
    tmp = destino + '.tmp.mp4'
    # BT.709 declarado dos dois lados: sem isto o browser pode descodificar com outra matriz, e as
    # cores do filme não batiam com as da imagem parada (um salto de cor quando ele arranca).
    cmd = ['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
           '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p,setparams=colorspace=bt709:color_primaries=bt709:color_trc=bt709:range=tv',
           '-c:v', 'libx264', '-preset', 'veryslow', '-tune', 'film', '-crf', str(CRF[corte]), '-profile:v', 'high',
           '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
           '-movflags', '+faststart', '-an', tmp]
    ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    primeiro = None
    n = 0
    for q in fotogramas(corte):
        if primeiro is None:
            primeiro = q
        ff.stdin.write(q.tobytes())
        n += 1
    ff.stdin.close()
    if ff.wait() != 0:
        sys.exit(f'o ffmpeg falhou no corte {corte}')
    os.replace(tmp, destino)
    Image.fromarray(primeiro).save(os.path.join(SAIDA, f'filme-{corte}.jpg'), quality=92, optimize=True, progressive=True)
    print(f'  filme-{corte}.mp4  {W}x{H}  {n / FPS:.1f} s  {os.path.getsize(destino) / 1e6:.2f} MB')


def amostra():
    """Uma folha por corte: o início e o fim de cada plano, lado a lado."""
    for corte, (W, H) in CORTES.items():
        esc = 360 / W if corte == 'largo' else 240 / W
        w, h = round(W * esc), round(H * esc)
        folha = Image.new('RGB', (2 * w + 30, len(PLANOS) * (h + 10)), 'white')
        for i, (n, e) in enumerate(PLANOS):
            pl = Plano(n, e, corte)
            for j, p in enumerate((0.0, 1.0)):
                q = Image.fromarray(np.clip(pl.quadro(p) + 0.5, 0, 255).astype(np.uint8)).resize((w, h), Image.LANCZOS)
                folha.paste(q, (j * (w + 30), i * (h + 10)))
        os.makedirs(os.path.join(RAIZ, '.cache'), exist_ok=True)
        destino = os.path.join(RAIZ, '.cache', f'filme-amostra-{corte}.jpg')
        folha.save(destino, quality=85)
        print(' ', destino)


def principal():
    os.makedirs(SAIDA, exist_ok=True)
    if '--amostra' in sys.argv:
        amostra()
        return
    for corte in CORTES:
        codificar(corte)


if __name__ == '__main__':
    principal()
