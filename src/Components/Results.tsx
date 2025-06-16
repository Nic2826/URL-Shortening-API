import { useState } from "react";
type ResultsProps = {
  listUrl: { originalUrl: string; shortUrl: string }[];
  onDelete: (index: number) => void;
};
export default function Results({ listUrl, onDelete }: ResultsProps) {
  const [isClickedIndex, setIsClickedIndex] = useState<number | null>(null);

  if (listUrl.length === 0) {
    return <p className="result-empty">No shortened URLs yet.</p>;
  }

  return (
    <>
      {listUrl.map((arrayElement, index) => (
        <div className="result-container" key={index}>
          <p className="result-original-url">{arrayElement.originalUrl}</p>
          <p className="result-short-url">{arrayElement.shortUrl}</p>
          <button
            className={isClickedIndex === index ? "result__copy-button result__copy-button-clicked" : "result__copy-button"}
            onClick={() => {
              navigator.clipboard.writeText(arrayElement.shortUrl);
              setIsClickedIndex(index);
              setTimeout(() => {
                setIsClickedIndex(null);
              }, 1500);
            }}
          >
            {isClickedIndex === index ? "Copied!" : "Copy"}
          </button>
          <div className="result__close-button" onClick={() => onDelete(index)}>
          </div>
        </div>
      ))}
    </>
  );
}
