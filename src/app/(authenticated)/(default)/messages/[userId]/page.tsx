import { ChatArea } from "@/components/chat-area";
import { ConversationList } from "@/components/conversation-list";

type Params = Promise<{ userId: string }>;

export default async function Page({
  params,
}: {
  params: Params;
}) {
  const { userId } = await params;

  return (
    <>
      <div className="hidden md:block">
        <ConversationList />
      </div>
      <ChatArea userId={parseInt(userId)} />
    </>
  );
} 