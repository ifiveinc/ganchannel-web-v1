import { Link } from "react-router";
import { MdMenu } from "react-icons/md";
import iFiveIcon from "~/assets/ifive-icon.png";
import styles from "./circle-header.module.css";

type CircleHeaderProps = {
  title: string;
};

// 機能内の上部固定ヘッダー（デザイン規約 §19.1）。
// 機能内ナビは画面幅によらず下部固定フッターが担当するため、ここには置かない。
export default function CircleHeader({ title }: CircleHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* アイコンはがんちゃんねる本体のTOPへ戻る導線 */}
        <Link
          to="/"
          aria-label="がんちゃんねるのTOPへ戻る"
          className={styles.homeLink}
        >
          <img src={iFiveIcon} alt="" className={styles.logo} />
        </Link>

        {/* ページの見出し（h1）は各画面が持つため、ここは見出しにしない（規約 §24.1） */}
        <p className={styles.title}>{title}</p>

        {/* TODO: ハンバーガーメニューは未実装（デザイン規約 §29-11）。
            中身が決まるまで無効状態で置く */}
        <button
          type="button"
          disabled
          aria-label="メニュー（準備中）"
          className={styles.menuButton}
        >
          <MdMenu size={24} aria-hidden />
        </button>
      </div>
    </header>
  );
}
