import { FaqItem } from "./FaqItem";

export function FaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="border-t">
      {items.map((item, index) => (
        <FaqItem key={item.q} q={item.q} a={item.a} open={index === 0} />
      ))}
    </div>
  );
}
