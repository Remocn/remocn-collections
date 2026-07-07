# Prompt — Introducing Videorc

Оригинальный запрос:

> нужно сделать introducing демо видео для проекта videorc автор orcdev
> мы уже делали спонсорское видео с ним. Вот сайт https://www.videorc.com/
> вот github https://github.com/TheOrcDev/videorc — нужно получить стиль
> проекта, суть проекта, фичи проекта
>
> Используем Manrope шрифт.
> Не используем letter spacing, uppercase, installation pills, badges,
> text highlight markers.
>
> Видео должно быть премиальное, использовать нужно динамические переходы,
> не нужна нам сильная статика.
>
> Рефы: src/demos/introducing-shadcn/, src/demos/introducing-remocn/,
> src/demos/sponsor-reactbits/index.tsx
>
> Не использовать swirl переход — уже заезженная тема, нужно что-то новое.
>
> Проанализировать https://shaders.paper.design/ и подобрать подходящий
> по смыслу shader.
>
> Всё ритмично: без дёрганий, рваных переходов и бессмысленных анимаций;
> если одна анимация начинает движение в одну сторону — другая должна
> поддержать это движение; никакого бессмысленного fade in / fade out.

## Исследование (июль 2026)

- **Суть:** Videorc — open-source Mac-студия: запись экрана, камеры и
  микрофона в 4K 60fps локально и бесплатно, лайв на YouTube/Twitch/X/RTMP,
  Premium — 5 направлений одновременно + AI-пайплайн публикации
  (транскрипт, заголовок, описание, главы, хайлайты). AGPL-3.0,
  Electron + React (shadcn/ui) + Rust + FFmpeg. Автор — OrcDev.
- **Копирайт сайта:** «The future of video starts here», «Create videos.
  Stream everywhere. Let AI handle the tedious parts», «Everything you
  need in one window», «From setup to live in seconds», «Built open
  source. Priced when you need more».
- **Стиль:** zinc-токены из собственного CSS сайта (`.dark`:
  `#18181b` фон, `#f5f5f6` ink, `#a1a1a8` muted), логотип — кибер-орк
  с красными глазами на чёрной app-иконке; на сайте живут `#ff3b30` /
  `#ff0033` — красный записи. Акцент видео — record-red `#ff3b30`.
- **Shader (paper.design):** grain-gradient — плёночное зерно поверх
  живого градиента: текстура самого видео. Тот же шейдер (shape wave /
  ripple) приводит в движение переходы wave-wipe и ripple-zoom — фон и
  переходы говорят на одном языке. Форма подложки — `corners`: зерно
  живёт по краям кадра, центр остаётся чистым под типографику.
