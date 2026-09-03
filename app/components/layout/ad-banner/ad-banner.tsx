import { useRef, useState } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { NavLink } from "react-router";
import { MdChevronRight } from "react-icons/md";
import adIFiveIcon from "~/assets/ifive-banner-icon.png";
import styles from "./ad-banner.module.css";

/** この距離（px）以上ドラッグしたら開閉する。届かなければ元の位置へ戻す */
const DRAG_THRESHOLD = 40;
/** これ以下の移動はタップとみなし、ドラッグとして扱わない */
const DRAG_SLOP = 4;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

// 広告バナー（デザイン規約 §6.1・§6.4）。下部固定ナビ（h-16）の真上に重ねる。
// 上部のバーを押すか下へドラッグすると、本体がナビの裏へ隠れてバーだけが残る。
// バーを押すか引き上げれば元に戻る。root.tsx で <Outlet /> の外に置いているため、
// 開閉状態はページ遷移をまたいで保たれる（再読み込みで元に戻る）。
export default function Ad() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // ドラッグ中の translateY（px）。null はドラッグしていない状態
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const dragStartY = useRef(0);
  /** 畳みきったときの移動量（px）。バーの高さぶんは残す */
  const dragRange = useRef(0);
  const hasMoved = useRef(false);

  // 畳んでいるときは移動量いっぱいが起点、開いているときは 0 が起点
  const restingOffset = isCollapsed ? dragRange.current : 0;

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const banner = bannerRef.current;
    const handle = handleRef.current;
    if (!banner || !handle) return;

    // バーの外へ指が出ても追従させる
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRange.current = banner.offsetHeight - handle.offsetHeight;
    dragStartY.current = event.clientY;
    hasMoved.current = false;
    setDragOffset(isCollapsed ? dragRange.current : 0);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragOffset === null) return;
    // 開ききった位置と畳みきった位置の間に収める
    const next = clamp(
      restingOffset + (event.clientY - dragStartY.current),
      0,
      dragRange.current,
    );
    if (Math.abs(next - restingOffset) > DRAG_SLOP) hasMoved.current = true;
    setDragOffset(next);
  };

  const handlePointerUp = () => {
    if (dragOffset === null) return;
    // 開いているときは下方向が正、畳んでいるときは上方向が負になる
    const distance = dragOffset - restingOffset;
    if (isCollapsed && distance <= -DRAG_THRESHOLD) setIsCollapsed(false);
    else if (!isCollapsed && distance >= DRAG_THRESHOLD) setIsCollapsed(true);
    setDragOffset(null);
  };

  const handlePointerCancel = () => {
    setDragOffset(null);
  };

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    // キーボード操作（detail === 0）は常に受け付ける。ポインタ由来の click は
    // ドラッグの終わりにも発火するため、動かしていた場合だけ無視する
    if (event.detail !== 0 && hasMoved.current) return;
    setIsCollapsed((collapsed) => !collapsed);
  };

  const isDragging = dragOffset !== null;

  return (
    <div
      ref={bannerRef}
      className={`${styles.banner} ${isDragging ? styles.bannerDragging : ""} ${
        isCollapsed ? styles.bannerCollapsed : ""
      }`}
      // ドラッグ量は動的な値のため inline style で与える（規約 §26.4 の例外）
      style={isDragging ? { transform: `translateY(${dragOffset}px)` } : undefined}
    >
      <button
        ref={handleRef}
        type="button"
        aria-label={isCollapsed ? "広告を開く" : "広告を閉じる"}
        aria-expanded={!isCollapsed}
        aria-controls="ad-banner-content"
        className={styles.handle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClick={handleClick}
      >
        <span aria-hidden className={styles.handleBar} />
      </button>

      <div id="ad-banner-content" className={styles.inner}>
        {/* リンクの入れ子を避けるため、操作要素は NavLink の外に置く（規約 §16.1） */}
        <NavLink to="/ad-inquiry" className={styles.link}>
          <img className={styles.thumbnail} src={adIFiveIcon} alt="" />

          <div className={styles.body}>
            <p className={styles.title}>【広告募集中】</p>
            <p className={styles.description}>
              がんチャンネルでは、企業様のPRから、サークル・イベントの告知など様々な広告を募集しています！
            </p>
            <p className={styles.cta}>
              <span>問い合わせはこちらから</span>
              <MdChevronRight size={18} aria-hidden />
            </p>
          </div>
        </NavLink>
      </div>
    </div>
  );
}
