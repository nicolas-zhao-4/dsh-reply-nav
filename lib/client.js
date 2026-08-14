window.__ModuleLoader__.load({
	id: "dsh-reply-nav",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");

		// ── injected stylesheet (claimed by client-modules as plugin-owned) ──
		const styleEl = document.createElement("style");
		styleEl.textContent = `
			.dsh-rnav-root {
				position: fixed;
				inset: 0;
				pointer-events: none;
				z-index: 5;
			}
			.dsh-rnav-rail {
				position: fixed;
				top: 50%;
				transform: translateY(-50%);
				border-radius: 10px;
				border: 1px solid var(--dsw-alias-border-l1);
				box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
				-webkit-backdrop-filter: blur(16px);
				backdrop-filter: blur(16px);
				overflow: hidden;
				pointer-events: auto;
			}
			.dsh-rnav-rail-bg {
				position: absolute;
				inset: 0;
				background: var(--dsw-alias-bg-layer-1);
				opacity: 0.8;
				pointer-events: none;
			}
			.dsh-rnav-rail-content {
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 5px;
				padding: 10px 4px;
			}
			.dsh-rnav-barwrap {
				position: relative;
				display: flex;
				justify-content: center;
				padding: 3px 6px;
				cursor: pointer;
				pointer-events: auto;
			}
			.dsh-rnav-bar {
				width: 18px;
				height: 3px;
				border-radius: 2px;
				background: var(--dsw-alias-border-l2);
				transition: background 120ms ease, transform 120ms ease, height 120ms ease;
			}
			.dsh-rnav-barwrap:hover .dsh-rnav-bar {
				background: var(--dsw-alias-brand-primary);
				transform: scaleY(1.5);
			}
			.dsh-rnav-bar[data-active] {
				background: var(--dsw-alias-brand-primary);
				height: 5px;
			}
			.dsh-rnav-preview {
				position: fixed;
				width: 540px;
				max-height: 400px;
				overflow: hidden;
				background: transparent;
				-webkit-backdrop-filter: blur(16px);
				backdrop-filter: blur(16px);
				border: 1px solid var(--dsw-alias-border-l1);
				border-radius: 12px;
				box-shadow: 0 8px 28px rgba(0, 0, 0, 0.2);
				pointer-events: none;
				z-index: 6;
			}
			.dsh-rnav-preview-bg {
				position: absolute;
				inset: 0;
				background: var(--dsw-alias-bg-overlay);
				opacity: 0.82;
				pointer-events: none;
			}
			.dsh-rnav-preview-content {
				position: relative;
				padding: 14px 18px;
			}
			.dsh-rnav-preview-label {
				font-size: 12px;
				color: var(--dsw-alias-label-secondary);
				margin-bottom: 8px;
				letter-spacing: 0.02em;
			}
			.dsh-rnav-md {
				font-size: 13.5px;
				line-height: 1.65;
				color: var(--dsw-alias-label-primary);
				word-break: break-word;
				overflow: hidden;
			}
			.dsh-rnav-md > :first-child { margin-top: 0; }
			.dsh-rnav-md > :last-child { margin-bottom: 0; }
			.dsh-rnav-md p { margin: 0 0 8px; }
			.dsh-rnav-md h1, .dsh-rnav-md h2, .dsh-rnav-md h3,
			.dsh-rnav-md h4, .dsh-rnav-md h5, .dsh-rnav-md h6 {
				margin: 10px 0 6px;
				font-weight: 600;
				line-height: 1.35;
			}
			.dsh-rnav-md h1 { font-size: 16px; }
			.dsh-rnav-md h2 { font-size: 15px; }
			.dsh-rnav-md h3 { font-size: 14px; }
			.dsh-rnav-md h4, .dsh-rnav-md h5, .dsh-rnav-md h6 { font-size: 13.5px; }
			.dsh-rnav-md pre {
				margin: 6px 0 10px;
				padding: 8px 10px;
				border-radius: 6px;
				background: var(--dsw-alias-bg-layer-2);
				border: 1px solid var(--dsw-alias-border-l1);
				overflow-x: auto;
				font-size: 12px;
			}
			.dsh-rnav-md code {
				font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
				font-size: 0.9em;
				background: var(--dsw-alias-bg-layer-2);
				padding: 1px 4px;
				border-radius: 4px;
			}
			.dsh-rnav-md pre code {
				background: none;
				padding: 0;
				white-space: pre;
			}
			.dsh-rnav-md ul, .dsh-rnav-md ol { margin: 4px 0 8px; padding-left: 20px; }
			.dsh-rnav-md li { margin: 2px 0; }
			.dsh-rnav-md blockquote {
				margin: 6px 0 10px;
				padding: 2px 0 2px 10px;
				border-left: 3px solid var(--dsw-alias-border-l2);
				color: var(--dsw-alias-label-secondary);
			}
			.dsh-rnav-md a { color: var(--dsw-alias-brand-primary); text-decoration: underline; }
			.dsh-rnav-md strong { font-weight: 600; }
			.dsh-rnav-md em { font-style: italic; }
			.dsh-rnav-md s { text-decoration: line-through; }
		`;
		document.head.appendChild(styleEl);

		// ── explicit reply text only: text blocks, never reasoning/thinking ──
		function replyTextOf(blocks) {
			if (!Array.isArray(blocks)) return "";
			for (const block of blocks) {
				if (block !== null && typeof block === "object" && block.kind === "text"
					&& typeof block.text === "string" && block.text.trim() !== "") {
					return block.text.trim();
				}
			}
			return "";
		}

		// ── minimal inline markdown → React elements (safe, no raw HTML) ──
		function renderInline(text, keyBase) {
			const out = [];
			let plain = "";
			let i = 0;
			let key = 0;
			const flush = () => {
				if (plain !== "") {
					out.push(react.createElement("span", { key: keyBase + "-" + key }, plain));
					key += 1;
					plain = "";
				}
			};
			while (i < text.length) {
				const rest = text.slice(i);
				let m = /^!\[([^\]]*)\]\(([^)\s]+)\)/.exec(rest);
				if (m !== null) {
					flush();
					out.push(react.createElement("span", { key: keyBase + "-" + key, className: "dsh-rnav-md-img" }, m[1] || "🖼"));
					key += 1; i += m[0].length; continue;
				}
				m = /^\[([^\]]+)\]\(([^)\s]+)\)/.exec(rest);
				if (m !== null) {
					flush();
					const url = m[2];
					const safe = /^(https?:|mailto:)/i.test(url);
					const label = renderInline(m[1], keyBase + "-" + key + "l");
					out.push(safe
						? react.createElement("a", { key: keyBase + "-" + key, href: url, target: "_blank", rel: "noopener noreferrer" }, label)
						: react.createElement("span", { key: keyBase + "-" + key }, label));
					key += 1; i += m[0].length; continue;
				}
				m = /^`([^`]+)`/.exec(rest);
				if (m !== null) {
					flush();
					out.push(react.createElement("code", { key: keyBase + "-" + key }, m[1]));
					key += 1; i += m[0].length; continue;
				}
				m = /^\*\*([^*]+)\*\*/.exec(rest);
				if (m !== null) {
					flush();
					out.push(react.createElement("strong", { key: keyBase + "-" + key }, renderInline(m[1], keyBase + "-" + key + "b")));
					key += 1; i += m[0].length; continue;
				}
				m = /^~~([^~]+)~~/.exec(rest);
				if (m !== null) {
					flush();
					out.push(react.createElement("s", { key: keyBase + "-" + key }, renderInline(m[1], keyBase + "-" + key + "s")));
					key += 1; i += m[0].length; continue;
				}
				m = /^\*([^*]+)\*/.exec(rest);
				if (m !== null) {
					flush();
					out.push(react.createElement("em", { key: keyBase + "-" + key }, renderInline(m[1], keyBase + "-" + key + "i")));
					key += 1; i += m[0].length; continue;
				}
				plain += rest[0];
				i += 1;
			}
			flush();
			return out;
		}

		// ── minimal block markdown → React elements ──
		function renderMarkdown(source) {
			const blocks = [];
			const lines = source.split(/\r?\n/);
			let i = 0;
			let fenceLang = null;
			let fenceLines = [];
			while (i < lines.length) {
				const line = lines[i];
				if (fenceLang !== null) {
					if (/^```/.test(line.trim())) {
						blocks.push({ type: "code", lang: fenceLang, text: fenceLines.join("\n") });
						fenceLang = null;
					} else {
						fenceLines.push(line);
					}
					i += 1;
					continue;
				}
				const open = /^```(\S*)\s*$/.exec(line.trim());
				if (open !== null) {
					fenceLang = open[1] || "";
					fenceLines = [];
					i += 1;
					continue;
				}
				if (line.trim() === "") { i += 1; continue; }
				const heading = /^(#{1,6})\s+(.*)$/.exec(line);
				if (heading !== null) {
					blocks.push({ type: "heading", level: heading[1].length, text: heading[2] });
					i += 1;
					continue;
				}
				if (line.trim().startsWith(">")) {
					const quoted = [];
					while (i < lines.length && lines[i].trim().startsWith(">")) {
						quoted.push(lines[i].trim().replace(/^>\s?/, ""));
						i += 1;
					}
					blocks.push({ type: "quote", text: quoted.join("\n") });
					continue;
				}
				const ul = /^\s*[-*+]\s+(.*)$/.exec(line);
				const ol = /^\s*(\d+)[.)]\s+(.*)$/.exec(line);
				if (ul !== null || ol !== null) {
					const ordered = ol !== null;
					const items = [];
					while (i < lines.length) {
						const m = /^\s*[-*+]\s+(.*)$/.exec(lines[i]);
						const m2 = /^\s*(\d+)[.)]\s+(.*)$/.exec(lines[i]);
						if (ordered) {
							if (m2 === null) break;
							items.push(m2[2]);
						} else {
							if (m === null) break;
							items.push(m[1]);
						}
						i += 1;
					}
					blocks.push({ type: "list", ordered: ordered, items: items });
					continue;
				}
				const para = [];
				while (i < lines.length && lines[i].trim() !== "") {
					const t = lines[i].trim();
					if (/^```/.test(t) || /^#{1,6}\s/.test(t) || t.startsWith(">")
						|| /^\s*[-*+]\s+/.test(t) || /^\s*\d+[.)]\s+/.test(t)) break;
					para.push(t);
					i += 1;
				}
				if (para.length > 0) blocks.push({ type: "p", text: para.join(" ") });
			}
			if (fenceLang !== null) {
				blocks.push({ type: "code", lang: fenceLang, text: fenceLines.join("\n") });
			}
			return blocks.map((block, idx) => {
				switch (block.type) {
					case "code":
						return react.createElement("pre", { key: "md" + idx },
							react.createElement("code", null, block.text));
					case "heading":
						return react.createElement("h" + block.level, { key: "md" + idx },
							renderInline(block.text, "md" + idx));
					case "quote":
						return react.createElement("blockquote", { key: "md" + idx },
							renderInline(block.text, "md" + idx));
					case "list":
						return react.createElement(block.ordered ? "ol" : "ul", { key: "md" + idx },
							block.items.map((item, j) => react.createElement("li", { key: j },
								renderInline(item, "md" + idx + "i" + j))));
					case "p":
					default:
						return react.createElement("p", { key: "md" + idx },
							renderInline(block.text, "md" + idx));
				}
			});
		}

		// Content cap: ~178% of the original 180 chars (target band 150-200%).
		const PREVIEW_CHAR_CAP = 320;

		// The sessions service arrives through the apply-time ctx (declared in
		// the inject list); the component reads it through this factory-level
		// reference because the bundle has no dynamic-runner globals.
		let activeSessions = null;

		function ReplyNav(props) {
			const useSessions = props.useSessions;
			const [snapshot, setSnapshot] = react.useState(undefined);
			const [hovered, setHovered] = react.useState(null);
			const [previewPos, setPreviewPos] = react.useState(null);
			const [right, setRight] = react.useState(8);
			const [active, setActive] = react.useState(null);

			const current = typeof useSessions === "function"
				? useSessions(s => s.current)
				: undefined;

			react.useEffect(() => {
				if (current === undefined) { setSnapshot(undefined); return; }
				const binding = activeSessions.binding(current);
				const session = binding === undefined ? undefined : binding.session;
				if (session === undefined) return;
				let alive = true;
				setSnapshot(session.getSnapshot());
				const dispose = session.subscribe(() => {
					if (alive) setSnapshot(session.getSnapshot());
				});
				return () => { alive = false; dispose(); };
			}, [current]);

			// One bar per user message (round); the preview aggregates every
			// assistant step's explicit text in the round and renders it as
			// markdown. Tool calls never split the bar. Click jumps to the user
			// message position (round start).
			const bars = react.useMemo(() => {
				if (snapshot === undefined) return [];
				const chat = snapshot.chat;
				const order = chat === undefined ? undefined : chat.order;
				const nodes = chat === undefined ? undefined : chat.nodes;
				if (!Array.isArray(order) || nodes === undefined) return [];
				const result = [];
				let round = null;
				const closeRound = () => {
					if (round === null) return;
					const text = round.parts.join("\n\n");
					let preview;
					if (text === "") {
						preview = round.running
							? "（回复中…）"
							: "（无文本内容）";
					} else {
						const clipped = text.length > PREVIEW_CHAR_CAP
							? text.slice(0, PREVIEW_CHAR_CAP) + "…"
							: text;
						preview = renderMarkdown(clipped);
					}
					result.push({
						key: round.key,
						preview: preview,
						interrupted: round.interrupted,
					});
					round = null;
				};
				for (const key of order) {
					const node = nodes.get(key);
					if (node === undefined) continue;
					if (node.kind === "user" || node.kind === "steering") {
						closeRound();
						round = { key: key, parts: [], running: false, interrupted: false };
						continue;
					}
					if (round === null || node.kind !== "assistant-step") continue;
					const data = node.data;
					const blocks = data === undefined ? undefined : data.blocks;
					const text = replyTextOf(blocks);
					if (text !== "") round.parts.push(text);
					const status = data === undefined ? undefined : data.status;
					if (status === "running") round.running = true;
					if (status === "interrupted") round.interrupted = true;
				}
				closeRound();
				return result;
			}, [snapshot]);

			// Keep the active bar in range as bars change.
			const barsRef = react.useRef(bars);
			barsRef.current = bars;
			react.useEffect(() => {
				if (active === null || active >= bars.length) {
					setActive(bars.length === 0 ? null : bars.length - 1);
				}
			}, [bars.length]);

			react.useEffect(() => {
				if (bars.length === 0) return;
				const measure = () => {
					const scrollport = document.querySelector("[data-conversation-scroll]");
					if (scrollport === null) return;
					const rect = scrollport.getBoundingClientRect();
					setRight(Math.max(6, window.innerWidth - rect.right + 8));
				};
				measure();
				const scrollport = document.querySelector("[data-conversation-scroll]");
				if (scrollport === null || typeof ResizeObserver === "undefined") return;
				const observer = new ResizeObserver(measure);
				observer.observe(scrollport);
				window.addEventListener("resize", measure);
				return () => {
					observer.disconnect();
					window.removeEventListener("resize", measure);
				};
			}, [bars.length]);

			// Track the round currently in view: the first user-message row whose
			// box intersects the scrollport viewport becomes the active bar.
			react.useEffect(() => {
				if (bars.length === 0) return;
				const scrollport = document.querySelector("[data-conversation-scroll]");
				if (scrollport === null) return;
				let raf = null;
				const update = () => {
					raf = null;
					const list = barsRef.current;
					if (list.length === 0) return;
					const viewport = scrollport.getBoundingClientRect();
					let found = -1;
					for (let i = 0; i < list.length; i++) {
						const row = document.querySelector("[data-chat-anchor-key=\"" + list[i].key + "\"]");
						if (row === null) continue;
						const rect = row.getBoundingClientRect();
						if (rect.bottom >= viewport.top && rect.top <= viewport.bottom) {
							found = i;
							break;
						}
					}
					if (found === -1) {
						// No bar row is visible: fall back to the last bar (bottom).
						setActive(list.length - 1);
					} else {
						setActive(found);
					}
				};
				const onScroll = () => { if (raf === null) raf = requestAnimationFrame(update); };
				scrollport.addEventListener("scroll", onScroll, { passive: true });
				update();
				return () => {
					scrollport.removeEventListener("scroll", onScroll);
					if (raf !== null) cancelAnimationFrame(raf);
				};
			}, [bars.length]);

			if (bars.length === 0) return null;

			const scrollTo = (key) => {
				if (typeof document === "undefined") return;
				const scrollport = document.querySelector("[data-conversation-scroll]");
				const row = document.querySelector("[data-chat-anchor-key=\"" + key + "\"]");
				if (scrollport === null || row === null) return;
				const top = row.getBoundingClientRect().top - scrollport.getBoundingClientRect().top;
				scrollport.scrollTop += top;
			};

			const showPreview = (index, event) => {
				const rect = event.currentTarget.getBoundingClientRect();
				setHovered(index);
				setPreviewPos({
					top: rect.top + rect.height / 2,
					right: Math.max(6, window.innerWidth - rect.left + 12),
				});
			};

			const hoveredBar = hovered === null ? null : bars[hovered];

			return react.createElement("div", { className: "dsh-rnav-root" },
				react.createElement("div", {
					className: "dsh-rnav-rail",
					style: { right: right + "px" },
				},
					react.createElement("div", { className: "dsh-rnav-rail-bg" }),
					react.createElement("div", { className: "dsh-rnav-rail-content" },
						bars.map((bar, index) => react.createElement("div", {
							key: bar.key,
							className: "dsh-rnav-barwrap",
							onMouseEnter: (event) => showPreview(index, event),
							onMouseLeave: () => { setHovered(null); setPreviewPos(null); },
							onClick: () => {
								setActive(index);
								scrollTo(bar.key);
							},
						},
							react.createElement("div", {
								className: "dsh-rnav-bar",
								"data-active": index === active ? "" : undefined,
							}),
						)),
					),
				),
				hoveredBar !== null && previewPos !== null
					? react.createElement("div", {
						className: "dsh-rnav-preview",
						style: {
							top: previewPos.top + "px",
							right: previewPos.right + "px",
							transform: "translateY(-50%)",
						},
					},
						react.createElement("div", { className: "dsh-rnav-preview-bg" }),
						react.createElement("div", { className: "dsh-rnav-preview-content" },
							react.createElement("div", { className: "dsh-rnav-preview-label" },
								"对话 " + (hovered + 1) + "/" + bars.length + (hoveredBar.interrupted ? " · 已中断" : "")),
							react.createElement("div", { className: "dsh-rnav-md" },
								typeof hoveredBar.preview === "string"
									? react.createElement("span", null, hoveredBar.preview)
									: hoveredBar.preview),
						),
					)
					: null,
			);
		}

		/** Required services (cordis fiber inject): the slot registry and the session runtime. */
		const inject = ["slots", "sessions"];

		/**
		 * Client plugin body: register the reply-nav rail into the frame-wide
		 * shell.overlay seat through slots.inject() because the layout entry
		 * may activate later or replace its declaration.
		 * @param ctx - client root context.
		 */
		function apply(ctx) {
			activeSessions = ctx.sessions;
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "reply-nav",
			}, (props) => react.createElement(ReplyNav, props)));
		}
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
