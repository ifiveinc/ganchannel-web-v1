import { useState } from "react";
import { Link } from "react-router";
import { MdMenu } from "react-icons/md";
import iFiveIcon from "~/assets/ifive-icon.png";
import MenuDrawer from "~/components/layout/header/menu-drawer";
import styles from "./news-header.module.css";

// ニュースの上部固定ヘッダー（デザイン規約 §19.1）。
// circle-info・Q&A のヘッダーと同じ構成・寸法にする。
export default function NewsHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
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
          <p className={styles.title}>ニュース</p>

          {/* 全機能への入口。画面幅によらず常に出す（規約 §19.0） */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="メニューを開く"
            aria-expanded={isMenuOpen}
            aria-controls="menu-drawer"
            className={styles.menuButton}
          >
            <MdMenu size={24} aria-hidden />
          </button>
        </div>
      </header>

      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
