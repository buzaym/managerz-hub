import type {
  CommunityState,
  Hotseat,
  Idea,
  Inquiry,
  Listing,
  Meeting,
  Member,
  Problem,
  Reply,
  Solution,
  HotseatQuestion,
  Webinar,
} from "@/lib/types"

export const currentUserId = "m-camila"

export const members: Member[] = [
  {
    id: "m-camila",
    name: "Camila Ribeiro",
    role: "Head of People",
    company: "Leme Pay",
    city: "São Paulo",
    bio: "Lidera people e cultura em uma fintech de 280 pessoas. Está no Managerz para conversar com quem também segura o meio do campo: gestores, não só C-level.",
    specialties: ["People", "Cultura", "Feedback"],
    accent: "oklch(0.62 0.13 42)",
  },
  {
    id: "m-rafael",
    name: "Rafael Mendes",
    role: "Engineering Manager",
    company: "Atlas Banco",
    city: "Rio de Janeiro",
    bio: "EM de plataforma. Recém saiu de um ciclo de reestruturação e quer falar de gente, não só de delivery.",
    specialties: ["Engenharia", "Reestruturação", "Staff+"],
    accent: "oklch(0.48 0.08 230)",
  },
  {
    id: "m-ana",
    name: "Ana Paula Costa",
    role: "Diretora Comercial",
    company: "Vértice Varejo",
    city: "Curitiba",
    bio: "Primeiro ano como diretora. Precisa de pares para testar decisões de quota, território e liderança de gerentes.",
    specialties: ["Vendas", "Liderança de gerentes", "Metas"],
    accent: "oklch(0.52 0.11 20)",
  },
  {
    id: "m-bruno",
    name: "Bruno Oliveira",
    role: "Head of Operations",
    company: "Rota Sul Logística",
    city: "Campinas",
    bio: "Opera turnos, SLAs e um time que nunca está no mesmo lugar. Troca serviço de facilitação de offsite.",
    specialties: ["Operações", "Turnos", "Offsite"],
    accent: "oklch(0.46 0.07 160)",
  },
  {
    id: "m-juliana",
    name: "Juliana Ferreira",
    role: "People Manager",
    company: "Clara Saúde",
    city: "Belo Horizonte",
    bio: "Cuida de managers de produto e clínico. Especialista em 1:1s e em conversas que a empresa evita.",
    specialties: ["1:1", "Saúde", "Coaching"],
    accent: "oklch(0.58 0.12 350)",
  },
  {
    id: "m-diego",
    name: "Diego Santos",
    role: "Gerente de Produto",
    company: "Feira Livre",
    city: "Recife",
    bio: "PM manager de marketplace. Mentora gestores de engenharia que estão virando líderes de produto.",
    specialties: ["Produto", "Marketplace", "Mentoria"],
    accent: "oklch(0.55 0.1 75)",
  },
  {
    id: "m-marina",
    name: "Marina Alves",
    role: "Sócia-consultora",
    company: "Alves & Circuito",
    city: "Porto Alegre",
    bio: "Ajuda gestores na transição de IC para gestão. Cobra em reais, mas também troca hora por hora.",
    specialties: ["Transição para gestão", "Coaching", "Conselho"],
    accent: "oklch(0.42 0.06 250)",
  },
  {
    id: "m-thiago",
    name: "Thiago Lima",
    role: "Gerente de Operações de Loja",
    company: "Casa Norte",
    city: "Brasília",
    bio: "Lidera 11 lojas. Quer pares que entendam chão de loja, não só HQ.",
    specialties: ["Varejo", "Loja", "Turnover"],
    accent: "oklch(0.5 0.09 140)",
  },
]

export function getMember(id: string) {
  return members.find((member) => member.id === id) ?? members[0]
}

