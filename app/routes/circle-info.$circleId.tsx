import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import {
  MdArrowBack,
  MdEventNote,
  MdCurrencyYen,
  MdPeople,
  MdPerson,
} from "react-icons/md";
import iFiveIcon from "~/assets/ifive-icon.png";
import { fetchCircleById } from "~/services/circle-service";
import CircleBadge from "~/components/features/circle-info/circle-badge";
import FavoriteButton from "~/components/features/circle-info/favorite-button";
import CircleDetailSection from "~/components/features/circle-info/detail/circle-detail-section";
import CircleAchievements from "~/components/features/circle-info/detail/circle-achievements";
import CircleContact from "~/components/features/circle-info/detail/circle-contact";

export async function loader({ params }: LoaderFunctionArgs) {
  const circle = await fetchCircleById(params.circleId as string);

  // 該当なしは404を返し、root.tsx の ErrorBoundary に委ねる
  if (!circle) {
    throw new Response("サークルが見つかりませんでした。", { status: 404 });
  }

  return { circle };
}

export function meta({ data }: { data?: { circle: { name: string } } }) {
  const name = data?.circle.name ?? "サークル情報";
  return [{ title: `${name} | がんちゃんねる` }];
}

export default function CircleInfoDetail() {
  const { circle } = useLoaderData<typeof loader>();
  const hasHero = circle.images.length > 0;

  return (
    <div className="flex flex-col gap-6 pt-4">
      {/* ヒーロー画像。左上に戻る導線を重ねる */}
      <div className="relative">
        <div className="aspect-video w-full overflow-hidden rounded-card bg-surface-card">
          <img
            src={hasHero ? circle.images[0] : iFiveIcon}
            alt=""
            className={`h-full w-full ${hasHero ? "object-cover" : "object-contain p-8"}`}
          />
        </div>
        <Link
          to="/circle-info/search"
          aria-label="サークルを探すへ戻る"
          className="absolute top-3 left-3 inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-ink shadow-card hover:bg-surface-card focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <MdArrowBack size={20} aria-hidden />
        </Link>
      </div>

      {/* 団体名・ロゴ・バッジ */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <img
            src={circle.logo ?? iFiveIcon}
            alt=""
            className="size-14 shrink-0 rounded-full border border-border bg-surface object-contain p-1"
          />
          <h1 className="min-w-0 flex-1 text-2xl font-bold leading-snug">
            {circle.name}
          </h1>
          <FavoriteButton circleId={circle.id} circleName={circle.name} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CircleBadge>{circle.organizationType}</CircleBadge>
          {circle.isOfficial !== null && (
            <CircleBadge>{circle.isOfficial ? "公認" : "非公認"}</CircleBadge>
          )}
          {circle.genres.map((genre) => (
            <CircleBadge key={genre}>{genre}</CircleBadge>
          ))}
          <CircleBadge variant="strong">{circle.recruitmentStatus}</CircleBadge>
        </div>
      </div>

      {/* 紹介文はフォームの自由記述で改行を含むため、そのまま反映する */}
      {circle.description !== "" && (
        <p className="text-base leading-relaxed whitespace-pre-line">
          {circle.description}
        </p>
      )}

      {circle.recommendedFor.length > 0 && (
        <section className="rounded-card bg-surface-card p-4">
          <h2 className="flex items-center gap-2 text-base font-bold leading-snug text-primary">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-primary">
              <MdPeople size={16} aria-hidden />
            </span>
            こんな人におすすめ
          </h2>
          <ul className="mt-3 flex flex-col gap-1">
            {circle.recommendedFor.map((item) => (
              <li key={item} className="flex gap-2 text-base leading-relaxed">
                <span aria-hidden className="shrink-0 text-primary">
                  ・
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {circle.tags.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {circle.tags.map((tag) => (
            <li key={tag}>
              <CircleBadge>#{tag}</CircleBadge>
            </li>
          ))}
        </ul>
      )}

      {/* 情報カード群。中身が空のセクションは自動的に描画されない */}
      <div className="grid gap-3 sm:grid-cols-2">
        <CircleDetailSection
          title="活動情報"
          icon={MdEventNote}
          rows={[
            { label: "活動場所", value: circle.activity.place },
            { label: "活動日時・頻度", value: circle.activity.schedule },
            { label: "募集期間", value: circle.activity.recruitmentPeriod },
            { label: "対象", value: circle.restriction },
            { label: "新歓イベント", value: circle.newcomerEvent },
          ]}
        />

        <CircleDetailSection
          title="費用"
          icon={MdCurrencyYen}
          rows={[
            { label: "入会費", value: circle.fee.admission },
            { label: "年会費", value: circle.fee.annual },
            { label: "その他費用", value: circle.fee.other },
          ]}
        />

        <CircleDetailSection
          title="メンバー構成"
          icon={MdPerson}
          rows={[
            { label: "総人数", value: circle.members.total },
            { label: "男女比", value: circle.members.genderRatio },
            { label: "初心者割合", value: circle.members.beginnerRatio },
          ]}
        />

        <CircleAchievements achievements={circle.achievements} />
      </div>

      <CircleContact contact={circle.contact} />
    </div>
  );
}
