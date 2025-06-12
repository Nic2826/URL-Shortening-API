type CardProps = {
  src: string;
  alt: string;
  title: string;
  description: string;
};

export default function Card({ src, alt, title, description }: CardProps) {
  return (
    <div className="card">
      <div className="card__img-container">
        <img
          className="card__img"
          src={`/public/images/${src}`}
          alt={`${alt} icon`}
        />
      </div>

      <h3 className="card__title">{title}</h3>
      <p className="card__description">
        {description}
      </p>
    </div>
  );
}
