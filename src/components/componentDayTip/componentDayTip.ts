import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import Page from '../../shared/page';

type translationKey = 'es' | 'en' | 'it' | 'fr' | 'de';

export default class ComponentDayTip extends LitElement {
  @property({ type: String }) language: translationKey = 'en';

  @state() private tips: { [key in translationKey]: string[]; } = {
    es: [
      "Tu dieta debe tener en cuenta tu contexto, debe ser realista y considerar tus condiciones..",
      "Evita la hipermonitorización, contar obsesivamente calorías te desconecta de tus señales internas y puede llevar a prácticas de riesgo.",
      "Identifica las conductas de riesgo, lavarse los dientes por hambre o sobreentrenar para compensar son prácticas peligrosas y no hábitos saludables.",
      "No demonices alimentos, pues culpar a ciertos nutrientes no te ayudará a mantener una buena relación con la comida y puede desencadenar problemas psicológicos.",
      "Prioriza la comida real, los suplementos solo complementan y depender de muchos puede indicar que probablemente te faltan nutrientes base.",
      "Come sin culpa, ejerciendo tu derecho a comer lo que desees sin ganártelo entrenando y sin aceptar juicios morales.",
      "Cuida tu relación con la comida entendiendo que la salud no se define solo por lo que comes, sino por tu relación emocional con ello.",
      "Recuerda que ganar peso también es liberador, especialmente en deportes de fuerza donde subir de peso para rendir mejor te libera de la obsesión por adelgazar.",
      "Recuerda que tu dieta no es tu identidad, y comer estrictamente para encajar en el fitness aísla a las personas y diluye los vínculos humanos.",
      "Gestiona el deseo de adelgazar aceptando que es normal desear un cuerpo más delgado, pero analiza el porqué de ese deseo (presión estéticas, canon sociales...) e intenta que ese anhelo no te impida disfrutar.",
      "Registra tu progreso reservando días fijos para entrenar y anota tus avances para visualizar todo lo que has conseguido. Pero también está bien si no lo haces y sólo disfrutas de comer y entrenar",
      "Plantea tu objetivo para no entrenar solo para perder peso, enfócate también en ganar fuerza, autonomía y mejorar tu calidad de vida.",
      "Recuerda que las altas repeticiones no definen tu progreso, ya que el desarrollo muscular depende del volumen total de entrenamiento y no de usar cargas bajas o altas repeticiones.",
      "Huye de los gurús y desconfía de quienes venden soluciones milagrosas, ya que ninguna fórmula mágica funciona para todos.",
      "Recuerda que el fitness no es tu identidad porque eres una persona con aficiones, gustos y no un avatar de Instagram que usa su cuerpo como capital social.",
      "Ten cuidado con los relojes inteligentes, porque sustituir tu percepción interna por datos externos erosiona tu autoeficacia y te desconecta corporalmente. Escuchate y date los cuidados y necesidades que tu cuerpo te pida",
      "Recupera tu soberanía corporal entrenando para sentirte libre y capaz, y nunca desde la culpa o como una simple obligación moral.",
      "Renuncia a la carta de feminidad sin pedir perdón por entrenar fuerza, usa tu cuerpo para tu propia satisfacción personal.",
      "Rechaza la hipersexualización del entorno fitness que a menudo relega a las mujeres a ser sujetos pasivos esperando validación masculina.",
      "Ten claro que no debes tu apariencia a nadie;tu físico es una decisión exclusivamente tuya.",
      "Sé consciente de que tu género condiciona tu trato, ya que tu identidad, origen y economía determinan inevitablemente cómo se te tratará en los espacios deportivos.",
      "Busca espacios seguros, es vital crear entornos donde puedas descubrir tu fuerza sin depender de las miradas del resto.",
      "Recuerda que las dietas restrictivas no funcionan porque comer menos de lo necesario activa el modo supervivencia y te lleva a buscar comida desesperadamente.",
      "Acepta que es normal sentir hambre porque tu cuerpo necesita comer más para regenerarse al entrenar, y no fracasas si no pierdes peso.",
      "Pierde el miedo a comer y retira la culpa asociada a la comida, entendiendo que comer sin pasar hambre es muy positivo.",
      "No opines sobre cuerpos ajenos ni comentes los cambios de peso de otros, ya que pueden deberse a problemas de salud y causar daño.",
      "No elogies la pérdida de peso, pues esto refuerza la falsa idea de que perder peso siempre equivale a salud y éxito estético.",
      "Ten en cuenta que el IMC es inválido, ya que esta herramienta cruza peso y altura sin distinguir grasa de músculo, catalogando erróneamente a personas fuertes.",
      "Ten cuidado con el sesgo gordófobo, porque exigir perder peso antes de tratar dolencias es reduccionista y las causas del dolor son siempre multifactoriales.",
      "Exige respeto sanitario recordando que tienes derecho a atención digna, y si condicionan tu tratamiento a perder peso, cambia de especialista.",
      "Valora los beneficios inmediatos y haz deporte para tener más energía y bienestar, no solo con el fin utilitarista de adelgazar.",
      "Defiéndete de comentarios no solicitados recordando que tienes derecho a responder como prefieras cuando alguien opina sin tu permiso sobre tu cuerpo.",
      "Adapta tu terminología sustituyendo la palabra peso por composición corporal, lo que te ayudará a cambiar tu percepción y evitar estigmas perjudiciales.",
      "Desmonta la meritocracia del peso liberándote de la culpa y rechazando que estar delgado sea un mérito, ya que el peso depende de múltiples factores.",
      "Entiende que la salud no es un deber moral y rechaza la idea de que es un peaje que debes pagar para ser respetado.",
      "Recuerda que hay otros factores de riesgo como vivir en ciudades contaminadas o el estrés crónico, por lo que no debes criminalizar tu cambio de peso en función de tu dieta o deporte.",
      "Pierde el miedo a la palabra 'gorda/o' evitando eufemismos que perpetúan el estigma y entendiendo la reapropiación política del término.",
      "No critiques el Body Positive, ya que este movimiento no hace apología de la obesidad sino que busca que las personas vivan sin ser juzgadas.",
      "Recuerda que la alimentación no es estatus y desconfía de productos caros que buscan proyectar lujo en redes sociales en lugar de promover verdadera salud.",
      "Cuestiona el autocuidado extremo reconociendo que si tus reglas alimenticias te generan miedo y culpa cuando te las saltas, es solo control.",
      "Busca profesionales con visión crítica acudiendo a nutricionistas que entiendan la conducta y el entorno social en lugar de solo enfocarse en las calorías.",
      "No pauses tu vida si ganas peso; aprende a habitar tu cuerpo en lugar de pausar tu vida por la estética.",
      "Sé consciente de que el sistema se lucra de ti, pues el capitalismo necesita tu insatisfacción corporal crónica para seguir vendiéndote dietas y operaciones estéticas.",
      "No compenses con ejercicio si subes de peso, no sobreentrenes y reflexiona por qué ahora tu identidad depende de algo puramente estético.",
      "Acepta tus versiones incómodas aprendiendo a no rechazarte en esos días en los que no cumples con tus expectativas visuales.",
      "Ten cuidado con el bienestar neoliberal porque si tu autocuidado exige ser siempre eficiente y te genera culpa, estás bajo constante vigilancia.",
      "Rechaza el 'querer es poder', este mensaje tóxico ignora tus privilegios y genera culpa al obligarte a pelear contra tu propia vida.",
      "Huye de entrenadores maniquí y desconfía de influencers que usan su físico para venderte ejercicios, culpándote después si no consigues resultados.",
      "Protege tus datos y vínculos evitando planes gratuitos que extraen datos; huye de gurús que te pidan aislarte de tus seres queridos.",
      "Existe una hipocresía en el mundo fitness, es contradictorio que exijan hacer deporte y al mismo tiempo desprecien a los cuerpos no normativos en el gimnasio.",
      "Haz comunidad al entrenar usando el gimnasio para tejer lazos y apoyo mutuo, recordando que el entrenamiento no debe aislarte de tu entorno.",
      "Consume fruta y verdura todos los días, comprala en la frutería de tu barrio",
      "Haz deporte varios días a la semana para estar fuerte. Apoya a al box / gimnasio de tu barrio",
      "Si tomas suplementación en tu dieta, revisa si lo necesitas con tu nutricionista y recuerda que compararla en el box/gimnasio de tu barrio es una manera de apoyarles"
    ],
    en: [
      "Your diet must take into account your context, it must be realistic and consider your conditions.",
      "Avoid hypermonitoring, obsessively counting calories disconnects you from your internal signals and can lead to risky practices.",
      "Identify risky behaviors, brushing your teeth out of hunger or overtraining to compensate are dangerous practices and not healthy habits.",
      "Do not demonize foods, as blaming certain nutrients will not help you maintain a good relationship with food and can trigger psychological problems.",
      "Prioritize real food, supplements only complement and relying on too many may indicate that you are probably lacking base nutrients.",
      "Eat without guilt, exercising your right to eat what you want without earning it by training and without accepting moral judgments.",
      "Take care of your relationship with food, understanding that health is not defined only by what you eat, but by your emotional relationship with it.",
      "Remember that gaining weight is also liberating, especially in strength sports where gaining weight to perform better frees you from the obsession with losing weight.",
      "Remember that your diet is not your identity, and eating strictly to fit into fitness isolates people and dilutes human bonds.",
      "Manage the desire to lose weight by accepting that it is normal to want a thinner body, but analyze the reason for that desire (aesthetic pressure, social canon...) and try not to let that desire prevent you from enjoying yourself.",
      "Record your progress by reserving fixed days to train and write down your progress to visualize everything you have achieved. But it's also okay if you don't and just enjoy eating and training.",
      "Set your goal to not train just to lose weight, also focus on gaining strength, autonomy and improving your quality of life.",
      "Remember that high repetitions do not define your progress, since muscle development depends on the total training volume and not on using low loads or high repetitions.",
      "Avoid gurus and distrust those who sell miraculous solutions, since no magic formula works for everyone.",
      "Remember that fitness is not your identity because you are a person with hobbies and tastes and not an Instagram avatar who uses his body as social capital.",
      "Be careful with smart watches, because replacing your internal perception with external data erodes your self-efficacy and disconnects you physically. Listen to yourself and give yourself the care and needs that your body asks of you.",
      "Recover your bodily sovereignty by training to feel free and capable, and never from guilt or as a simple moral obligation.",
      "Give up the femininity card without apologizing for strength training, use your body for your own personal satisfaction.",
      "Rejects the hypersexualization of the fitness environment that often relegates women to passive subjects awaiting male validation.",
      "Be clear that you do not owe your appearance to anyone; your physique is an exclusively your decision.",
      "Be aware that your gender determines your treatment, since your identity, origin and economy inevitably determine how you will be treated in sports spaces.",
      "Look for safe spaces, it is vital to create environments where you can discover your strength without depending on the gaze of others.",
      "Remember that restrictive diets don't work because eating less than necessary activates survival mode and leads you to desperately search for food.",
      "Accept that it is normal to feel hungry because your body needs to eat more to regenerate when training, and you do not fail if you do not lose weight.",
      "Lose the fear of eating and remove the guilt associated with food, understanding that eating without being hungry is very positive.",
      "Do not give opinions about other people's bodies or comment on others' weight changes, as these may be due to health problems and cause harm.",
      "Do not praise weight loss, as this reinforces the false idea that losing weight always equals health and aesthetic success.",
      "Keep in mind that BMI is invalid, since this tool crosses weight and height without distinguishing fat from muscle, wrongly classifying strong people.",
      "Be careful with the fatphobic bias, because demanding weight loss before treating ailments is reductionist and the causes of pain are always multifactorial.",
      "Demand health respect, remembering that you have the right to decent care, and if your treatment is conditioned on losing weight, change specialists.",
      "Value the immediate benefits and do sports to have more energy and well-being, not just for the utilitarian purpose of losing weight.",
      "Defend yourself from unsolicited comments by remembering that you have the right to respond however you prefer when someone gives an opinion about your body without your permission.",
      "Adapt your terminology by replacing the word weight with body composition, which will help you change your perception and avoid harmful stigmas.",
      "Dismantle the meritocracy of weight by freeing yourself from guilt and rejecting that being thin is a merit, since weight depends on multiple factors.",
      "Understand that health is not a moral duty and reject the idea that it is a toll that you must pay to be respected.",
      "Remember that there are other risk factors such as living in polluted cities or chronic stress, so you should not criminalize your weight change based on your diet or sport.",
      "Lose your fear of the word 'fat', avoiding euphemisms that perpetuate the stigma and understanding the political reappropriation of the term.",
      "Do not criticize Body Positive, since this movement does not advocate obesity but seeks for people to live without being judged.",
      "Remember that food is not status and be wary of expensive products that seek to project luxury on social networks instead of promoting true health.",
      "Question extreme self-care by recognizing that if your eating rules cause fear and guilt when you break them, it's just control.",
      "Look for professionals with a critical vision by turning to nutritionists who understand behavior and the social environment instead of just focusing on calories.",
      "Don't pause your life if you gain weight; Learn to inhabit your body instead of pausing your life for aesthetics.",
      "Be aware that the system profits from you, because capitalism needs your chronic body dissatisfaction to continue selling you diets and cosmetic operations.",
      "Do not compensate with exercise if you gain weight, do not overtrain and reflect on why your identity now depends on something purely aesthetic.",
      "Accept your uncomfortable versions by learning not to reject yourself on those days when you don't meet your visual expectations.",
      "Be careful with neoliberal wellness because if your self-care requires always being efficient and generates guilt, you are under constant surveillance.",
      "Reject the 'wanting is power', this toxic message ignores your privileges and generates guilt by forcing you to fight against your own life.",
      "Avoid mannequin trainers and be wary of influencers who use their physique to sell you exercises, blaming you later if you don't get results.",
      "Protect your data and links by avoiding free plans that siphon data; Run away from gurus who ask you to isolate yourself from your loved ones.",
      "There is hypocrisy in the fitness world, it is contradictory that they demand sports and at the same time despise non-normative bodies in the gym.",
      "Build community when training by using the gym to build bonds and mutual support, remembering that training should not isolate you from your environment.",
      "Consume fruit and vegetables every day, buy them at your neighborhood greengrocer.",
      "Play sports several days a week to be strong. Support your neighborhood box / gym.",
      "If you take supplements in your diet, check if you need them with your nutritionist and remember that buying them at your neighborhood box/gym is a way to support them."
    ],
    it: [
      "La tua dieta deve tenere conto del tuo contesto, deve essere realistica e considerare le tue condizioni.",
      "Evita l’ipermonitoraggio, contare ossessivamente le calorie ti disconnette dai tuoi segnali interni e può portare a pratiche rischiose.",
      "Individuare comportamenti rischiosi, lavarsi i denti per fame o allenarsi troppo per compensare sono pratiche pericolose e non abitudini salutari.",
      "Non demonizzare gli alimenti, perché dare la colpa ad alcuni nutrienti non ti aiuterà a mantenere un buon rapporto con il cibo e può scatenare problemi psicologici.",
      "Dai la priorità al cibo vero, agli integratori solo come complemento e fare affidamento su troppi può indicare che probabilmente ti mancano i nutrienti di base.",
      "Mangiare senza sensi di colpa, esercitando il proprio diritto a mangiare ciò che si vuole senza guadagnarselo allenandosi e senza accettare giudizi morali.",
      "Prenditi cura del tuo rapporto con il cibo, comprendendo che la salute non è definita solo da ciò che mangi, ma dal tuo rapporto emotivo con esso.",
      "Ricorda che anche l'aumento di peso è liberatorio, soprattutto negli sport di forza in cui aumentare di peso per ottenere prestazioni migliori ti libera dall'ossessione di perdere peso.",
      "Ricorda che la tua dieta non è la tua identità e che mangiare rigorosamente per adattarsi alla forma fisica isola le persone e diluisce i legami umani.",
      "Gestisci il desiderio di perdere peso accettando che sia normale desiderare un corpo più magro, ma analizza il motivo di quel desiderio (pressione estetica, canone sociale...) e cerca di non lasciare che quel desiderio ti impedisca di divertirti.",
      "Registra i tuoi progressi riservando giorni fissi per allenarti e annota i tuoi progressi per visualizzare tutto ciò che hai ottenuto. Ma va bene anche se non lo fai e ti diverti semplicemente mangiando e allenandoti.",
      "Stabilisci il tuo obiettivo di non allenarti solo per perdere peso, concentrati anche sull'acquisizione di forza, autonomia e sul miglioramento della qualità della vita.",
      "Ricorda che le ripetizioni elevate non definiscono i tuoi progressi, poiché lo sviluppo muscolare dipende dal volume totale dell'allenamento e non dall'utilizzo di carichi bassi o ripetizioni elevate.",
      "Evita i guru e diffida di chi vende soluzioni miracolose, poiché nessuna formula magica funziona per tutti.",
      "Ricorda che il fitness non è la tua identità perché sei una persona con hobby e gusti e non un avatar di Instagram che usa il suo corpo come capitale sociale.",
      "Fai attenzione agli orologi intelligenti, perché sostituire la tua percezione interna con dati esterni mina la tua autoefficacia e ti disconnette fisicamente. Ascoltati e concediti le cure e i bisogni che il tuo corpo ti chiede.",
      "Recupera la tua sovranità corporea allenandoti a sentirti libero e capace, e mai per senso di colpa o per semplice obbligo morale.",
      "Rinuncia alla carta della femminilità senza scusarti per l'allenamento della forza, usa il tuo corpo per la tua soddisfazione personale.",
      "Rifiuta l'ipersessualizzazione dell'ambiente del fitness che spesso relega le donne a soggetti passivi in ​​attesa della validazione maschile.",
      "Sii chiaro che non devi il tuo aspetto a nessuno; il tuo fisico è esclusivamente una tua decisione.",
      "Sii consapevole che il tuo genere determina il tuo trattamento, poiché la tua identità, origine ed economia determinano inevitabilmente il modo in cui sarai trattato negli spazi sportivi.",
      "Cerca spazi sicuri, è vitale creare ambienti in cui puoi scoprire la tua forza senza dipendere dallo sguardo degli altri.",
      "Ricorda che le diete restrittive non funzionano perché mangiare meno del necessario attiva la modalità di sopravvivenza e ti porta a cercare disperatamente il cibo.",
      "Accetta che è normale avere fame perché il tuo corpo ha bisogno di mangiare di più per rigenerarsi durante l'allenamento, e non fallirai se non dimagrisci.",
      "Perdere la paura di mangiare ed eliminare i sensi di colpa legati al cibo, comprendendo che mangiare senza avere fame è molto positivo.",
      "Non esprimere opinioni sul corpo di altre persone né commentare i cambiamenti di peso degli altri, poiché potrebbero essere dovuti a problemi di salute e causare danni.",
      "Non lodare la perdita di peso, poiché ciò rafforza la falsa idea che perdere peso equivale sempre a salute e successo estetico.",
      "Tieni presente che il BMI non è valido, poiché questo strumento incrocia peso e altezza senza distinguere il grasso dai muscoli, classificando erroneamente le persone forti.",
      "Attenzione al pregiudizio grassofobico, perché pretendere la perdita di peso prima di curare i disturbi è riduzionista e le cause del dolore sono sempre multifattoriali.",
      "Esigi rispetto per la salute, ricordando che hai diritto a cure dignitose e, se il tuo trattamento è condizionato alla perdita di peso, cambia specialista.",
      "Valorizzare i benefici immediati e fare sport per avere più energia e benessere, non solo per lo scopo utilitaristico di perdere peso.",
      "Difenditi dai commenti non richiesti ricordando che hai il diritto di rispondere come preferisci quando qualcuno dà un'opinione sul tuo corpo senza il tuo permesso.",
      "Adatta la tua terminologia sostituendo la parola peso con composizione corporea, cosa che ti aiuterà a cambiare la tua percezione ed evitare stigmi dannosi.",
      "Smantellare la meritocrazia del peso liberandosi dai sensi di colpa e rifiutando che essere magri sia un merito, poiché il peso dipende da molteplici fattori.",
      "Comprendere che la salute non è un dovere morale e respingere l’idea che sia un pedaggio da pagare per essere rispettati.",
      "Ricorda che ci sono altri fattori di rischio come vivere in città inquinate o stress cronico, quindi non dovresti criminalizzare il cambiamento di peso in base alla tua dieta o allo sport.",
      "Perdere la paura della parola “grasso”, evitando eufemismi che perpetuano lo stigma e comprendendo la riappropriazione politica del termine.",
      "Non criticare Body Positive, poiché questo movimento non sostiene l’obesità ma cerca che le persone vivano senza essere giudicate.",
      "Ricordatevi che il cibo non è uno status e diffidate dai prodotti costosi che cercano di proiettare il lusso sui social network invece di promuovere la vera salute.",
      "Metti in discussione l'estrema cura di te stesso riconoscendo che se le tue regole alimentari causano paura e senso di colpa quando le infrangi, è solo controllo.",
      "Cerca professionisti con una visione critica rivolgendoti a nutrizionisti che comprendano il comportamento e l'ambiente sociale invece di concentrarsi solo sulle calorie.",
      "Non mettere in pausa la tua vita se aumenti di peso; Impara ad abitare il tuo corpo invece di mettere in pausa la tua vita per l'estetica.",
      "Sii consapevole che il sistema trae profitto da te, perché il capitalismo ha bisogno della tua insoddisfazione cronica del corpo per continuare a venderti diete e operazioni cosmetiche.",
      "Non compensare con l’esercizio fisico se ingrassi, non allenarti troppo e rifletti sul perché la tua identità ormai dipende da qualcosa di puramente estetico.",
      "Accetta le tue versioni scomode imparando a non rifiutarti nei giorni in cui non soddisfi le tue aspettative visive.",
      "Fai attenzione al benessere neoliberista perché se la tua cura di te stesso richiede di essere sempre efficiente e genera senso di colpa, sei costantemente sorvegliato.",
      "Rifiuta il \"volere è potere\", questo messaggio tossico ignora i tuoi privilegi e genera senso di colpa costringendoti a combattere contro la tua stessa vita.",
      "Evita i manichini da ginnastica e diffida degli influencer che usano il loro fisico per venderti esercizi, incolpandoti poi se non ottieni risultati.",
      "Proteggi i tuoi dati e collegamenti evitando piani gratuiti che sottraggono dati; Scappa dai guru che ti chiedono di isolarti dai tuoi cari.",
      "C’è ipocrisia nel mondo del fitness, è contraddittorio che si pretenda lo sport e allo stesso tempo si disprezzino i corpi non normativi in ​​palestra.",
      "Costruisci una comunità durante l'allenamento utilizzando la palestra per costruire legami e sostegno reciproco, ricordando che l'allenamento non dovrebbe isolarti dal tuo ambiente.",
      "Consuma frutta e verdura tutti i giorni, comprala dal fruttivendolo del tuo quartiere.",
      "Fai sport diversi giorni alla settimana per essere forte. Sostieni il box / la palestra del tuo quartiere.",
      "Se assumi integratori nella tua dieta, verifica se ne hai bisogno con il tuo nutrizionista e ricorda che acquistarli nel box/palestra del tuo quartiere è un modo per sostenerli."
    ],
    fr: [
      "Votre alimentation doit tenir compte de votre contexte, elle doit être réaliste et tenir compte de vos conditions.",
      "Évitez l’hypersurveillance, compter de manière obsessionnelle les calories vous déconnecte de vos signaux internes et peut conduire à des pratiques à risque.",
      "Identifier les comportements à risque, se brosser les dents par faim ou se surentraîner pour compenser sont des pratiques dangereuses et non des habitudes saines.",
      "Ne diabolisez pas les aliments, car blâmer certains nutriments ne vous aidera pas à entretenir une bonne relation avec la nourriture et peut déclencher des problèmes psychologiques.",
      "Donnez la priorité aux vrais aliments, les suppléments ne font que compléter et en compter trop peut indiquer que vous manquez probablement de nutriments de base.",
      "Mangez sans culpabilité, en exerçant votre droit de manger ce que vous voulez sans le gagner par l’entraînement et sans accepter de jugements moraux.",
      "Prenez soin de votre relation avec la nourriture, en comprenant que la santé ne se définit pas seulement par ce que vous mangez, mais par votre relation émotionnelle avec celui-ci.",
      "N’oubliez pas que prendre du poids est aussi libérateur, notamment dans les sports de force où prendre du poids pour mieux performer vous libère de l’obsession de perdre du poids.",
      "N'oubliez pas que votre alimentation n'est pas votre identité et que manger uniquement pour vous adapter à votre forme physique isole les gens et dilue les liens humains.",
      "Gérez le désir de perdre du poids en acceptant qu'il est normal de vouloir un corps plus mince, mais analysez la raison de ce désir (pression esthétique, canon social...) et essayez de ne pas laisser ce désir vous empêcher de profiter.",
      "Enregistrez vos progrès en réservant des jours fixes pour vous entraîner et notez vos progrès pour visualiser tout ce que vous avez accompli. Mais ce n'est pas grave non plus si vous ne le faites pas et que vous aimez simplement manger et vous entraîner.",
      "Fixez-vous pour objectif de ne pas vous entraîner uniquement pour perdre du poids, mais également de vous concentrer sur le gain de force, d'autonomie et l'amélioration de votre qualité de vie.",
      "N'oubliez pas que les répétitions élevées ne définissent pas votre progression, car le développement musculaire dépend du volume total d'entraînement et non de l'utilisation de faibles charges ou de répétitions élevées.",
      "Évitez les gourous et méfiez-vous de ceux qui vendent des solutions miraculeuses, car aucune formule magique ne fonctionne pour tout le monde.",
      "N'oubliez pas que le fitness n'est pas votre identité car vous êtes une personne avec des passe-temps et des goûts et non un avatar Instagram qui utilise son corps comme capital social.",
      "Soyez prudent avec les montres intelligentes, car remplacer votre perception interne par des données externes érode votre efficacité personnelle et vous déconnecte physiquement. Écoutez-vous et accordez-vous les soins et les besoins que votre corps vous demande.",
      "Récupérez votre souveraineté corporelle en vous entraînant à vous sentir libre et capable, et jamais par culpabilité ou par simple obligation morale.",
      "Abandonnez la carte de la féminité sans vous excuser pour la musculation, utilisez votre corps pour votre satisfaction personnelle.",
      "Rejette l’hypersexualisation de l’environnement du fitness qui relègue souvent les femmes à des sujets passifs en attente de validation masculine.",
      "Soyez clair sur le fait que vous ne devez votre apparence à personne ; votre physique est exclusivement votre décision.",
      "Sachez que votre sexe détermine votre traitement, puisque votre identité, votre origine et votre économie déterminent inévitablement la manière dont vous serez traité dans les espaces sportifs.",
      "Recherchez des espaces sûrs, il est essentiel de créer des environnements où vous pourrez découvrir votre force sans dépendre du regard des autres.",
      "N'oubliez pas que les régimes restrictifs ne fonctionnent pas car manger moins que nécessaire active le mode survie et vous amène à chercher désespérément de la nourriture.",
      "Acceptez qu'il est normal d'avoir faim car votre corps a besoin de manger plus pour se régénérer lors de l'entraînement, et vous n'échouerez pas si vous ne perdez pas de poids.",
      "Perdez la peur de manger et éliminez la culpabilité associée à la nourriture, en comprenant que manger sans avoir faim est très positif.",
      "Ne donnez pas d'opinion sur le corps d'autrui et ne commentez pas les changements de poids d'autrui, car ceux-ci peuvent être dus à des problèmes de santé et causer des dommages.",
      "Ne faites pas l’éloge de la perte de poids, car cela renforce la fausse idée selon laquelle perdre du poids est toujours synonyme de réussite en matière de santé et d’esthétique.",
      "Gardez à l’esprit que l’IMC n’est pas valide, car cet outil croise le poids et la taille sans distinguer la graisse des muscles, classant ainsi à tort les personnes fortes.",
      "Attention au biais fatphobique, car exiger une perte de poids avant de traiter des maux est réductionniste et les causes des douleurs sont toujours multifactorielles.",
      "Exigez le respect de votre santé, en rappelant que vous avez droit à des soins décents, et si votre traitement est conditionné à la perte de poids, changez de spécialiste.",
      "Valorisez les bienfaits immédiats et faites du sport pour avoir plus d’énergie et de bien-être, et pas seulement dans le but utilitaire de perdre du poids.",
      "Défendez-vous des commentaires non sollicités en vous rappelant que vous avez le droit de répondre comme vous le souhaitez lorsque quelqu'un donne une opinion sur votre corps sans votre permission.",
      "Adaptez votre terminologie en remplaçant le mot poids par composition corporelle, ce qui vous aidera à changer votre perception et à éviter les stigmates néfastes.",
      "Démantelez la méritocratie du poids en vous libérant de la culpabilité et en rejetant qu’être mince soit un mérite, puisque le poids dépend de multiples facteurs.",
      "Comprenez que la santé n’est pas un devoir moral et rejetez l’idée selon laquelle c’est un tribut qu’il faut payer pour être respecté.",
      "N'oubliez pas qu'il existe d'autres facteurs de risque, comme le fait de vivre dans des villes polluées ou le stress chronique. Vous ne devez donc pas criminaliser votre changement de poids en fonction de votre alimentation ou de votre sport.",
      "Perdez votre peur du mot « gros », évitez les euphémismes qui perpétuent la stigmatisation et comprenez la réappropriation politique du terme.",
      "Ne critiquez pas Body Positive, car ce mouvement ne prône pas l’obésité mais cherche à ce que les gens vivent sans être jugés.",
      "N'oubliez pas que la nourriture n'est pas un statut et méfiez-vous des produits coûteux qui cherchent à projeter le luxe sur les réseaux sociaux au lieu de promouvoir une véritable santé.",
      "Remettez en question les soins personnels extrêmes en reconnaissant que si vos règles alimentaires provoquent de la peur et de la culpabilité lorsque vous les enfreignez, il ne s'agit que de contrôle.",
      "Recherchez des professionnels dotés d’une vision critique en vous tournant vers des nutritionnistes qui comprennent les comportements et l’environnement social au lieu de vous concentrer uniquement sur les calories.",
      "Ne mettez pas votre vie en pause si vous prenez du poids ; Apprenez à habiter votre corps au lieu de mettre votre vie en pause pour des raisons esthétiques.",
      "Sachez que le système profite de vous, car le capitalisme a besoin de votre insatisfaction corporelle chronique pour continuer à vous vendre des régimes et des opérations cosmétiques.",
      "Ne compensez pas par l'exercice si vous prenez du poids, ne vous entraînez pas trop et réfléchissez à la raison pour laquelle votre identité dépend désormais de quelque chose de purement esthétique.",
      "Acceptez vos versions inconfortables en apprenant à ne pas vous rejeter les jours où vous ne répondez pas à vos attentes visuelles.",
      "Soyez prudent avec le bien-être néolibéral car si vos soins personnels nécessitent d'être toujours efficaces et génèrent de la culpabilité, vous êtes sous surveillance constante.",
      "Rejetez le « vouloir, c'est le pouvoir », ce message toxique ignore vos privilèges et génère de la culpabilité en vous obligeant à lutter contre votre propre vie.",
      "Évitez les mannequins d'entraînement et méfiez-vous des influenceurs qui utilisent leur physique pour vous vendre des exercices, vous reprochant plus tard si vous n'obtenez pas de résultats.",
      "Protégez vos données et vos liens en évitant les forfaits gratuits qui siphonnent les données ; Fuyez les gourous qui vous demandent de vous isoler de vos proches.",
      "Il y a de l'hypocrisie dans le monde du fitness, il est contradictoire qu'ils exigent du sport et en même temps méprisent les corps non normatifs dans la salle de sport.",
      "Construisez une communauté lorsque vous vous entraînez en utilisant la salle de sport pour créer des liens et un soutien mutuel, en vous rappelant que l’entraînement ne doit pas vous isoler de votre environnement.",
      "Consommez des fruits et légumes tous les jours, achetez-les chez le primeur de votre quartier.",
      "Faites du sport plusieurs jours par semaine pour être fort. Soutenez la box / salle de sport de votre quartier.",
      "Si vous prenez des compléments alimentaires dans votre alimentation, vérifiez si vous en avez besoin avec votre nutritionniste et n'oubliez pas que les acheter dans la box/salle de sport de votre quartier est une façon de les soutenir."
    ],
    de: [
      "Ihre Ernährung muss Ihren Kontext berücksichtigen, sie muss realistisch sein und Ihre Bedingungen berücksichtigen.",
      "Vermeiden Sie Hypermonitoring, da das zwanghafte Kalorienzählen Sie von Ihren inneren Signalen abkoppelt und zu riskanten Praktiken führen kann.",
      "Das Erkennen riskanter Verhaltensweisen, Zähneputzen aus Hunger oder Übertraining zum Ausgleich sind gefährliche Praktiken und keine gesunden Gewohnheiten.",
      "Verteufeln Sie Lebensmittel nicht, da die Schuldzuweisung an bestimmte Nährstoffe nicht dazu beiträgt, ein gutes Verhältnis zu Lebensmitteln aufrechtzuerhalten, und psychische Probleme auslösen kann.",
      "Bevorzugen Sie echte Lebensmittel, Nahrungsergänzungsmittel ergänzen nur und wenn Sie sich auf zu viele verlassen, kann dies darauf hindeuten, dass Ihnen wahrscheinlich Grundnährstoffe fehlen.",
      "Essen Sie ohne Schuldgefühle, üben Sie Ihr Recht aus, zu essen, was Sie wollen, ohne es sich durch Training zu verdienen und ohne moralische Urteile zu akzeptieren.",
      "Achten Sie auf Ihre Beziehung zum Essen und verstehen Sie, dass Gesundheit nicht nur durch das, was Sie essen, definiert wird, sondern auch durch Ihre emotionale Beziehung dazu.",
      "Denken Sie daran, dass eine Gewichtszunahme auch eine befreiende Wirkung hat, insbesondere bei Kraftsportarten, bei denen eine Gewichtszunahme, um bessere Leistungen zu erbringen, Sie von der Obsession, Gewicht zu verlieren, befreit.",
      "Denken Sie daran, dass Ihre Ernährung nicht Ihre Identität ist und dass eine ausschließlich auf Fitness ausgerichtete Ernährung Menschen isoliert und menschliche Bindungen schwächt.",
      "Bewältigen Sie den Wunsch, Gewicht zu verlieren, indem Sie akzeptieren, dass es normal ist, sich einen dünneren Körper zu wünschen. Analysieren Sie jedoch den Grund für diesen Wunsch (ästhetischer Druck, sozialer Kanon ...) und versuchen Sie, sich von diesem Wunsch nicht davon abhalten zu lassen, Spaß zu haben.",
      "Zeichnen Sie Ihre Fortschritte auf, indem Sie feste Trainingstage reservieren und Ihre Fortschritte aufschreiben, um alles, was Sie erreicht haben, zu visualisieren. Es ist aber auch in Ordnung, wenn man das nicht tut und einfach Spaß am Essen und Trainieren hat.",
      "Setzen Sie sich das Ziel, nicht nur zum Abnehmen zu trainieren, sondern konzentrieren Sie sich auch darauf, Kraft und Autonomie zu gewinnen und Ihre Lebensqualität zu verbessern.",
      "Denken Sie daran, dass hohe Wiederholungszahlen nicht Ihren Fortschritt bestimmen, da der Muskelaufbau vom gesamten Trainingsvolumen abhängt und nicht von der Verwendung geringer Belastungen oder hoher Wiederholungszahlen.",
      "Vermeiden Sie Gurus und misstrauen Sie denen, die Wunderlösungen verkaufen, denn keine Zauberformel funktioniert für jeden.",
      "Denken Sie daran, dass Fitness nicht Ihre Identität ist, denn Sie sind ein Mensch mit Hobbys und Vorlieben und kein Instagram-Avatar, der seinen Körper als soziales Kapital nutzt.",
      "Seien Sie vorsichtig mit Smartwatches, denn das Ersetzen Ihrer internen Wahrnehmung durch externe Daten untergräbt Ihre Selbstwirksamkeit und trennt Sie körperlich. Hören Sie auf sich selbst und geben Sie sich die Pflege und die Bedürfnisse, die Ihr Körper von Ihnen verlangt.",
      "Gewinnen Sie Ihre körperliche Souveränität zurück, indem Sie trainieren, sich frei und fähig zu fühlen, und niemals aus Schuldgefühlen oder einer einfachen moralischen Verpflichtung.",
      "Geben Sie die Weiblichkeitskarte auf, ohne sich für das Krafttraining zu entschuldigen, und nutzen Sie Ihren Körper für Ihre persönliche Zufriedenheit.",
      "Lehnt die Hypersexualisierung des Fitnessumfelds ab, die Frauen oft zu passiven Subjekten degradiert, die auf männliche Bestätigung warten.",
      "Seien Sie sich darüber im Klaren, dass Sie Ihr Aussehen niemandem zu verdanken haben. Über Ihren Körperbau entscheiden Sie ausschließlich.",
      "Seien Sie sich bewusst, dass Ihr Geschlecht Ihre Behandlung bestimmt, da Ihre Identität, Herkunft und Wirtschaft unweigerlich darüber entscheiden, wie Sie in Sporträumen behandelt werden.",
      "Suchen Sie nach sicheren Räumen. Es ist wichtig, Umgebungen zu schaffen, in denen Sie Ihre Stärke entdecken können, ohne auf die Blicke anderer angewiesen zu sein.",
      "Denken Sie daran, dass restriktive Diäten nicht funktionieren, weil weniger Essen als nötig den Überlebensmodus aktiviert und Sie dazu verleitet, verzweifelt nach Nahrung zu suchen.",
      "Akzeptieren Sie, dass es normal ist, Hunger zu verspüren, weil Ihr Körper beim Training mehr essen muss, um sich zu regenerieren, und Sie scheitern nicht, wenn Sie nicht abnehmen.",
      "Verlieren Sie die Angst vor dem Essen und beseitigen Sie die mit dem Essen verbundenen Schuldgefühle, indem Sie verstehen, dass Essen ohne Hunger sehr positiv ist.",
      "Geben Sie keine Meinung über den Körper anderer Menschen ab und kommentieren Sie nicht die Gewichtsveränderungen anderer, da diese auf gesundheitliche Probleme zurückzuführen sein und schädlich sein können.",
      "Loben Sie das Abnehmen nicht, da dies die falsche Vorstellung bestärkt, dass Abnehmen immer gleichbedeutend mit Gesundheit und ästhetischem Erfolg ist.",
      "Bedenken Sie, dass der BMI ungültig ist, da dieses Tool Gewicht und Größe kreuzt, ohne zwischen Fett und Muskeln zu unterscheiden, wodurch starke Menschen falsch klassifiziert werden.",
      "Seien Sie vorsichtig mit der fettphobischen Voreingenommenheit, denn die Forderung nach Gewichtsabnahme vor der Behandlung von Beschwerden ist reduktionistisch und die Ursachen von Schmerzen sind immer multifaktoriell.",
      "Fordern Sie Respekt vor Ihrer Gesundheit, denken Sie daran, dass Sie das Recht auf eine angemessene Pflege haben, und wechseln Sie den Spezialisten, wenn Ihre Behandlung von einer Gewichtsabnahme abhängig ist.",
      "Schätzen Sie die unmittelbaren Vorteile und treiben Sie Sport, um mehr Energie und Wohlbefinden zu haben, und nicht nur aus dem praktischen Grund, Gewicht zu verlieren.",
      "Schützen Sie sich vor unaufgeforderten Kommentaren, indem Sie daran denken, dass Sie das Recht haben, so zu reagieren, wie Sie möchten, wenn jemand ohne Ihre Erlaubnis eine Meinung über Ihren Körper äußert.",
      "Passen Sie Ihre Terminologie an, indem Sie das Wortgewicht durch Körperzusammensetzung ersetzen. Dies wird Ihnen helfen, Ihre Wahrnehmung zu ändern und schädliche Stigmatisierungen zu vermeiden.",
      "Bauen Sie die Leistungsgesellschaft des Gewichts ab, indem Sie sich von Schuldgefühlen befreien und ablehnen, dass es ein Verdienst ist, dünn zu sein, da das Gewicht von mehreren Faktoren abhängt.",
      "Verstehen Sie, dass Gesundheit keine moralische Pflicht ist und lehnen Sie die Vorstellung ab, dass es sich um einen Tribut handelt, den Sie zahlen müssen, um respektiert zu werden.",
      "Denken Sie daran, dass es weitere Risikofaktoren wie das Leben in verschmutzten Städten oder chronischen Stress gibt. Daher sollten Sie Ihre Gewichtsveränderung aufgrund Ihrer Ernährung oder Ihres Sports nicht kriminalisieren.",
      "Verlieren Sie Ihre Angst vor dem Wort „Fett“, vermeiden Sie Euphemismen, die das Stigma aufrechterhalten, und verstehen Sie die politische Wiederaneignung des Begriffs.",
      "Kritisieren Sie Body Positive nicht, da diese Bewegung nicht Fettleibigkeit befürwortet, sondern darauf abzielt, dass Menschen leben können, ohne beurteilt zu werden.",
      "Denken Sie daran, dass Lebensmittel keinen Status haben, und seien Sie vorsichtig bei teuren Produkten, die in den sozialen Netzwerken Luxus vermitteln wollen, anstatt echte Gesundheit zu fördern.",
      "Stellen Sie extreme Selbstfürsorge in Frage, indem Sie erkennen, dass es nur um Kontrolle geht, wenn Ihre Essregeln Angst und Schuldgefühle hervorrufen, wenn Sie sie brechen.",
      "Suchen Sie nach Fachleuten mit einer kritischen Vision, indem Sie sich an Ernährungsberater wenden, die das Verhalten und das soziale Umfeld verstehen, anstatt sich nur auf Kalorien zu konzentrieren.",
      "Unterbrechen Sie Ihr Leben nicht, wenn Sie an Gewicht zunehmen. Lernen Sie, Ihren Körper zu bewohnen, anstatt Ihr Leben aus ästhetischen Gründen innezuhalten.",
      "Seien Sie sich bewusst, dass das System von Ihnen profitiert, denn der Kapitalismus braucht Ihre chronische Körperunzufriedenheit, um Ihnen weiterhin Diäten und Schönheitsoperationen zu verkaufen.",
      "Kompensieren Sie eine Gewichtszunahme nicht durch Sport, übertrainieren Sie nicht und denken Sie darüber nach, warum Ihre Identität jetzt von etwas rein Ästhetischem abhängt.",
      "Akzeptieren Sie Ihre unangenehmen Versionen, indem Sie lernen, sich an den Tagen, an denen Sie Ihre visuellen Erwartungen nicht erfüllen, nicht abzulehnen.",
      "Seien Sie vorsichtig mit neoliberaler Wellness, denn wenn Ihre Selbstfürsorge stets Effizienz erfordert und Schuldgefühle erzeugt, stehen Sie unter ständiger Überwachung.",
      "Lehnen Sie das „Wollen ist Macht“ ab. Diese giftige Botschaft ignoriert Ihre Privilegien und erzeugt Schuldgefühle, indem sie Sie zwingt, gegen Ihr eigenes Leben zu kämpfen.",
      "Vermeiden Sie Schaufensterpuppen-Trainer und seien Sie vorsichtig vor Influencern, die ihren Körper nutzen, um Ihnen Übungen zu verkaufen, und Ihnen später die Schuld geben, wenn Sie keine Ergebnisse erzielen.",
      "Schützen Sie Ihre Daten und Links, indem Sie kostenlose Pläne vermeiden, die Daten abschöpfen; Laufen Sie vor Gurus weg, die Sie auffordern, sich von Ihren Lieben zu isolieren.",
      "In der Fitnesswelt herrscht Heuchelei, es ist widersprüchlich, dass sie Sport fordern und gleichzeitig nicht normative Körper im Fitnessstudio verachten.",
      "Bauen Sie beim Training eine Gemeinschaft auf, indem Sie das Fitnessstudio nutzen, um Bindungen und gegenseitige Unterstützung aufzubauen. Denken Sie daran, dass das Training Sie nicht von Ihrer Umgebung isolieren sollte.",
      "Verzehren Sie jeden Tag Obst und Gemüse, kaufen Sie es beim Gemüsehändler in Ihrer Nähe.",
      "Treiben Sie mehrmals pro Woche Sport, um stark zu sein. Unterstützen Sie die Box / das Fitnessstudio in Ihrer Nähe.",
      "Wenn Sie Nahrungsergänzungsmittel in Ihre Ernährung aufnehmen, klären Sie mit Ihrem Ernährungsberater, ob Sie diese benötigen, und denken Sie daran, dass der Kauf in der Box/im Fitnessstudio in Ihrer Nachbarschaft eine Möglichkeit ist, diese zu unterstützen."
    ]
  };

