import { useState, useEffect } from "react";
import { Link } from "react-router"; // RemixのLinkコンポーネントをインポート
import { MdGroups, MdChatBubbleOutline, MdGridView, MdOpenInNew, MdPersonAdd } from "react-icons/md";
import type { Route } from "./+types/_app._index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "がんちゃんねる" },
    {
      name: "description",
      content: "岩手大学の情報を統合するアプリ「がんちゃんねる」",
    },
  ];
}

const SLIDE_IMAGES = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
];

export default function Index() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === SLIDE_IMAGES.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDE_IMAGES.length - 1 : prev - 1));
  };
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === SLIDE_IMAGES.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-4 pb-48 md:py-4 flex flex-col min-h-[calc(100dvh-3.5rem)] md:h-[calc(100dvh-3.5rem)] bg-[var(--color-surface-card)]/30">
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4">
        
        {/* ① アプリ説明＋ビジュアル */}
        <div className="md:col-span-1 md:row-span-2 min-h-[300px] md:min-h-0 bg-gradient-to-br from-[var(--color-primary)] to-[#2b6e4b] rounded-[var(--radius-sheet)] p-6 relative overflow-hidden flex flex-col shadow-[var(--shadow-card)] border border-[var(--color-primary)]/20">
          <div className="relative z-10 shrink-0">
            <h1 className="text-white text-xl font-bold leading-tight">
              「誰かに聞きたかった」が、ここにある。
            </h1>
            <p className="text-emerald-100/90 mt-2 text-sm">
              公式発表にはないけれど、知らないと困る。「がんちゃんねる」は、そんな探すのが面倒な学内情報をまとめた準オフィシャルアプリ。かゆい所に手が届く、岩大生の強い味方です。
            </p>
          </div>

          <div className="relative z-10 flex-1 min-h-0 mt-4 rounded-[var(--radius-card)] overflow-hidden group border border-white/10 shadow-inner">
            <div 
              className="flex h-full w-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {SLIDE_IMAGES.map((src, idx) => (
                <div key={idx} className="h-full w-full shrink-0">
                  <img src={src} alt={`slide-${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <button 
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity active:scale-95"
              aria-label="前の画像"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity active:scale-95"
              aria-label="次の画像"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {SLIDE_IMAGES.map((_, idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? "w-4 bg-white" : "w-1.5 bg-white/50"}`} />
              ))}
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* ② 主要動線パネル（Linkコンポーネントに変更） */}
        <div className="md:col-span-1 md:row-span-1 min-h-[200px] md:min-h-0 bg-[var(--color-surface-card)] rounded-[var(--radius-sheet)] p-2.5 flex flex-col shadow-[var(--shadow-card)] border border-[var(--color-border)] overflow-hidden">
          <div className="flex flex-col gap-1.5 h-full min-h-0">
            
            {/* サークルを探すリンク */}
            <Link 
              to="/circle-info" 
              className="flex-1 min-h-0 bg-[var(--color-surface)]/80 border border-[var(--color-border)] rounded-[var(--radius-card)] flex flex-row items-center p-1.5 text-left hover:bg-[var(--color-surface)] hover:border-[var(--color-primary)]/30 transition active:scale-95 group overflow-hidden shadow-xs"
            >
              <div className="h-full aspect-square max-h-[64px] bg-[var(--color-surface-card)] shadow-xs rounded-[var(--radius-control)] shrink-0 flex items-center justify-center overflow-hidden relative border border-[var(--color-border)]">
                <MdGroups className="text-2xl lg:text-3xl text-[var(--color-primary)]" />
              </div>
              <div className="ml-2.5 flex-1 min-w-0 flex flex-col justify-center">
                <span className="block text-[12px] md:text-sm font-bold text-[var(--color-ink)] leading-tight truncate">サークルを探す</span>
                <span className="block text-[9px] md:text-[10px] text-[var(--color-ink-muted)] mt-0.5 truncate">
                  自分に合ったサークルを見つけることが出来ます。
                </span>
              </div>
              <div className="shrink-0 text-[var(--color-border-strong)] group-hover:text-[var(--color-primary)] transition-colors pr-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>

            {/* AIに質問するリンク */}
            <Link 
              to="/chat" 
              className="flex-1 min-h-0 bg-[var(--color-surface)]/80 border border-[var(--color-border)] rounded-[var(--radius-card)] flex flex-row items-center p-1.5 text-left hover:bg-[var(--color-surface)] hover:border-[var(--color-primary)]/30 transition active:scale-95 group overflow-hidden shadow-xs"
            >
              <div className="h-full aspect-square max-h-[64px] bg-[var(--color-surface-card)] shadow-xs rounded-[var(--radius-control)] shrink-0 flex items-center justify-center overflow-hidden relative border border-[var(--color-border)]">
                <MdChatBubbleOutline className="text-2xl lg:text-3xl text-[var(--color-primary)]" />
              </div>
              <div className="ml-2.5 flex-1 min-w-0 flex flex-col justify-center">
                <span className="block text-[12px] md:text-sm font-bold text-[var(--color-ink)] leading-tight truncate">AIに質問する</span>
                <span className="block text-[9px] md:text-[10px] text-[var(--color-ink-muted)] mt-0.5 truncate">
                  岩大生活に特化したAIがあなたの疑問に答えます。
                </span>
              </div>
              <div className="shrink-0 text-[var(--color-border-strong)] group-hover:text-[var(--color-primary)] transition-colors pr-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>

            {/* 他の便利機能を探すリンク */}
            <Link 
              to="/features" 
              className="flex-1 min-h-0 bg-[var(--color-surface)]/80 border border-[var(--color-border)] rounded-[var(--radius-card)] flex flex-row items-center p-1.5 text-left hover:bg-[var(--color-surface)] hover:border-[var(--color-border-strong)] transition active:scale-95 group overflow-hidden shadow-xs"
            >
              <div className="h-full aspect-square max-h-[64px] bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs rounded-[var(--radius-control)] shrink-0 flex items-center justify-center overflow-hidden relative">
                <MdGridView className="text-2xl lg:text-3xl text-[var(--color-ink)]" />
              </div>
              <div className="ml-2.5 flex-1 min-w-0 flex flex-col justify-center">
                <span className="block text-[12px] md:text-sm font-bold text-[var(--color-ink)] leading-tight truncate">他の便利機能を探す</span>
                <span className="block text-[9px] md:text-[10px] text-[var(--color-ink-muted)] mt-0.5 truncate">
                  がんちゃんねるの機能一覧を確認できます。
                </span>
              </div>
              <div className="shrink-0 text-[var(--color-border-strong)] group-hover:text-[var(--color-ink)] transition-colors pr-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        {/* ③ 運営団体・開発者パネル */}
        <div className="md:col-span-1 md:row-span-1 min-h-[160px] md:min-h-0 bg-[var(--color-primary-subtle)] rounded-[var(--radius-sheet)] p-5 text-[var(--color-ink)] relative overflow-hidden flex flex-col justify-between shadow-[var(--shadow-card)] border border-[var(--color-primary)]/20">
          
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base md:text-lg text-[var(--color-primary)]">がんちゃんねるの開発者</h3>
            </div>
            <p className="text-[11px] md:text-xs text-[var(--color-ink-muted)] mt-2 leading-relaxed">
              がんちゃんねるはIT系学内カンパニーの"iFive"が開発・運営しています。<br/>がんちゃんねるだけでなく、色々なアプリの受託開発も手がけています！「こんなアプリを作ってほしい」「ITで解決したい課題がある」といったご相談は、ぜひ私たちにお任せください。
            </p>
          </div>

          {/* 2つのアクションボタン */}
          <div className="relative z-10 flex flex-row gap-2 mt-4 pt-4 border-t border-[var(--color-border)]">
            {/* 1. 公式HPを見るリンク（外部サイトのため <a> タグを使用） */}
            <a 
              href="https://ifive-hp.onrender.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-[var(--color-surface)] hover:bg-white transition rounded-[var(--radius-control)] p-2.5 flex flex-col items-center justify-center gap-1 active:scale-95 group border border-[var(--color-border)] shadow-xs"
            >
              <MdOpenInNew className="text-[var(--color-ink-muted)] group-hover:text-[var(--color-primary)] transition-colors text-lg" />
              <span className="text-[10px] font-bold text-[var(--color-ink)] group-hover:text-[var(--color-primary)] transition-colors">公式HPを見る</span>
            </a>
            
            {/* 2. 新入メンバー歓迎ボタン（内部リンクの Link またはお好きなパスに変更可能） */}
            <Link 
              to="/recruit" 
              className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] transition-colors rounded-[var(--radius-control)] p-2.5 flex flex-col items-center justify-center gap-1 active:scale-95 shadow-[var(--shadow-card)] border border-[var(--color-primary)]/30 text-center"
            >
              <MdPersonAdd className="text-white text-lg" />
              <span className="text-[10px] font-bold text-white">メンバー募集中!</span>
            </Link>
          </div>

          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--color-primary)]/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

      </div>
    </main>
  );
}