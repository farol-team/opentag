"""Render the runner's real tray UI (runner/apps/desktop/ui/index.html) outside
Tauri: the only thing stubbed is window.__TAURI__, so the markup, the CSS and
the DOM code in the screenshot are the ones that ship."""
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE.parents[2] / "runner/apps/desktop/ui/index.html"
OUT = HERE / "tray-stub.html"

STUB = """<script>
  // Stands in for Tauri's IPC so the page can be photographed in a browser.
  const STATUS = {
    connected: true, logged_in: true, workspace_id: "Acme Corp",
    agents: ["claude", "codex"], version: "0.4.2", root: "/Users/anna/OpenTag",
  };
  const AGENTS = [
    { name: "claude", label: "Claude Code", resolved: "/opt/homebrew/bin/claude-agent-acp" },
    { name: "codex", label: "Codex", resolved: "/opt/homebrew/bin/codex-acp" },
    { name: "opencode", label: "OpenCode", resolved: null },
    { name: "cursor", label: "Cursor Agent", resolved: null },
  ];
  window.__TAURI__ = {
    core: { invoke: async (cmd) => (cmd === "get_status" ? STATUS : cmd === "list_agents" ? AGENTS : null) },
    event: { listen: () => {} },
  };
</script>
"""

html = SRC.read_text()
marker = "<script>\n  const { invoke }"
assert marker in html, "the tray UI no longer starts its script the way this expects"
OUT.write_text(html.replace(marker, STUB + marker, 1))
print("wrote", OUT)
