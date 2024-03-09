import { IContact } from "../useContact";

interface Props {
  contact: IContact;
  searchTerm: string;
}

function Contact(props: Props) {
  const { contact, searchTerm } = props;
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <li className="px-4 py-2 border-b border-gray-200">
      <p className="text-gray-800">
        {highlightText(
          `${contact.first_name} ${contact.last_name}`,
          searchTerm
        )}
      </p>
      <p className="text-gray-500">
        {highlightText(contact.phoneNumber, searchTerm)}
      </p>
    </li>
  );
}
export default Contact;
