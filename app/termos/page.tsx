import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/LegalPage";
import { PLANS, formatPrice } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Termos de uso — Happyday",
  description: "As regras de uso do Happyday.",
};

export default function TermosPage() {
  return (
    <LegalPage title="Termos de uso" updated="29 de agosto de 2026">
      <section>
        <h2>O que é o serviço</h2>
        <p>
          O Happyday permite montar um site pessoal de presente com fotos,
          texto e música, hospedado por nós e acessível por um link. Você
          paga uma vez, sem assinatura e sem renovação automática.
        </p>
      </section>

      <section>
        <h2>Preço e hospedagem</h2>
        <p>
          Os planos são {formatPrice(PLANS.basico.priceCents)} (Básico) e{" "}
          {formatPrice(PLANS.premium.priceCents)} (Premium). Em ambos o site
          fica no ar por {PLANS.premium.hostingDays} dias contados da
          publicação. Avisamos por e-mail antes de vencer.
        </p>
        <p>
          Depois do vencimento o site deixa de ser exibido. Guardamos seus
          dados por mais 30 dias caso você queira renovar ou baixar suas
          fotos; passado esse prazo, apagamos.
        </p>
      </section>

      <section>
        <h2>Reembolso</h2>
        <p>
          Você monta o site inteiro e vê a prévia completa <strong>antes</strong>{" "}
          de pagar, então o que você compra é exatamente o que você já viu.
          Ainda assim, o Código de Defesa do Consumidor te dá 7 dias de
          arrependimento a partir da compra — nesse prazo, é só escrever e
          devolvemos o valor integral.
        </p>
      </section>

      <section>
        <h2>O link de edição</h2>
        <p>
          Não existe conta nem senha. O link de edição que você recebe por
          e-mail é a <strong>única</strong> forma de alterar seu site.
          Guarde-o: quem tiver esse link pode editar o site, e nós não temos
          como recuperá-lo nem reemiti-lo.
        </p>
      </section>

      <section>
        <h2>O que você não pode publicar</h2>
        <p>Você é responsável pelo conteúdo que enviar. Não é permitido:</p>
        <ul>
          <li>Imagens de nudez, conteúdo sexual ou violento</li>
          <li>Fotos de outra pessoa sem o consentimento dela</li>
          <li>Qualquer conteúdo envolvendo menores de forma imprópria</li>
          <li>Assédio, ameaça ou exposição de alguém contra a vontade</li>
          <li>Material protegido por direitos autorais que você não pode usar</li>
        </ul>
        <p>
          Sites que violarem isso são removidos sem reembolso, e casos graves
          são comunicados às autoridades.
        </p>
      </section>

      <section>
        <h2>Música</h2>
        <p>
          As faixas do nosso catálogo são criadas por nós e você pode usá-las
          livremente no seu site. Se o seu plano permitir enviar um arquivo
          próprio, a responsabilidade pelos direitos daquela música passa a
          ser sua.
        </p>
      </section>

      <section>
        <h2>Denúncias</h2>
        <p>
          Encontrou um site com conteúdo que viola estes termos, ou uma foto
          sua publicada sem autorização? Escreva para{" "}
          <a href="mailto:denuncia@happyday.com.br">denuncia@happyday.com.br</a>{" "}
          com o link. Analisamos em até 72 horas e removemos o que estiver
          irregular. Pedidos de remoção de foto própria têm prioridade.
        </p>
      </section>

      <section>
        <h2>Limites</h2>
        <p>
          Fazemos backup diário e monitoramos o serviço, mas não podemos
          garantir disponibilidade ininterrupta. Nossa responsabilidade em
          qualquer hipótese se limita ao valor que você pagou.
        </p>
      </section>

      <section>
        <p className="text-sm text-white/45">
          Veja também a{" "}
          <Link href="/privacidade">Política de Privacidade</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
