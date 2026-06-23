import { Link } from "@/i18n/navigation";

const L10N: Record<string, {
  mentions: { title: string; lastCrumb: string; date: string; summary: string; sections: { id: string; title: string; content: string }[] };
  privacy: { title: string; lastCrumb: string; date: string; summary: string; sections: { id: string; title: string; content: string }[] };
}> = {
  fr: {
    mentions: { title: "Mentions legales", lastCrumb: "Mentions legales", date: "Derniere mise a jour : janvier 2025", summary: "Sommaire",
      sections: [
        { id: "s0", title: "Editeur du site", content: "<p>Le present site est edite par TANGER CODE, activite de developpement web et mobile en freelance, dont le siege est situe a Tanger, Maroc. Contact : contact@tangercode.ma.</p>" },
        { id: "s1", title: "Hebergement", content: "<p>Le site est heberge par un prestataire d infrastructure cloud assurant la disponibilite et la securite des donnees. Les serveurs garantissent un haut niveau de performance et de protection.</p>" },
        { id: "s2", title: "Propriete intellectuelle", content: "<p>L ensemble des contenus presents sur ce site (textes, visuels, code, logo) est la propriete exclusive de TANGER CODE, sauf mention contraire. Toute reproduction sans autorisation est interdite.</p>" },
        { id: "s3", title: "Donnees personnelles", content: "<p>Les informations collectees via les formulaires sont utilisees uniquement pour repondre a vos demandes. Elles ne sont jamais revendues a des tiers. Conformement a la reglementation, vous disposez d un droit d acces, de rectification et de suppression de vos donnees.</p><ul><li>Finalite : traitement de vos demandes de contact et de devis.</li><li>Conservation : 3 ans maximum apres le dernier contact.</li><li>Vos droits : acces, rectification, suppression, opposition.</li></ul>" },
        { id: "s4", title: "Cookies", content: "<p>Ce site utilise des cookies de mesure d audience afin d ameliorer votre experience. Vous pouvez les accepter ou les refuser a tout moment via le bandeau prevu a cet effet.</p>" },
        { id: "s5", title: "Responsabilite", content: "<p>TANGER CODE s efforce d assurer l exactitude des informations diffusees, sans garantie d exhaustivite. La responsabilite de l editeur ne saurait etre engagee en cas d erreur ou d indisponibilite temporaire.</p>" },
        { id: "s6", title: "Droit applicable", content: "<p>Les presentes mentions sont regies par le droit marocain. Tout litige releve de la competence des tribunaux de Tanger.</p>" },
      ] },
    privacy: { title: "Politique de confidentialite", lastCrumb: "Confidentialite", date: "Derniere mise a jour : janvier 2025", summary: "Sommaire",
      sections: [
        { id: "s0", title: "Collecte des donnees", content: "<p>Nous collectons les donnees que vous nous fournissez volontairement via nos formulaires de contact (nom, email, telephone, message).</p>" },
        { id: "s1", title: "Utilisation des donnees", content: "<p>Vos donnees sont utilisees exclusivement pour repondre a vos demandes, etablir des devis et assurer le suivi de votre projet.</p>" },
        { id: "s2", title: "Partage des donnees", content: "<p>Vos donnees ne sont jamais vendues, louees ou partagees avec des tiers a des fins commerciales.</p>" },
        { id: "s3", title: "Securite", content: "<p>Nous mettons en œuvre des mesures techniques et organisationnelles pour proteger vos donnees contre tout acces non autorise ou divulgation.</p>" },
        { id: "s4", title: "Cookies", content: "<p>Ce site utilise des cookies de mesure d audience. Vous pouvez gerer vos preferences via le bandeau de cookies.</p>" },
        { id: "s5", title: "Vos droits", content: "<p>Conformement a la reglementation, vous disposez d un droit d acces, de rectification, d effacement et de portabilite de vos donnees. Pour exercer ces droits, contactez-nous a contact@tangercode.ma.</p>" },
        { id: "s6", title: "Modifications", content: "<p>Cette politique peut etre mise a jour. Nous vous invitons a la consulter regulierement.</p>" },
      ] },
  },
  en: {
    mentions: { title: "Legal notice", lastCrumb: "Legal notice", date: "Last updated: January 2025", summary: "Summary",
      sections: [
        { id: "s0", title: "Site publisher", content: "<p>This site is published by TANGER CODE, a freelance web and mobile development activity based in Tangier, Morocco. Contact: contact@tangercode.ma.</p>" },
        { id: "s1", title: "Hosting", content: "<p>The site is hosted by a cloud infrastructure provider ensuring data availability and security.</p>" },
        { id: "s2", title: "Intellectual property", content: "<p>All content on this site (text, visuals, code, logo) is the exclusive property of TANGER CODE unless stated otherwise. Reproduction without authorization is prohibited.</p>" },
        { id: "s3", title: "Personal data", content: "<p>Information collected via forms is used solely to respond to your requests. It is never sold to third parties.</p><ul><li>Purpose: processing your contact and quote requests.</li><li>Retention: 3 years maximum after last contact.</li><li>Your rights: access, rectification, deletion, opposition.</li></ul>" },
        { id: "s4", title: "Cookies", content: "<p>This site uses audience measurement cookies to improve your experience. You can accept or refuse them at any time.</p>" },
        { id: "s5", title: "Liability", content: "<p>TANGER CODE strives to ensure the accuracy of published information without guaranteeing completeness. The publisher's liability cannot be engaged in case of error or temporary unavailability.</p>" },
        { id: "s6", title: "Applicable law", content: "<p>These terms are governed by Moroccan law. Any dispute falls under the jurisdiction of the courts of Tangier.</p>" },
      ] },
    privacy: { title: "Privacy policy", lastCrumb: "Privacy", date: "Last updated: January 2025", summary: "Summary",
      sections: [
        { id: "s0", title: "Data collection", content: "<p>We collect data you voluntarily provide via our contact forms (name, email, phone, message).</p>" },
        { id: "s1", title: "Data usage", content: "<p>Your data is used exclusively to respond to your requests, provide quotes and follow up on your project.</p>" },
        { id: "s2", title: "Data sharing", content: "<p>Your data is never sold, rented or shared with third parties for commercial purposes.</p>" },
        { id: "s3", title: "Security", content: "<p>We implement technical and organizational measures to protect your data against unauthorized access or disclosure.</p>" },
        { id: "s4", title: "Cookies", content: "<p>This site uses audience measurement cookies. You can manage your preferences via the cookie banner.</p>" },
        { id: "s5", title: "Your rights", content: "<p>In accordance with regulations, you have the right to access, rectify, erase and port your data. To exercise these rights, contact us at contact@tangercode.ma.</p>" },
        { id: "s6", title: "Changes", content: "<p>This policy may be updated. We invite you to consult it regularly.</p>" },
      ] },
  },
  ar: {
    mentions: { title: "إشعار قانوني", lastCrumb: "إشعار قانوني", date: "آخر تحديث: يناير 2025", summary: "ملخص",
      sections: [
        { id: "s0", title: "ناشر الموقع", content: "<p>ينشر هذا الموقع من طرف TANGER CODE، نشاط مستقل لتطوير الويب والجوال مقره طنجة، المغرب. البريد: contact@tangercode.ma.</p>" },
        { id: "s1", title: "الاستضافة", content: "<p>الموقع مستضاف لدى مزود بنية تحتية سحابية يضمن توفر وأمان البيانات.</p>" },
        { id: "s2", title: "الملكية الفكرية", content: "<p>جميع محتويات الموقع (نصوص، صور، كود، وشعار) هي ملكية حصرية لـ TANGER CODE ما لم يذكر خلاف ذلك. يمنع النسخ دون إذن.</p>" },
        { id: "s3", title: "البيانات الشخصية", content: "<p>المعلومات التي يتم جمعها عبر النماذج تستخدم فقط للرد على طلباتكم ولا تباع لأطراف ثالثة.</p><ul><li>الغرض: معالجة طلبات الاتصال والتسعير.</li><li>مدة الاحتفاظ: 3 سنوات كحد أقصى بعد آخر اتصال.</li><li>حقوقكم: الوصول، التصحيح، الحذف، الاعتراض.</li></ul>" },
        { id: "s4", title: "ملفات تعريف الارتباط", content: "<p>يستخدم هذا الموقع ملفات تعريف ارتباط لقياس الجمهور. يمكنكم قبولها أو رفضها في أي وقت.</p>" },
        { id: "s5", title: "المسؤولية", content: "<p>تبذل TANGER CODE قصارى جهدها لضمان دقة المعلومات المنشورة دون ضمان الشمولية. لا يمكن تحميل الناشر المسؤولية في حالة الخطأ أو عدم التوفر المؤقت.</p>" },
        { id: "s6", title: "القانون المطبق", content: "<p>تخضع هذه الإشعارات للقانون المغربي. أي نزاع يندرج ضمن اختصاص محاكم طنجة.</p>" },
      ] },
    privacy: { title: "سياسة الخصوصية", lastCrumb: "خصوصية", date: "آخر تحديث: يناير 2025", summary: "ملخص",
      sections: [
        { id: "s0", title: "جمع البيانات", content: "<p>نجمع البيانات التي تقدمها طوعاً عبر نماذج الاتصال (الاسم، البريد الإلكتروني، الهاتف، الرسالة).</p>" },
        { id: "s1", title: "استخدام البيانات", content: "<p>تستخدم بياناتكم حصراً للرد على طلباتكم وإعداد التسعيرات ومتابعة مشروعكم.</p>" },
        { id: "s2", title: "مشاركة البيانات", content: "<p>لا تباع بياناتكم أو تؤجر أو تشارك مع أطراف ثالثة لأغراض تجارية.</p>" },
        { id: "s3", title: "الأمان", content: "<p>نطبق إجراءات تقنية وتنظيمية لحماية بياناتكم من الوصول غير المصرح به أو الكشف.</p>" },
        { id: "s4", title: "ملفات تعريف الارتباط", content: "<p>يستخدم هذا الموقع ملفات تعريف ارتباط لقياس الجمهور. يمكنكم إدارة تفضيلاتكم عبر شريط ملفات تعريف الارتباط.</p>" },
        { id: "s5", title: "حقوقكم", content: "<p>وفقاً للتنظيمات، لكم الحق في الوصول والتصحيح والمحو ونقل البيانات. للتمتع بهذه الحقوق، اتصلوا بنا على contact@tangercode.ma.</p>" },
        { id: "s6", title: "التعديلات", content: "<p>يمكن تحديث هذه السياسة. ندعوكم للاطلاع عليها بانتظام.</p>" },
      ] },
  },
};

export function LegalContent({ locale, type }: { locale: string; type: "mentions" | "privacy" }) {
  const l10n = L10N[locale] || L10N.fr;
  const d = l10n[type];
  return (
    <>
      <section className="page-hero left" style={{ paddingBottom: 0 }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <nav className="breadcrumb left"><Link href="/">Accueil</Link><span>/</span>{d.lastCrumb}</nav>
          <h1 className="h1">{d.title}</h1>
          <p>{d.date}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="card" style={{ marginBottom: 40 }}>
            <h3 style={{ marginBottom: 14, fontSize: "1rem" }}>{d.summary}</h3>
            <ol style={{ marginLeft: "1.2em", color: "var(--text-secondary)", display: "grid", gap: 6 }}>
              {d.sections.map(s => <li key={s.id}><a href={`#${s.id}`} className="link-arrow" style={{ display: "inline" }}>{s.title}</a></li>)}
            </ol>
          </div>
          <div className="prose">
            {d.sections.map(s => (
              <div key={s.id}>
                <h2 id={s.id}>{s.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: s.content }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