const ideas: Idea[] = [
  {
    id: "idea-caderno",
    authorId: "m-juliana",
    title: "Caderno compartilhado de 1:1: o que realmente vale anotar",
    body: "Estou cansada de atas que ninguém relê. No meu time, o caderno de 1:1 tem só três campos: o que a pessoa está carregando, o que eu estou evitando falar, e um combinado de 14 dias. Queria saber o que vocês registram — e o que deliberadamente deixam de fora.",
    tags: ["1:1", "Ritual"],
    votes: 18,
    createdAt: "2026-09-16T09:20:00-03:00",
  },
  {
    id: "idea-decisao",
    authorId: "m-rafael",
    title: "Decisão escrita em 15 linhas, antes da reunião",
    body: "Depois do último ciclo de cortes, virei refém de reuniões para 'alinhar'. Agora peço um parágrafo: contexto, opções, recomendação, o que é irreversível. Se não cabe em 15 linhas, a reunião não existe. Alguém usa algo parecido em times não-técnicos?",
    tags: ["Reuniões", "Decisão"],
    votes: 24,
    createdAt: "2026-09-14T18:05:00-03:00",
  },
  {
    id: "idea-trilha",
    authorId: "m-diego",
    title: "Trilha de IC sênior que não empurra ninguém para gestão",
    body: "Toda promoção no meu time ainda cheira a 'você só cresce se virar gente'. Quero uma trilha de staff que o comercial e o RH respeitem de verdade — escopo, compensação, rito de promoção. Quem já fez isso sobreviver ao ciclo de meritocracia?",
    tags: ["Carreira", "Staff"],
    votes: 31,
    createdAt: "2026-09-12T11:40:00-03:00",
  },
]

const replies: Reply[] = [
  {
    id: "reply-1",
    ideaId: "idea-caderno",
    authorId: "m-camila",
    body: "Eu anoto também o humor da sala. Não o clima corporativo — o cansaço real. Mudou a qualidade do 1:1 seguinte.",
    createdAt: "2026-09-16T14:10:00-03:00",
  },
  {
    id: "reply-2",
    ideaId: "idea-caderno",
    authorId: "m-ana",
    body: "No comercial isso vira teatro se o caderno sobe para o diretor. Deixo o combinado no papel e o resto na conversa.",
    createdAt: "2026-09-17T08:44:00-03:00",
  },
  {
    id: "reply-3",
    ideaId: "idea-decisao",
    authorId: "m-bruno",
    body: "Funciona em operação se o parágrafo inclui o impacto em turno. Sem isso, a 'recomendação' é só opinião de escritório.",
    createdAt: "2026-09-15T07:18:00-03:00",
  },
]

const hotseats: Hotseat[] = [
  {
    id: "hs-live",
    hostId: "m-juliana",
    title: "O 1:1 que eu evitei por três semanas",
    summary:
      "Juliana está no hotseat com um caso aberto: um gerente clínico que performa e envenena o time. Sem spoiler, sem TED. Vocês perguntam, ela responde com o que realmente aconteceu.",
    startsAt: "2026-09-19T12:00:00-03:00",
    durationMin: 55,
    seats: 18,
    status: "live",
    topics: ["Conflito", "1:1", "Saúde"],
  },
  {
    id: "hs-rafael",
    hostId: "m-rafael",
    title: "Como reestruturei o time depois de um corte",
    summary:
      "O que ele falou no all-hands, o que não falou, e como reconstruiu o mapa de ownership sem fingir que nada mudou.",
    startsAt: "2026-09-23T19:00:00-03:00",
    durationMin: 60,
    seats: 24,
    status: "upcoming",
    topics: ["Reestruturação", "Engenharia", "Comunicação"],
  },
  {
    id: "hs-ana",
    hostId: "m-ana",
    title: "Primeiro trimestre como diretora comercial",
    summary:
      "Ana Paula assume o hotseat com números, território e a solidão de quem virou chefe dos antigos pares.",
    startsAt: "2026-09-30T12:00:00-03:00",
    durationMin: 50,
    seats: 20,
    status: "upcoming",
    topics: ["Vendas", "Promoção", "Pares"],
  },
]

const questions: HotseatQuestion[] = [
  {
    id: "q-1",
    hotseatId: "hs-live",
    authorId: "m-camila",
    text: "Você falou com o diretor antes de marcar o 1:1, ou foi só você e ele na sala?",
    votes: 9,
    createdAt: "2026-09-19T12:08:00-03:00",
  },
  {
    id: "q-2",
    hotseatId: "hs-live",
    authorId: "m-rafael",
    text: "O que você ensaiou e abandonou na primeira frase?",
    votes: 6,
    createdAt: "2026-09-19T12:11:00-03:00",
  },
  {
    id: "q-3",
    hotseatId: "hs-rafael",
    authorId: "m-diego",
    text: "Como você escolheu quem saía do organograma sem transformar o restante em um concurso de sobrevivência?",
    votes: 11,
    createdAt: "2026-09-18T16:22:00-03:00",
  },
]

