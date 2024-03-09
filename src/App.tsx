import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import "./App.css";
import Contacts from "./components/Contacts";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-loading-skeleton/dist/skeleton.css";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});
const asyncStoragePersistor = createSyncStoragePersister({
  storage: window.localStorage,
});
persistQueryClient({
  queryClient,
  persister: asyncStoragePersistor,
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col items-center  h-screen bg-gray-100 px-3">
        <Contacts />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
