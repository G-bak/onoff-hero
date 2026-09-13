import { blogCampaign as blog, instagramCampaign as feed } from './marketing-content';

export const campaignCanvasSizes = [[720, 1420], [720, 1720]] as const;

export function drawCampaignCanvas(index: number, image: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  [canvas.width, canvas.height] = campaignCanvasSizes[index];
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Campaign canvas unavailable');
  const ink = '#090a0f';
  const text = (value: string, x: number, y: number, size = 22, weight = 400, color = ink) => {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px "Pretendard Variable", sans-serif`;
    ctx.fillText(value, x, y);
  };
  const line = (y: number, x = 0, end = 720) => {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(end, y);
    ctx.strokeStyle = '#e5e7e9'; ctx.lineWidth = 1; ctx.stroke();
  };
  const circle = (x: number, y: number, radius: number, color: string) => {
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  };
  const icon = (path: string, x: number, y: number) => {
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = ink; ctx.lineWidth = 2.6;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(new Path2D(path)); ctx.restore();
  };
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (index === 0) {
    icon('M17 0L0 16L17 32', 24, 22);
    text('게시물', 322, 44, 25, 700); line(68);
    circle(42, 111, 23, '#343cff'); text('온', 30, 121, 24, 700, '#ffffff');
    text(feed.account, 82, 106, 24, 700); text('광고', 82, 133, 19);
    text('···', 662, 117, 30, 700);
    // Full 4:5 campaign photograph; never squeeze it into a square.
    ctx.drawImage(image, 0, 152, 720, 900);
    ctx.save(); ctx.translate(0, 260);
    ctx.fillStyle = '#f2f5ff'; ctx.fillRect(0, 792, 720, 52);
    text('더 알아보기', 24, 826, 23, 650, '#343cff'); text('›', 674, 829, 34, 500, '#343cff');
    icon('M19 30C-9 13 1-6 18 6C35-6 45 13 19 30Z', 25, 861);
    icon('M1 14C1-4 34-4 34 14C34 29 16 31 8 26L0 30L3 21Z', 86, 863);
    icon('M0 0L36 1L15 31L11 12ZM11 12L36 1', 147, 866);
    icon('M0 0H24V32L12 24L0 32Z', 670, 863);
    text(feed.likes, 24, 928, 23, 700);
    text(feed.account, 24, 965, 23, 700); text(feed.caption[0], 24, 999, 23);
    text(feed.caption[1], 24, 1032, 23); text(feed.tags, 24, 1065, 22, 400, '#343cff');
    text(feed.comments, 24, 1098, 20); text(feed.comment, 24, 1128, 19);
    text('2시간 전', 617, 1128, 17);
    ctx.restore();
  } else {
    ctx.fillStyle = '#03c75a'; ctx.fillRect(0, 0, 720, 66);
    text('N', 22, 46, 36, 800, '#ffffff'); text('blog', 64, 44, 31, 700, '#ffffff');
    text('글 목록', 602, 41, 22, 600, '#ffffff');
    text(blog.name, 38, 116, 29, 700); text('이웃추가 +', 572, 113, 20, 600); line(143);
    text(blog.category, 40, 192, 20, 500, '#167748');
    blog.title.forEach((value, i) => text(value, 40, 248 + i * 58, 49, 750));
    circle(54, 358, 16, '#e5eddf'); text('R', 47, 365, 19, 700, '#167748');
    text(blog.meta, 81, 366, 19); line(391, 40, 680);
    // Keep the source's bedroom photograph; the rest is a real article structure.
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight * .57, 40, 417, 640, 456);
    blog.intro.forEach((value, i) => text(value, 40, 916 + i * 32, 22));
    blog.sections.forEach((part, i) => {
      const y = 1010 + i * 150;
      ctx.fillStyle = '#167748'; ctx.fillRect(40, y - 27, 4, 31);
      text(part.title, 58, y, 29, 750);
      part.lines.forEach((value, n) => text(value, 40, y + 42 + n * 31, 21));
    });
    ctx.fillStyle = '#f0f4ed'; ctx.fillRect(40, 1415, 640, 111);
    text('구매 전 CHECKLIST', 62, 1451, 23, 700, '#167748');
    blog.checklist.forEach((value, i) => text('✓ ' + value, 62 + i * 204, 1493, 18, 600));
    blog.closing.forEach((value, i) => text(value, 40, 1576 + i * 32, 23, 500));
    line(1640, 40, 680); text(blog.footer, 40, 1683, 18);
  }
  return canvas;
}