const problems: Problem[] = [
  {
    id: "pb-estrela",
    authorId: "m-diego",
    title: "Meu IC estrela recusou a promoção para gestão — e o RH insiste",
    body: "Ela é a melhor PM individual do time. Não quer gente. O RH trata isso como falta de ambição. Eu preciso de um argumento que não seja 'ela é tímida'.",
    context: "Produto, 32 pessoas, ciclo de promoção no fim do mês.",
    tags: ["Carreira", "RH", "Promoção"],
    status: "open",
    createdAt: "2026-09-17T10:05:00-03:00",
  },
  {
    id: "pb-bypass",
    authorId: "m-thiago",
    title: "O diretor fala direto com os encarregados e me esvazia",
    body: "Toda segunda ele entra no grupo das lojas, muda prioridade e eu fico sabendo no corredor. Meu time já pergunta se eu ainda decido alguma coisa.",
    context: "11 lojas em Brasília e entorno. Diretor no HQ de São Paulo.",
    tags: ["Autoridade", "Varejo", "C-level"],
    status: "in-progress",
    createdAt: "2026-09-15T19:40:00-03:00",
  },
  {
    id: "pb-hibrido",
    authorId: "m-bruno",
    title: "Time híbrido: sede em Campinas, operação no Nordeste, rancor no meio",
    body: "Quem está no escritório ganha contexto. Quem está no hub de Recife ganha o turno ruim. Quero um desenho de cadência que não seja 'mais uma daily'.",
    context: "Operações 24/7, 3 hubs, 2 fusos.",
    tags: ["Híbrido", "Operações", "Cadência"],
    status: "open",
    createdAt: "2026-09-13T08:15:00-03:00",
  },
]

const solutions: Solution[] = [
  {
    id: "sol-1",
    problemId: "pb-estrela",
    authorId: "m-marina",
    body: "Troque o vocabulário de ambição por escopo. Escreva a vaga de staff com impacto, interface e compensação iguais às de um gerente júnior. Se o RH não assinar isso, o problema não é ela — é a tabela.",
    helpful: 14,
    createdAt: "2026-09-17T15:33:00-03:00",
  },
  {
    id: "sol-2",
    problemId: "pb-bypass",
    authorId: "m-ana",
    body: "Marque 20 minutos com o diretor com uma regra única: pedidos para loja passam por você, ou o SLA que ele cobra não vale. Leve um exemplo da semana, não um manifesto.",
    helpful: 8,
    createdAt: "2026-09-16T09:02:00-03:00",
  },
]

const meetings: Meeting[] = [
  {
    id: "mt-1",
    title: "1:1 entre pares · retenção de gerentes",
    hostId: "m-camila",
    guestIds: ["m-juliana"],
    startsAt: "2026-09-22T10:00:00-03:00",
    durationMin: 45,
    place: "Google Meet",
    notes: "Camila quer testar o ritual de 1:1 da Juliana no time de people da Leme.",
  },
  {
    id: "mt-2",
    title: "Mesa de operação híbrida",
    hostId: "m-bruno",
    guestIds: ["m-thiago", "m-diego"],
    startsAt: "2026-09-24T08:30:00-03:00",
    durationMin: 60,
    place: "Meet · sala Managerz",
    notes: "Comparar cadência de loja e de hub logístico.",
  },
]

