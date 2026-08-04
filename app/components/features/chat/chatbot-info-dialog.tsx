import { useRef } from "react";
import { MdClose, MdInfoOutline } from "react-icons/md";

// 「チャットボットについて」ボタン。オープンキャンパス等でこの画面に初めて来た人が
// 一問一答形式であることやβ版であることを知る手段が口頭説明しか無かったため追加した
// （2026-08-05）。ネイティブの<dialog>を使い、Escapeキーでの閉じる操作は標準機能に任せる。
export default function ChatbotInfoDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        aria-label="チャットボットについて"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink hover:bg-surface-card"
      >
        <MdInfoOutline size={24} aria-hidden />
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-card border border-border bg-surface p-0 shadow-card backdrop:bg-black/40"
      >
        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-ink">チャットボットについて</h2>
            <button
              type="button"
              aria-label="閉じる"
              onClick={() => dialogRef.current?.close()}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-surface-card"
            >
              <MdClose size={18} aria-hidden />
            </button>
          </div>

          <ul className="flex flex-col gap-3 text-sm leading-relaxed text-ink">
            <li>
              質問は1件ごとに独立して処理しています。過去のやり取りを踏まえた会話（文脈を引き継いだ追加の質問）にはまだ対応していません。
            </li>
            <li>現在β版として提供しており、日々改善を進めています。</li>
            <li>
              特にサークル・部活動に関する質問に強く対応しています。それ以外のキャンパス生活に関する質問には、十分にお答えできない場合があります。
            </li>
          </ul>
        </div>
      </dialog>
    </>
  );
}
