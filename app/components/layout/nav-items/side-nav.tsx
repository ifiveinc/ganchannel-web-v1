// This file is deprecated. 必要ないが、一応残しておく。削除予定。
// import { useState } from "react";
// import { NavLink } from "react-router";
// import { MdClose } from "react-icons/md";
// import type { NavItem } from "./bottom-nav";

// type SideNavProps = {
//   items: NavItem[];
//   /** 複数のナビが同一ページに存在しても区別できるようにする */
//   ariaLabel: string;
// };

// // PC用スリムサイドナビ。
// // スマホサイズでは非表示（hidden）、md以上で左側に固定表示。
// export default function SideNav({ items, ariaLabel }: SideNavProps) {
//   // モーダルの状態管理
//   const [isAdOpen, setIsAdOpen] = useState(false);

//   return (
//     <>
//       <nav
//         aria-label={ariaLabel}
//         className="hidden md:flex fixed top-10 bottom-0 left-0 z-0 w-20 flex-col border-r border-border bg-surface overflow-y-auto"
//       >
//         <ul className="flex h-full flex-col gap-2 p-2 pb-4 pt-16">
//           {items.map(({ label, to, end, icon: Icon }) => (
//             <li key={label}>
//               <NavLink
//                 to={to}
//                 end={end}
//                 className={({ isActive }) =>
//                   `flex flex-col items-center justify-center gap-1 rounded-control py-2 transition-colors ${
//                     isActive
//                       ? "bg-primary-subtle font-bold text-primary"
//                       : "text-ink-muted hover:bg-surface-card hover:text-ink"
//                   }`
//                 }
//               >
//                 <Icon size={20} aria-hidden />
//                 <span className="mt-1 text-[10px] leading-none text-center">
//                   {label}
//                 </span>
//               </NavLink>
//             </li>
//           ))}

//           {/*
//             広告募集中エリア：
//             グラデーションの枠線 ＋ グラデーション文字で洗練されたデザインに変更
//           */}
//           <li className="mt-auto pt-2">
//             <button
//               onClick={() => setIsAdOpen(true)}
//               // 親要素でグラデーション背景と少しの余白（p-[2px]）を持たせる
//               className="group w-full rounded-control bg-gradient-to-br from-green-500 to-blue-500 p-[2px] shadow-sm transition-transform hover:scale-105 hover:shadow-md"
//             >
//               {/* 子要素（内側）を背景色（bg-surface）で塗りつぶすことで「枠線」を表現 */}
//               <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[calc(var(--radius-control)-2px)] bg-surface py-8 transition-colors group-hover:bg-pink-50/50">

//                 {/* 文字を bg-clip-text を使ってグラデーションで透過表示 */}
//                 <span className="bg-gradient-to-br from-green-500 to-blue-500 bg-clip-text text-[12px] font-black text-transparent">
//                   広告
//                 </span>
//                 <span className="bg-gradient-to-br from-green-500 to-blue-500 bg-clip-text text-[13px] font-black tracking-widest text-transparent">
//                   募集中!
//                 </span>

//               </div>
//             </button>
//           </li>
//         </ul>
//       </nav>

//       {/* 広告ウィンドウ（モーダル） */}
//       {isAdOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm hidden md:flex">
//           <div className="w-full max-w-sm rounded-sheet bg-surface p-6 shadow-overlay">
//             <div className="mb-4 flex items-center justify-between">
//               <h2 className="text-lg font-bold text-ink">広告募集中</h2>
//               <button
//                 onClick={() => setIsAdOpen(false)}
//                 className="rounded-full p-1 text-ink-muted transition-colors hover:bg-surface-card hover:text-ink"
//                 aria-label="閉じる"
//               >
//                 <MdClose size={24} aria-hidden />
//               </button>
//             </div>

//             <div className="text-sm text-ink-muted">
//               <p className="mb-6 leading-relaxed">
//                 がんチャンネルでは、企業様のPRから、サークル・イベントの告知など様々な広告を募集しています！
//               </p>

//               <NavLink
//                 to="/ad-inquiry"
//                 onClick={() => setIsAdOpen(false)}
//                 className="block w-full rounded-control bg-primary py-3 text-center font-bold text-surface transition-colors hover:bg-primary-hover"
//               >
//                 お問い合わせはこちら
//               </NavLink>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
