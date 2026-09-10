type CardCopy = {
  displayName: string | null;
  role: string;
  category: string;
  line: string;
};

type SceneFontSet = Pick<FontFaceSet, 'load' | 'ready'>;

export async function loadCardFonts(fonts: SceneFontSet, members: readonly CardCopy[]) {
  // Canvas text is not part of the DOM. Request the glyph ranges for exactly
  // the titles and descriptions that will be painted, including future names.
  const titles = members.map(member => member.displayName ?? member.role).join(' ');
  const descriptions = members.map(member => member.line).join(' ');
  const latinCopy = [...members.map(member => member.category), descriptions, 'CHARACTER EDITION'].join(' ');
  await Promise.all([
    fonts.load('500 58px "Pretendard Variable"', titles),
    fonts.load('400 19px "Pretendard Variable"', descriptions),
    fonts.load('500 58px Inter', titles),
    fonts.load('400 22px Inter', latinCopy),
    fonts.ready,
  ]);
}
