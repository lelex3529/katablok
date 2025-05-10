import React from 'react';

interface PaymentTerm {
  label: string;
  percent: number;
  trigger: string;
}

interface PaymentTermsPageProps {
  paymentTerms?: PaymentTerm[];
  totalPrice?: number;
}

export default function PaymentTermsPage({
  paymentTerms = [],
  totalPrice = 0,
}: PaymentTermsPageProps) {
  return (
    <section aria-labelledby='payment-terms-heading'>
      <h2
        id='payment-terms-heading'
        className='text-2xl font-sora font-bold mb-6'
      >
        Modalités de paiement
      </h2>
      <div className='mb-6'>
        <p className='text-gray-600 mb-4'>
          Le coût total de {totalPrice.toLocaleString()}€ sera facturé selon
          l&apos;échéancier suivant :
        </p>
        {paymentTerms.length > 0 ? (
          <div className='bg-gray-50 rounded-lg p-6 mb-6'>
            <ul className='space-y-3'>
              {paymentTerms.map((term, index) => (
                <li key={index} className='flex items-start'>
                  <span
                    className='text-katalyx-primary mr-2 text-lg leading-6'
                    aria-hidden='true'
                  >
                    •
                  </span>
                  <span>
                    <strong>{term.label}</strong> (€
                    {Math.round(
                      (totalPrice * term.percent) / 100,
                    ).toLocaleString()}
                    ) {term.trigger}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className='bg-gray-50 rounded-lg p-6 mb-6 text-gray-500 italic'>
            Aucune modalité de paiement spécifiée.
          </div>
        )}
      </div>
      <div className='prose prose-gray max-w-none'>
        <h3 className='font-xl text-xl mb-2'>
          Conditions générales de vente de prestations de services
        </h3>
        <p>
          Les présentes Conditions Générales de Vente de Prestations de
          Services, ci-après désignées « Le contrat », sont conclues entre la
          société Katalyx, SAS dont le siège social est situé au 67 COURS
          MIRABEAU 13100 AIX-EN-PROVENCE et dont le SIRET est 94161492700015
          dénommée ci-après « Le prestataire », et toute personne physique ou
          morale souhaitant bénéficier des services de la société Katalyx,
          dénommée ci-après « Le client ».
        </p>
        <h4 className='font-semibold mt-4'>ARTICLE 1 – OBJET DU CONTRAT</h4>
        <p>
          Le contrat établit les relations commerciales entre le prestataire et
          le client. Le prestataire propose d&apos;effectuer sur demande du
          client, particulier ou société des prestations informatiques. En
          préalable à toute intervention, seront convenues, lors de la prise de
          contact entre les parties, la date, les prévisions de
          l&apos;intervention, après avoir répondu aux questions d&apos;un
          pré-diagnostic technique permettant de déterminer les conditions de la
          prestation.
        </p>
        <h4 className='font-semibold mt-4'>
          ARTICLE 2 – APPLICATION DES CONDITIONS GÉNÉRALES DE PRESTATIONS DE
          SERVICES – CLAUSE DE PARFAITE INFORMATION
        </h4>
        <p>
          Les présentes conditions générales de vente de prestations de services
          sont portées à la connaissance du client. L&apos;ensemble des clauses
          et conditions est réputé connu et expressément accepté par le client
          au moment de l&apos;acceptation du devis et même si celui-ci n&apos;a
          pas formellement apposé sa signature sur les présentes. En
          conséquence, le fait d&apos;accepter le devis du prestataire emporte
          acceptation pleine et entière des présentes conditions générales de
          prestations de services. Les conditions décrites sont susceptibles
          d&apos;évoluer et toute évolution fera l&apos;objet d&apos;un mail
          visant le client à accepter les nouvelles conditions.
        </p>
        <h4 className='font-semibold mt-4'>
          ARTICLE 3 – RELATIONS CONTRACTUELLES
        </h4>
        <p>
          Aucun appel téléphonique, ni rendez-vous, ne valent engagement ; les
          demandes de prestations doivent être présentées par le client au
          prestataire par email ou courrier. Les obligations entre les parties
          naissent de la signature d&apos;un bon de commande émis par le client
          ou du retour daté et signé du devis et /ou la facture que le
          prestataire aura transmis au client accompagné de son premier acompte.
          Le prestataire ne débutera aucun développement avant la réception de
          ces documents ; cette disposition est un élément essentiel du contrat.
        </p>
        <h4 className='font-semibold mt-4'>
          ARTICLE 4 – FORMATION DU CONTRAT-COMMANDE
        </h4>
        <p>
          La formation du contrat se réalise exclusivement par le renvoi du
          devis portant la mention &quot;bon pour accord&quot; par e-mail à
          l&apos;adresse suivante : contact@katalyx.fr. Le renvoi par e-mail de
          l&apos;acceptation expresse du devis par le client au prestataire vaut
          consentement irrévocable au contrat et validation des prix
          communiqués. Les commandes ne seront prises en compte qu&apos;au
          retour du devis signé et portant la mention &quot;bon pour
          accord&quot; et à la réception de l&apos;acompte. Il appartient au
          client de transmettre tous documents nécessaires au prestataire tels
          que textes, photos, logo... concernant la réalisation de son projet.
          La fourniture hors forfait telle que composition typographique,
          photographies et illustrations de toutes origines, documents
          d&apos;archives... éventuellement nécessaires à la réalisation du
          travail, ne sont pas comprises dans les prix indiqués sauf mention
          contraire. Les demandes complémentaires devront faire l&apos;objet
          d&apos;un devis signé dans les mêmes conditions que le précédent.
          Toute annulation de commande demandée par le client ne peut être prise
          en considération une fois le devis accepté. Les acomptes versés seront
          conservés à titre d&apos;indemnisation des efforts et propositions
          réalisés.
        </p>
        <h4 className='font-semibold mt-4'>
          ARTICLE 5 – CONDITIONS DE RÈGLEMENT
        </h4>
        <p>
          Les prestations doivent être réglées au prestataire aux dates
          mentionnées sur le devis et/ou la facture client. Le client
          s&apos;engage à respecter ces dates de paiement ; cette disposition
          est aussi un élément essentiel du contrat.
        </p>
        <h4 className='font-semibold mt-4'>ARTICLE 6 – LA FORCE MAJEURE</h4>
        <p>
          Les parties ne peuvent être considérées comme responsables ou ayant
          failli à leurs obligations contractuelles, lorsque le défaut
          d&apos;exécution des obligations respectives a pour origine la force
          majeure ; le contrat entre les parties est suspendu jusqu&apos;à
          l&apos;extinction des causes ayant engendrées la force majeure. La
          force majeure prend en compte des faits ou circonstances
          irrésistibles, extérieurs aux parties, imprévisibles et indépendants
          de la volonté des parties, malgré tous les efforts raisonnablement
          possibles pour les empêcher. Sont aussi considérés comme cas de force
          majeure, le blocage des moyens de transports ou
          d&apos;approvisionnements, tremblements de terre, incendies, tempêtes,
          inondations, foudre, l&apos;arrêt des réseaux de télécommunication, et
          notamment tous les réseaux accessibles par internet, ou difficultés
          propres aux réseaux de télécommunication extérieurs aux parties. La
          partie touchée par la force majeure en avisera l&apos;autre dans les
          cinq (5) jours ouvrables suivant la date à laquelle elle en aura eu
          connaissance. Les deux parties conviendront alors des conditions dans
          lesquelles l&apos;exécution du contrat sera poursuivie.
        </p>
        <h4 className='font-semibold mt-4'>
          ARTICLE 7 – ÉLÉMENTS ET PRESTATIONS EXTERNES
        </h4>
        <p>
          Les éléments divers éventuellement nécessaires à la réalisation des
          prestations du prestataire et ne relevant pas de ses offres ne sont
          pas compris dans les prix indiqués. Il s&apos;agit par exemple des
          polices typographiques, des photographies ou illustrations issues de
          banques d&apos;images. Il en va de même pour les frais
          d&apos;impression, d&apos;hébergement internet ou d&apos;achat de
          matériel dépendant du projet en lui-même. Le règlement de ceux-ci se
          fera par le client directement auprès du fournisseur et prestataire
          extérieur.
        </p>
        <h4 className='font-semibold mt-4'>
          ARTICLE 8 – DÉLAIS DE RÉALISATION
        </h4>
        <p>
          Les délais de réalisation sont définis au moment de la prise de
          commande, ou à défaut par la signature du devis. Le client est
          responsable de la fourniture de l&apos;ensemble des données et
          informations (contenus, textes, photos, charte graphique, etc.) La
          prestation sera considérée comme étant acceptée par le client si
          celui-ci n&apos;émet aucune opposition à la conformité de la
          prestation cinq jours ouvrés après la réception de la lettre, mail ou
          télécopie lui confirmant la livraison de la prestation. La signature
          par le client du présent contrat est le fait déclencheur d&apos;une
          part de l&apos;exigibilité des échéances. Les modifications demandées
          par le client dans le cadre de la prestation doivent impérativement
          faire l&apos;objet d&apos;une demande écrite adressée par mail,
          télécopie ou courrier. A défaut, elles ne seront pas prises en compte
          par le concepteur.
        </p>
        <h4 className='font-semibold mt-4'>ARTICLE 9 – TERMES DE PAIEMENT</h4>
        <p>
          Tout retard de paiement donnera lieu à des pénalités de retard de
          paiement calculées suivant les règles légales en vigueur. Le paiement
          s&apos;effectue par virement bancaire. Faute de règlement dans les
          délais figurant sur les factures, il sera appliqué au client,
          conformément à la loi, des pénalités de retard au taux de trois fois
          le taux d&apos;intérêt légal (Code de Commerce article 441-6 alinéa
          12) ainsi qu&apos;une indemnité de recouvrement d&apos;un montant
          forfaitaire de 40 euros. Aucun escompte pour paiement anticipé
          n&apos;est accordé.
        </p>
        <h4 className='font-semibold mt-4'>
          ARTICLE 10 – PROPRIÉTÉ DE LA PRODUCTION
        </h4>
        <p>
          La totalité de la production, objet de la présente commande, demeure
          la propriété entière et exclusive du prestataire tant que les factures
          émises par la société Katalyx ne sont pas payées en totalité par la
          société cliente, à concurrence du montant global de la commande et des
          avenants éventuels conclus en cours de prestation. De façon
          corollaire, la société cliente deviendra propriétaire de fait de la
          production à compter du règlement final de toutes les factures émises
          par le prestataire dans le cadre de la commande.
        </p>
        <h4 className='font-semibold mt-4'>
          ARTICLE 11 – LIVRAISON DES DOCUMENTS DE TRAVAIL
        </h4>
        <p>
          A défaut des mentions contraires, les documents de travail
          intermédiaires et les produits développés vous sont livrés en main
          propre, par voie postale ou électronique.
        </p>
        <h4 className='font-semibold mt-4'>
          ARTICLE 12 – COPYRIGHTS ET MENTIONS LÉGALES
        </h4>
        <p>
          Sauf mention contraire explicite de la société cliente, le prestataire
          se réserve la possibilité d&apos;inclure dans la réalisation une
          mention commerciale indiquant clairement sa contribution, sous la
          forme d&apos;une mention du type : « design Katalyx », lorsque cela
          concerne des prestations de création graphique, « développement :
          Katalyx », lorsque cela concerne des prestations de développement, «
          conception Katalyx », de façon plus générique lorsqu&apos;il
          s&apos;agit d&apos;une prestation globale.
        </p>
        <h4 className='font-semibold mt-4'>
          ARTICLE 13 – RESPONSABILITÉ ET PROPRIÉTÉ DES CONTENUS
        </h4>
        <p>
          La société cliente, représentée par le signataire de la présente
          commande, reconnaît et assume la pleine et entière responsabilité des
          choix réalisés en matière de contenus textuels et iconographiques,
          figurant dans la réalisation livrée par le prestataire. La société
          cliente, représentée par le signataire de la présente commande,
          reconnaît avoir pris connaissance des mises en garde effectuées par
          les représentants légaux du prestataire, concernant les lois du
          copyright et de la propriété intellectuelle, et les peines pouvant
          être encourues au titre de leur violation.
        </p>
        <h4 className='font-semibold mt-4'>ARTICLE 14 – DROITS DE PUBLICITÉ</h4>
        <p>
          Sauf mention contraire explicite du client, notifiée par courrier avec
          accusé de réception, le prestataire se réserve le droit de mentionner
          sa réalisation pour la société cliente comme référence dans le cadre
          de ses démarches de prospection commerciale, de communication externe
          et de publicité. La société cliente, représentée par le signataire de
          la commande, autorise le prestataire, à travers ses représentants
          légaux et commerciaux, à utiliser à des fins purement démonstratives
          la réalisation. Cette autorisation s&apos;étend plus particulièrement
          aux éléments constitutifs de la réalisation, comprenant sans
          restriction la présentation publique des contenus suivants, les
          contenus textuels, les contenus iconographiques.
        </p>
        <h4 className='font-semibold mt-4'>ARTICLE 15 – GARANTIE</h4>
        <p>
          Les prestations et services fournis par Katalyx sont garanties pour
          une durée de 3 (trois) mois à compter de la date de livraison
          définitive (mise en production ou livraison finale du produit ou
          prestations effectuées par Katalyx). Dans le cas présent, elle court
          jusqu&apos;au 6éme mois suivant la livraison. C&apos;est-à-dire, 3
          mois après l&apos;accompagnement du trimestre qui démarre à la
          livraison. Au-delà de ces 6 mois, Katalyx se décharge de toute
          responsabilité et ne peut être tenu responsable de tout
          dysfonctionnement relatif aux prestations fournies.
        </p>
      </div>
    </section>
  );
}