const webinars: Webinar[] = [
  {
    id: "wb-11",
    hostId: "m-juliana",
    title: "1:1s que mudam desempenho — sem virar terapia ruim",
    summary:
      "Uma hora sobre estrutura, silêncio e o combinado de 14 dias. Com casos reais de healthtech e fintech.",
    startsAt: "2026-09-25T19:00:00-03:00",
    durationMin: 60,
    topics: ["1:1", "Desempenho"],
    capacity: 80,
  },
  {
    id: "wb-feedback",
    hostId: "m-marina",
    title: "Feedback difícil sem teatro",
    summary:
      "Como dizer a coisa inteira numa conversa de 25 minutos, inclusive quando o outro é mais sênior do que você.",
    startsAt: "2026-10-07T12:00:00-03:00",
    durationMin: 50,
    topics: ["Feedback", "Conflito"],
    capacity: 100,
  },
  {
    id: "wb-contratar",
    hostId: "m-rafael",
    title: "Contratar gestores: o que não aparece no currículo",
    summary:
      "Sinais de quem já liderou de verdade — e armadilhas de quem só sobreviveu a um título.",
    startsAt: "2026-10-16T19:00:00-03:00",
    durationMin: 70,
    topics: ["Contratação", "Gestão"],
    capacity: 90,
  },
]

const listings: Listing[] = [
  {
    id: "ls-diego",
    authorId: "m-diego",
    kind: "service",
    title: "Mentoria de gestão de produto e engenharia",
    description:
      "4 sessões de 50 min para EMs e PMs que acabaram de ganhar gente. Foco em cadência, priorização e a primeira conversa difícil.",
    category: "Mentoria",
    priceCents: 45000,
    tradeFor: null,
    city: "Recife · remoto",
    createdAt: "2026-09-10T12:00:00-03:00",
  },
  {
    id: "ls-juliana",
    authorId: "m-juliana",
    kind: "service",
    title: "Workshop de feedback para o seu time de gestores",
    description:
      "Meio dia, até 12 gestores. Casos do próprio time, não slide genérico. Inclui um roteiro de 1:1 para as duas semanas seguintes.",
    category: "Workshop",
    priceCents: 320000,
    tradeFor: null,
    city: "Belo Horizonte · híbrido",
    createdAt: "2026-09-08T09:00:00-03:00",
  },
  {
    id: "ls-bruno",
    authorId: "m-bruno",
    kind: "service",
    title: "Facilitação de offsite de operações",
    description:
      "Dois dias para times que não cabem numa sala de inovação. Turnos, SLA, rancor e o mapa da semana seguinte.",
    category: "Facilitação",
    priceCents: 650000,
    tradeFor: null,
    city: "Campinas · presencial",
    createdAt: "2026-09-05T16:20:00-03:00",
  },
  {
    id: "ls-camila",
    authorId: "m-camila",
    kind: "trade",
    title: "4h de people por 4h de produto",
    description:
      "Troco desenho de ciclo de feedback, entrevista de gestor e onboarding de manager por ajuda para montar a trilha de produto da Leme.",
    category: "Troca",
    priceCents: null,
    tradeFor: "Mentoria de produto ou discovery com gestores",
    city: "São Paulo · remoto",
    createdAt: "2026-09-11T11:10:00-03:00",
  },
  {
    id: "ls-marina",
    authorId: "m-marina",
    kind: "service",
    title: "Coaching de transição IC → gestão",
    description:
      "Programa de 8 semanas para quem aceitou a cadeira e ainda não sabe o que parar de fazer com as próprias mãos.",
    category: "Coaching",
    priceCents: 38000,
    tradeFor: null,
    city: "Porto Alegre · remoto",
    createdAt: "2026-09-04T14:00:00-03:00",
  },
]

const inquiries: Inquiry[] = [
  {
    id: "inq-1",
    listingId: "ls-diego",
    authorId: "m-rafael",
    message:
      "Diego, tenho dois EMs novos. Queria as 4 sessões em outubro, em português, depois das 18h.",
    createdAt: "2026-09-18T09:41:00-03:00",
  },
]

export const seedState: CommunityState = {
  ideas,
  replies,
  ideaVotes: ["idea-trilha"],
  hotseats,
  questions,
  questionVotes: ["q-1"],
  rsvps: ["hs-live", "wb-11"],
  problems,
  solutions,
  solutionVotes: ["sol-1"],
  meetings,
  webinars,
  listings,
  inquiries,
}

export const landingStats = [
  { value: "8", label: "gestores no círculo inicial" },
  { value: "3", label: "hotseats nesta quinzena" },
  { value: "pt-BR", label: "conversa em português, horário de Brasília" },
]
