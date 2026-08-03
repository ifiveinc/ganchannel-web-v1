import { MdSend, MdOpenInNew } from "react-icons/md";
import type { CircleContact as CircleContactType } from "~/types/circle";

type CircleContactProps = {
  contact: CircleContactType;
};

// SNS・連絡先。代表者・連絡先と外部リンクをまとめて表示する。
export default function CircleContact({ contact }: CircleContactProps) {
  const rows = [
    { label: "代表者", value: contact.representative },
    { label: "連絡先", value: contact.email },
  ].filter((row) => row.value !== null && row.value !== "");

  if (rows.length === 0 && contact.links.length === 0) return null;

  return (
    <section className="rounded-card border border-border bg-surface-card p-3">
      <h3 className="flex items-center gap-2 text-base font-bold leading-snug">
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <MdSend size={16} aria-hidden />
        </span>
        SNS・連絡先
      </h3>

      <div className="mt-3 flex flex-col gap-3">
        {rows.length > 0 && (
          <dl className="flex flex-col gap-2">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5">
                <dt className="text-sm text-ink-muted">{row.label}</dt>
                <dd className="text-base leading-normal break-all">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {contact.links.length > 0 && (
          <ul className="flex flex-col gap-2 border-t border-border pt-3">
            {contact.links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-11 w-full items-center justify-between gap-2 rounded-control border border-primary bg-surface px-3 text-base text-primary hover:bg-primary-subtle focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <span className="truncate">{link.label}</span>
                  <MdOpenInNew size={20} aria-hidden className="shrink-0" />
                  <span className="sr-only">（新しいタブで開きます）</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
