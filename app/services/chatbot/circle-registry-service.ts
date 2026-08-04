import { circleRegistry } from "~/data/chatbot/circle-registry";
import { NAME_OVERRIDES } from "~/services/circle-info/name-overrides";
import type { CircleRegistryEntry } from "~/types/chatbot/circle-registry";

// ひらがな→カタカナ変換。NFKCは全角/半角の統一のみでひらがな⇔カタカナは
// 変換しないため、かな表記ゆれの吸収には別途必要（circles.tsのkanaはひらがな表記だが
// ユーザー入力はカタカナ・ひらがな混在しうる）。
function toKatakana(value: string): string {
  return value.replace(/[ぁ-ゖ]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) + 0x60)
  );
}

// 名前の表記ゆれ吸収用の正規化。全角→半角、スペース除去、前後の空白除去、
// かな表記統一（ひらがな→カタカナ）を行う（docs/chatbot/spec.md §9-4 手順2、Phase 11）。
// 「部」「同好会」等の接尾辞は削除しない。
export function normalizeCircleName(name: string): string {
  return toKatakana(
    name
      .normalize("NFKC")
      .replace(/\s+/g, "")
      .trim()
  );
}

export async function fetchCircleRegistry(): Promise<CircleRegistryEntry[]> {
  return circleRegistry;
}

// 名前・正規化後の一致・手動対応表の順で照合する（§9-4 手順1〜3）。
export async function findRegistryEntryByName(
  name: string
): Promise<CircleRegistryEntry | null> {
  const entries = await fetchCircleRegistry();

  const exact = entries.find((entry) => entry.name === name);
  if (exact) {
    return exact;
  }

  const normalizedTarget = normalizeCircleName(name);
  const normalizedMatch = entries.find(
    (entry) => normalizeCircleName(entry.name) === normalizedTarget
  );
  if (normalizedMatch) {
    return normalizedMatch;
  }

  const override = NAME_OVERRIDES.find(
    (item) =>
      item.formName === name || normalizeCircleName(item.formName) === normalizedTarget
  );
  if (override?.registryName) {
    return entries.find((entry) => entry.name === override.registryName) ?? null;
  }

  return null;
}

export async function findRegistryEntryByKana(
  kana: string
): Promise<CircleRegistryEntry | null> {
  const entries = await fetchCircleRegistry();
  const normalizedTarget = normalizeCircleName(kana);
  return (
    entries.find(
      (entry) => entry.kana && normalizeCircleName(entry.kana) === normalizedTarget
    ) ?? null
  );
}
