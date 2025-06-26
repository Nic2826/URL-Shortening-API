import { useState } from "react";
type ResultsProps = {
  listUrl: { originalUrl: string; shortUrl: string }[];
  onDelete: (index: number) => void;
  highlightedIndex: number | null;
};
export default function Results({ listUrl, onDelete, highlightedIndex }: ResultsProps) {
  const [isClickedIndex, setIsClickedIndex] = useState<number | null>(null);

  if (listUrl.length === 0) {
    return <p className="result-empty">No shortened URLs yet.</p>;
  }


  return (
    <>
      {[...listUrl].reverse().map((arrayElement, index) => (
        <div className={`result-container ${highlightedIndex === index ? "result-highlight" : ""}`} key={index}>

          <a className="result-original-url" href={arrayElement.originalUrl} target="_blank">{arrayElement.originalUrl}</a>
          <a className="result-short-url" href={arrayElement.shortUrl} target="_blank">{arrayElement.shortUrl}</a>
          <button
            className={isClickedIndex === index ? "result__copy-button result__copy-button-clicked" : "result__copy-button"}
            onClick={() => {
              navigator.clipboard.writeText(arrayElement.shortUrl);
              setIsClickedIndex(index);
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
