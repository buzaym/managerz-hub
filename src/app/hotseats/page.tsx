import { ConversationFeed } from "@/components/community/conversation-feed"

export const metadata = {
  title: "Hotseats",
  description:
    "Sente na cadeira. A comunidade pergunta. Abra o seu hotseat depois de entrar.",
}

export default function HotseatsPage() {
  return (
    <ConversationFeed
      kind="hotseat"
      heading="Uma cadeira. Perguntas de verdade."
      description="O anfitrião traz um caso aberto. A mesa pergunta e vota. Entre para abrir o seu."
    />
  )
}
