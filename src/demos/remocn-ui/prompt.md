# Prompt — remocn/ui arrives (changelog cut)

Переделать видео remocn-ui в новом стиле (introducing-videorc / introducing-shadcn /
introducing-remocn). Переделать сценарий по product-launch story design (STORYBOARD.md +
SCRIPT.md).

- Проанализировать старое видео (signup-flow — единственный чистый remocn-ui демо),
  remocn и remocn/changelog (запись 2026-06-12 «remocn/ui arrives»).
- Нельзя: letter-spacing, uppercase, badges, pulsing, installation pills.
- Нельзя swirl и ripple переходы. Придумать НОВЫЙ переход для registry —
  получился **skeleton-swap**: кат как loading state — уходящая сцена схлопывается в
  skeleton-плейсхолдеры, по ним проходит один shimmer, и блоки «гидрируются» во входящую сцену.
- Показать remocn-ui в действии (steps API + command menu + breadth montage живыми примитивами).
- Видео для changelog-страницы remocn.dev.
- Outro — новая сцена из introducing-remocn с новым логотипом (R-марка), унаследована без изменений.
- Текущий компонент (signup-flow) не трогать — это новый демо `remocn-ui`.
