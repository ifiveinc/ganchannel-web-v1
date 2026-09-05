import InquiryHeader from "~/components/features/inquiry/inquiry-header";
import InquiryContactCard from "~/components/features/inquiry/inquiry-contact-card";
import BackToTopLink from "~/components/ui/back-to-top-link";

export function meta() {
  return [
    { title: "お問い合わせ | がんちゃんねる" },
    {
      name: "description",
      content:
        "広告掲載のご相談、ご意見・ご要望、不具合のご報告はこちらから受け付けています。",
    },
  ];
}

export default function AdInquiry() {
  return (
    <>
      <InquiryHeader />

      {/* 下部固定要素（ナビ・広告バナー）に隠れないよう下余白を確保する（規約 §5.3） */}
      <main className="mx-auto w-full max-w-lg px-4 pt-4 pb-36">
        {/* 見出しはヘッダーのタイトルが兼ねるため、視覚的には出さない */}
        <h1 className="sr-only">お問い合わせ</h1>

        <div className="flex flex-col gap-6">
          {/* 機能内で迷子にならないための脱出口（circle-info と同じ導線） */}
          <div>
            <BackToTopLink />
          </div>

          <InquiryContactCard />
        </div>
      </main>
    </>
  );
}
