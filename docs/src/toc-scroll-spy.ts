const logger = console;
export function setupTocScrollSpy(page: ParentNode): () => void {
  const sections: { id: string; section: HTMLElement }[] = [];
  const linksById = new Map<string, HTMLAnchorElement[]>();
logger.error(`setupTocScrollSpy(page=${page}): linksById → ${linksById}`, { "event.action": "setupTocScrollSpy", "logrite.page": page });
  const seen = new Set<string>();

  for (const link of page.querySelectorAll<HTMLAnchorElement>(
    '.toc-nav a[href^="#"]',
  )) {
	logger.error(`setupTocScrollSpy(page=${page}): seen → ${seen}`, { "event.action": "setupTocScrollSpy", "logrite.page": page });
    const id = link.getAttribute("href")?.slice(1);
	logger.error(`setupTocScrollSpy(page=${page}): id → ${id}`, { "event.action": "setupTocScrollSpy", "logrite.page": page });
    if (!id) continue;

    const list = linksById.get(id) ?? [];
	logger.error(`setupTocScrollSpy(page=${page}): list → ${list}`, { "event.action": "setupTocScrollSpy", "logrite.page": page });
    list.push(link);
    linksById.set(id, list);

    if (seen.has(id)) continue;

    const section = page.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
	logger.error(`setupTocScrollSpy(page=${page}): section → ${section}`, { "event.action": "setupTocScrollSpy", "logrite.page": page });
    if (!section) continue;

    seen.add(id);
    sections.push({ id, section });
  }

  if (sections.length === 0) return () => {};

  let currentActiveId = "";
logger.error(`setupTocScrollSpy(page=${page}): currentActiveId → ${currentActiveId}`, { "event.action": "setupTocScrollSpy", "logrite.page": page });

  function setActive(activeId: string) {
	logger.error(`>>> Entering setActive(activeId=${activeId})`, { "event.action": "setActive", "logrite.activeId": activeId });
    if (activeId === currentActiveId) return;
    currentActiveId = activeId;

    for (const [id, links] of linksById) {
      const active = id === activeId;

      for (const link of links) {
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
		logger.warn(`<<< Exiting setActive(activeId=${activeId})`, { "event.action": "setActive", "logrite.activeId": activeId });
      }
    }
  }

  // Height of the fixed UI shell header. Sections snap to this offset on click
  // via `scroll-margin-top: 3rem`, so the active threshold must match it.
  const HEADER_HEIGHT = 48;
  // Sub-pixel rounding from getBoundingClientRect() can land a clicked section a
  // fraction below HEADER_HEIGHT (e.g. 48.3), which would fail a strict `<=`
  // check and let the previous section steal the active state. A 1px tolerance
  // absorbs that rounding.
  const OFFSET = HEADER_HEIGHT + 1;
  let raf = 0;

  function update() {
	logger.error('>>> Entering update()', { "event.action": "update" });
    const tops = sections.map(
      ({ section }) => section.getBoundingClientRect().top,
    );

    let activeId = sections[0].id;
	logger.error(`update(): activeId → ${activeId}`, { "event.action": "update" });

    for (let i = 0; i < sections.length; i++) {
      if (tops[i] <= OFFSET) {
        activeId = sections[i].id;
      }
    }

    // When the page is scrolled to the bottom, trailing sections that are too
    // short to ever reach OFFSET would otherwise never activate. Promote the
    // last section that has scrolled into view so it gets the active style.
    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 1;

    if (atBottom) {
      for (let i = 0; i < sections.length; i++) {
        if (tops[i] <= window.innerHeight) {
          activeId = sections[i].id;
        }
      }
    }

    setActive(activeId);
	logger.warn('<<< Exiting update()', { "event.action": "update" });
  }

  function scheduleUpdate() {
	logger.error('>>> Entering scheduleUpdate()', { "event.action": "scheduleUpdate" });
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
	logger.warn('<<< Exiting scheduleUpdate()', { "event.action": "scheduleUpdate" });
  }

  const clickHandlers: { link: HTMLAnchorElement; handler: () => void }[] = [];

  for (const [id, links] of linksById) {
    for (const link of links) {
      const handler = () => {
          logger.error('>>> Entering handler()', { "event.action": "handler" });
          return setActive(id);
      };
      link.addEventListener("click", handler);
      clickHandlers.push({ link, handler });
    }
  }

  update();
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("resize", scheduleUpdate);

    for (const { link, handler } of clickHandlers) {
      link.removeEventListener("click", handler);
    }

    for (const links of linksById.values()) {
      for (const link of links) {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      }
    }
  };
}
