import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacidade — Happyday",
  description: "O que fazemos (e o que não fazemos) com seus dados.",
};

export default function PrivacidadePage() {
  return (
    <LegalPage title="Política de privacidade" updated="29 de agosto de 2026">
      <section>
        <p>
          Este produto guarda fotos de pessoas reais em momentos íntimos. Essa
          página existe pra dizer exatamente o que acontece com elas.
        </p>
      </section>

      <section>
        <h2>O que guardamos</h2>
        <ul>
          <li>
            <strong>As fotos que você envia.</strong> Ficam no nosso servidor
            para montar e exibir o seu site.
          </li>
          <li>
            <strong>O texto que você escreve.</strong> Nomes, datas, a carta,
            as legendas.
          </li>
          <li>
            <strong>Seu e-mail.</strong> Só é pedido no momento do pagamento,
            e serve para enviar o link do site, o link de edição e o aviso de
            vencimento.
          </li>
          <li>
            <strong>Registro do pagamento.</strong> Valor, plano, status e o
            identificador da transação no Mercado Pago.
          </li>
        </ul>
      </section>

      <section>
        <h2>O que apagamos antes de guardar</h2>
        <p>
          Toda foto enviada passa por um processamento que <strong>remove os
          metadados EXIF</strong> — modelo da câmera, data, e principalmente a{" "}
          <strong>coordenada de GPS de onde a foto foi tirada</strong>. Um
          álbum de casal costuma ser tirado em casa; essa informação não tem
          por que sobreviver a um upload e não sobrevive.
        </p>
      </section>

      <section>
        <h2>O que não fazemos</h2>
        <ul>
          <li>Não usamos Google Analytics, pixel do Facebook ou similar</li>
          <li>Não colocamos cookie de rastreamento — o único cookie do site é o de login do painel administrativo</li>
          <li>Não vendemos, alugamos nem compartilhamos seus dados</li>
          <li>Não usamos suas fotos em divulgação, exemplo ou treinamento de modelo</li>
          <li>Não lemos sua carta, exceto se houver denúncia sobre aquele site</li>
        </ul>
      </section>

      <section>
        <h2>Quem tem acesso ao seu site</h2>
        <p>
          Somente quem tiver o link. Todo site publicado é marcado como
          não-indexável, então não aparece em busca do Google. O link não é
          adivinhável, mas também não é secreto: quem receber pode repassar.
        </p>
      </section>

      <section>
        <h2>Quem mais processa seus dados</h2>
        <ul>
          <li>
            <strong>Mercado Pago</strong> — processa o pagamento. Os dados do
            seu cartão vão direto para eles e nunca passam pelo nosso
            servidor.
          </li>
          <li>
            <strong>Nosso provedor de e-mail</strong> — entrega a mensagem
            com os links.
          </li>
        </ul>
        <p>Não há mais ninguém.</p>
      </section>

      <section>
        <h2>Por quanto tempo</h2>
        <p>
          Enquanto o site estiver no ar, mais 30 dias após o vencimento.
          Rascunhos abandonados são apagados automaticamente depois de 30
          dias sem edição — com as fotos junto.
        </p>
      </section>

      <section>
        <h2>Seus direitos (LGPD)</h2>
        <p>
          Você pode pedir a qualquer momento acesso, correção, exportação ou
          exclusão dos seus dados, escrevendo para{" "}
          <a href="mailto:privacidade@happyday.com.br">
            privacidade@happyday.com.br
          </a>
          . Pedidos de exclusão são atendidos em até 7 dias e apagam também
          as fotos do servidor e dos backups seguintes.
        </p>
        <p>
          Se uma foto sua foi publicada por outra pessoa sem sua autorização,
          escreva para{" "}
          <a href="mailto:denuncia@happyday.com.br">
            denuncia@happyday.com.br
          </a>{" "}
          — esses pedidos têm prioridade.
        </p>
      </section>

      <section>
        <p className="text-sm text-white/45">
          Veja também os <Link href="/termos">Termos de uso</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
