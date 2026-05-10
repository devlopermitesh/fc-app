import { RoomScreen } from "@/components/room/room-screen";

type RoomPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const RoomPage = async ({ params }: RoomPageProps) => {
  const { id } = await params;

  return <RoomScreen roomId={id} />;
};

export default RoomPage;
