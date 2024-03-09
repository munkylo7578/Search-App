import Skeleton from "react-loading-skeleton";
import { useContact } from "../useContact";
import Contact from "./Contact";

function Contacts() {
  const {
    contacts,
    searchTerm,
    handleSearch,
    isLoading,
    containerRef,
    isLoadMore,
    onScroll,
  } = useContact();

  if (isLoading) {
    return (
      <div ref={containerRef} className="w-full max-w-md overflow-y-auto">
        <ul>
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <li
                key={index}
                className="px-4 py-2 border-b border-gray-200 animate-pulse"
              >
                <div className="text-gray-800">
                  <Skeleton count={1} height={24} />
                </div>
                <div className="text-gray-500">
                  <Skeleton count={1} height={24} />
                </div>
              </li>
            ))}
        </ul>
      </div>
    );
  }

  return (
    <>
      <div
        onScroll={onScroll}
        ref={containerRef}
        className="w-full max-w-md overflow-y-auto scrollbar"
      >
        <div className="bg-pink-200 p-4 rounded-t-lg sticky top-0 z-10">
          <input
            className="w-full p-2 text-gray-700 rounded-md"
            placeholder="Search by name, phone number"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="bg-white shadow overflow-hidden rounded-b-lg">
          {Object.entries(contacts).map(([letter, groupContacts], index) => (
            <div key={index}>
              <div className="px-4 py-2 sticky top-0 bg-gray-100 z-9">
                <p className="text-gray-800 font-bold">{letter}</p>
              </div>
              <ul>
                {groupContacts.map((contact, contactIndex) => (
                  <Contact
                    key={contactIndex}
                    contact={contact}
                    searchTerm={searchTerm}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
        {isLoadMore && (
          <div className="h-20 mt-3 w-full flex justify-center">
            <span className="loader"></span>
          </div>
        )}
      </div>
    </>
  );
}

export default Contacts;
