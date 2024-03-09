import { useMemo, useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";

export interface IContact {
  first_name: string;
  last_name: string;
  phoneNumber: string;
}
interface IGroupedContacts {
  [key: string]: IContact[];
}
export function useContact() {
  const { data, isLoading, error } = useQuery<IContact[]>({
    queryKey: ["contacts"],
    queryFn: () =>
      axios
        .get<{ contacts: IContact[] }>(import.meta.env.VITE_MOCK_API)
        .then((res) => res.data.contacts),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingOnScroll,setLoadingOnScroll] = useState(false)

  const [displayCount, setDisplayCount] = useState(10);
  const containerRef = useRef<HTMLDivElement>(null);

  const isBottom = (el: EventTarget & Element) =>
    el.scrollHeight - Math.ceil(el.scrollTop) >= el.clientHeight - 40 &&
    el.scrollHeight - Math.ceil(el.scrollTop) <= el.clientHeight + 40;

  const isLoadMore = useMemo(
    () => data && displayCount < data.length && !searchTerm,
    [data, displayCount, searchTerm]
  );

  const onScroll = (el: React.UIEvent) => {
    if (containerRef.current && isBottom(el.currentTarget) && !loadingOnScroll) {
      setLoadingOnScroll(true); 
      setTimeout(() => {
        setDisplayCount((prevCount) => prevCount + 3);
        setLoadingOnScroll(false); 
      }, 1000); 
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setDisplayCount(10);
  };
  const groupedContacts = useMemo(() => {
    const sortedContacts =
      data
        ?.sort((a, b) => a.first_name.localeCompare(b.first_name))
        .slice(0, displayCount) || [];
    return sortedContacts.reduce((acc: IGroupedContacts, contact) => {
      const firstLetter = contact.first_name[0].toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(contact);
      return acc;
    }, {});
  }, [data, displayCount]);

  const filteredAndGroupedContacts = useMemo(() => {
    let result: IGroupedContacts = {};

    for (const [letter, contacts] of Object.entries(groupedContacts)) {
      const filteredContacts = contacts.filter(
        (contact) =>
          contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.phoneNumber.includes(searchTerm)
      );

      if (filteredContacts.length > 0) {
        result[letter] = filteredContacts;
      }
    }

    return result;
  }, [groupedContacts, searchTerm, displayCount]);

  return {
    loadingOnScroll,
    isLoadMore,
    onScroll,
    contacts: filteredAndGroupedContacts,
    containerRef,
    displayCount,
    isLoading,
    error,
    searchTerm,
    handleSearch,
  };
}
