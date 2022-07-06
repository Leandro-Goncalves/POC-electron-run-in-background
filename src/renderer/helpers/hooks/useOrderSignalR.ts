import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { OrderNotificationType } from 'renderer/shared/models/order/orderNotificationType';

interface UseOrderSignalRProvider {
  connectToHub: (
    establishmentGuid: string,
    callBack: (
      message: string,
      notificationType: OrderNotificationType
    ) => void,
    onStart: () => void
  ) => Promise<void>;
  disconnectFromHub: () => Promise<void>;
}

const hubUrl = 'https://basilisk.dbg.compraqui.app';

export const useOrderSignalR = (): UseOrderSignalRProvider => {
  const connection = new HubConnectionBuilder()
    .withUrl(`${hubUrl}/hubs/Basilisk`, {
      withCredentials: false,
    })
    .configureLogging(LogLevel.Information)
    .build();

  async function connectToHub(
    establishmentGuid: string,
    callBack: (
      message: string,
      notificationType: OrderNotificationType
    ) => void,
    onStart: () => void
  ): Promise<void> {
    connection.on('Notify', callBack);

    await connection.start().then(() => {
      connection.invoke('JoinEstablishmentRoom', establishmentGuid);

      onStart();
    });

    connection.onclose(() => {
      alert('connection closed');
    });
  }

  async function disconnectFromHub(): Promise<void> {
    await connection.off('Notify');
    await connection.stop();
  }

  return {
    connectToHub,
    disconnectFromHub,
  };
};
