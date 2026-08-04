import { Link } from "react-router";
import { MdArrowBack } from "react-icons/md";

// がんちゃんねる本体のTOPへ戻る導線。
// 機能内で迷子にならないための控えめな脱出口なので、目立たせない（規約 §13.1 Icon）。
export default function BackToTopLink() {
  return (
    <Link
      to="/"
      aria-label="がんちゃんねるのTOPへ戻る"
      className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-ink-muted shadow-card hover:bg-surface-card"
    >
      <MdArrowBack size={20} aria-hidden />
    </Link>
  );
}