  @state() private selectedTip = '';

  static styles = [
    Page.styles,
    css`
      :host {
        display: block;
        margin: 16px 0;
      }
      .tip-card {
        background: var(--card-background);
        border: 2px dashed var(--card-border);
        border-radius: 8px;
        padding: 16px;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 8px;
        box-sizing: border-box;
      }
      .tip-title {
        font-weight: bold;
        color: var(--palette-purple);
        font-size: 0.9rem;
        text-transform: uppercase;
      }
      :host-context([data-theme="light"]) .tip-title {
        color: var(--palette-green);
      }
      .tip-text {
        font-size: 1rem;
        color: var(--card-text);
        line-height: 1.4;
      }
    `
  ];

  connectedCallback() {
    super.connectedCallback();
    this.selectRandomTip();
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('language')) {
      this.selectRandomTip();
    }
  }

  private selectRandomTip() {
    const languageTips = this.tips[this.language] || this.tips.en;
    const randomIndex = Math.floor(Math.random() * languageTips.length);
    this.selectedTip = languageTips[randomIndex];
  }

  render() {
    const tipTitle = {
      es: 'Consejo del día',
      en: 'Tip of the day',
      it: 'Consiglio del giorno',
      fr: 'Conseil du jour',
      de: 'Tipp des Tages'
    }[this.language] || 'Tip of the day';

    return html`
      <div class="tip-card">
        <div class="tip-title">${tipTitle}</div>
        <div class="tip-text">${this.selectedTip}</div>
      </div>
    `;
  }
}
