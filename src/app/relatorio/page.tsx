import { Metadata } from 'next'
import Image, { StaticImageData } from 'next/image'
import img01 from '../../../image/image_01.webp'
import img02 from '../../../image/image_02.webp'
import img03 from '../../../image/image_03.webp'
import img04 from '../../../image/image_04.webp'
import img05 from '../../../image/image_05.webp'
import img06 from '../../../image/image_06.webp'
import vtec500 from '../../../image/VTEC 500.webp'
import vtec2000 from '../../../image/VTEC 2000.webp'
import vtec4000 from '../../../image/VTEC 4000.webp'
import vtec8000 from '../../../image/VTEC 8000.webp'
import vtec12000 from '../../../image/VTEC 12000.webp'
import vtec2000TorreTriturador from '../../../image/VTEC 2000 TORRE COM TRITURADOR.png'
import vtec2000Triturador from '../../../image/VTEC 2000 TRITURADOR.png'
import { Poppins } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Relatório',
  description: 'Visualização de relatórios',
}

const poppins = Poppins({ subsets: ['latin'], weight: ['500', '700'] })

export default function RelatorioPage({
  searchParams,
}: {
  searchParams?: { pessoa?: string; modelo?: string; nome_equipamento?: string; valor?: string; id?: string; fone?: string }
}) {
  const pessoa = typeof searchParams?.pessoa === 'string' ? searchParams.pessoa : undefined
  const valor = typeof searchParams?.valor === 'string' ? searchParams.valor : undefined
  const nomeEquip = typeof searchParams?.nome_equipamento === 'string' ? searchParams.nome_equipamento : undefined
  const nomeKey = nomeEquip?.trim().toUpperCase()
  const id = typeof searchParams?.id === 'string' ? searchParams.id : undefined
  const fone = typeof searchParams?.fone === 'string' ? searchParams.fone : undefined
  const equipMap: Record<string, StaticImageData> = {
    'VTEC-500': vtec500,
    'VTEC-2000': vtec2000,
    'VTEC-2000 TRITURADOR': vtec2000Triturador,
    'VTEC-2000 TORRE COM TRITURADOR': vtec2000TorreTriturador,
    'VTEC-4000': vtec4000,
    'VTEC-8000': vtec8000,
    'VTEC-12000': vtec12000,
    'VTEC-2000 TANQUE': vtec2000,
    'VTEC-2000 TANQUE TRITURADOR': vtec2000Triturador,
  }
  const equipImg = nomeKey ? equipMap[nomeKey] : undefined
  return (
    <main style={{ padding: 24, maxWidth: 793, margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Image
          src={img01}
          alt="Imagem de cabeçalho"
          priority
          sizes="(max-width: 793px) 100vw, 793px"
          style={{ width: '100%', height: 'auto' }}
        />
      </header>
      <div className={poppins.className} style={{ marginTop: 50, fontSize: 18, fontWeight: 500, color: '#128f7f' }}>
        Olá, {pessoa ?? 'nome _pessoa'}
      </div>
      <p
        className={poppins.className}
        style={{
          marginTop: 16,
          fontSize: 16,
          fontWeight: 500,
          color: '#252525',
          fontStyle: 'italic',
          lineHeight: 1.5,
        }}
      >
        Parabéns! Você avançou mais uma etapa importante para a realização do seu mais novo negócio.
        <br />
        Vamos te ajudar em todas as fases necessárias para que o seu sonho de empreender se torne realidade
        <br />
        muito em breve.
      </p>
      <p
        className={poppins.className}
        style={{
          marginTop: 16,
          fontSize: 16,
          fontWeight: 500,
          color: '#252525',
          fontStyle: 'italic',
          lineHeight: 1.5,
        }}
      >
        Você está a um passo de fazer parte do maior{' '}
        <span style={{ fontWeight: 700, color: '#000000' }}>ECOSSISTEMA DE HIDROSSEMEADURA DO</span>{' '}
        <span style={{ fontWeight: 700, color: '#000000' }}>HEMISFÉRIO SUL, a VERDETEC!</span>
      </p>
      <div style={{ marginTop: 16 }}>
        <Image
          src={img02}
          alt="Imagem 2"
          priority
          sizes="(max-width: 793px) 100vw, 793px"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div style={{ marginTop: 50 }}>
        <Image
          src={img03}
          alt="Imagem 3"
          priority
          sizes="(max-width: 793px) 100vw, 793px"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div style={{ marginTop: 50 }}>
        <Image
          src={img04}
          alt="Imagem 4"
          priority
          sizes="(max-width: 793px) 100vw, 793px"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div style={{ marginTop: 50 }}>
        <Image
          src={img05}
          alt="Imagem 5"
          priority
          sizes="(max-width: 793px) 100vw, 793px"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      {equipImg && (
        <div style={{ marginTop: 16 }}>
          <Image
            src={equipImg}
            alt={nomeEquip ?? 'Imagem modelo'}
            priority
            sizes="(max-width: 793px) 100vw, 793px"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      )}
      <p
        className={poppins.className}
        style={{
          marginTop: 40,
          fontSize: 18,
          fontWeight: 700,
          color: '#252525',
          fontStyle: 'italic',
          lineHeight: 1.5,
        }}
      >
        {pessoa ?? 'Rodrigo'}
        <br />
        Investimento inicial para o seu novo negócio:
        <br />
        {valor ?? '162.000,00'}
      </p>
      <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
        <Image
          src={img06}
          alt="Imagem 6 centralizada"
          priority
          sizes="300px"
          style={{ width: 300, height: 'auto' }}
        />
      </div>
      <div
        className={poppins.className}
        style={{
          marginTop: 50,
          fontSize: 16,
          fontWeight: 500,
          color: '#252525',
          fontStyle: 'italic',
          lineHeight: 1.5,
        }}
      >
        <ul style={{ listStyleType: 'disc', paddingLeft: 20, margin: 0 }}>
          <li>Clientes que não contribuem com o ICMS devem informar á vendedora para inserção dos impostos interestaduais</li>
          <li>Orçamento válido por 30 dias</li>
          <li>*O investimento apresentado não contempla os acessórios opcionais</li>
          <li>Número de identificação: {id ?? '75896969'}</li>
          <li>Número de Telefone do Orçamento:  {fone ?? '(43)99774110'}</li>
        </ul>
      </div>
    </main>
  )
}