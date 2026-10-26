import { useEffect, useState } from "react";
import { request } from "../register/api";
import catalog from "../../shared/toolbox-catalog.json";

export default function ToolboxTalks({ sites, siteId: fixedSiteId, canUpload = false, worker = false }) {
  const [selected, setSelected] = useState(""), [page, setPage] = useState(1), [reload, setReload] = useState(0);
  const [record, setRecord] = useState(null), [pagination, setPagination] = useState(null), [error, setError] = useState("");
  const [title, setTitle] = useState(""), [file, setFile] = useState(null), [pending, setPending] = useState(false), [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const siteId = fixedSiteId || selected || sites[0]?.id || "";
  const site = sites.find((s) => s.id === siteId);
  useEffect(() => { setPage(1); setRecord(null); setMessage(""); }, [siteId]);
  useEffect(() => {
    const timer = setInterval(() => setReload((n) => n + 1), 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    if (!siteId) return;
    setError("");
    request(`/api/${worker ? "worker" : "admin"}/sites/${encodeURIComponent(siteId)}/toolbox-talks?page=${page}`, { signal: controller.signal })
      .then((r) => { setRecord(r.data); setPagination(r.pagination); })
      .catch((e) => { if (e.name !== "AbortError") { setError(e.message); setRecord(null); } });
    return () => controller.abort();
  }, [siteId, page, reload, worker]);
  async function upload(event) {
    event.preventDefault();
    if (pending || !file) return;
    setPending(true); setError(""); setMessage("");
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error("Choose a PDF no larger than 10 MB.");
      const encoded = await new Promise((done, reject) => {
        const reader = new FileReader();
        reader.onload = () => done(String(reader.result).split(",")[1]);
        reader.onerror = () => reject(new Error("Unable to read this file. Choose it again."));
        reader.readAsDataURL(file);
      });
      await request(`/api/admin/sites/${encodeURIComponent(siteId)}/toolbox-talks`, { method: "POST", body: { title, pdfBase64: encoded } });
      setMessage("Additional toolbox talk saved for this site and week.");
      setTitle(""); setFile(null); event.target.reset(); setPage(1); setReload((n) => n + 1);
    } catch (e) { setError(e.message); } finally { setPending(false); }
  }
  const talkList = (talks) => talks.length ? (
    <ul>{talks.map((talk) => <li key={talk.id} style={{ marginBottom: "0.8rem" }}>
      <strong>{talk.title}</strong> <span className="sr-muted">{talk.kind === "weekly" ? "Monday selection" : "Additional talk"} · Week of {talk.weekStart}</span>
      <p><a href={talk.downloadUrl} download>Download PDF: {talk.title}</a></p>
    </li>)}</ul>
  ) : <p>No talks recorded for this period.</p>;
  return (
    <section id="site-toolbox" aria-label="Toolbox talks">
      <h2>Toolbox Talks</h2>
      <p>Each active site gets a random talk every Monday (UK time). The choice stays fixed for the week. Review it against the work being carried out and your approved RAMS before delivery.</p>
      {!fixedSiteId && <label>Toolbox talk site<select value={siteId} disabled={pending} onChange={(e) => setSelected(e.target.value)}>
        {sites.map((s) => <option key={s.id} value={s.id}>{s.name}{s.status === "inactive" ? " (inactive)" : ""}</option>)}
      </select></label>}
      {!siteId && <p>No assigned sites are available.</p>}
      {siteId && <button className="sr-secondary" disabled={pending} onClick={() => setReload((n) => n + 1)}>Refresh toolbox talks</button>}
      {error && <p className="sr-error" role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      {record?.siteId === siteId && <>
        <section className="sr-card"><h3>This week · {record.weekStart}</h3>{talkList(record.talks)}<p className="sr-muted">Downloading a sheet does not record delivery or attendance. Complete its sign-off section and return the record to your manager.</p></section>
        <section className="sr-card"><h3>Site talk history</h3>{talkList(record.history)}
          {pagination?.totalPages > 1 && <div className="sr-actions">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous talks</button>
            <span>Page {page} of {pagination.totalPages}</span>
            <button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>Next talks</button>
          </div>}
        </section>
      </>}
      {canUpload && site?.status === "active" && <form className="sr-card" onSubmit={upload}>
        <h3>Upload an additional talk</h3>
        <p>Add a PDF for {site.name} for the current week. It will appear alongside the Monday selection and remain in this site’s history.</p>
        <label>Talk title<input required maxLength={160} value={title} disabled={pending} onChange={(e) => setTitle(e.target.value)} /></label>
        <label>Toolbox talk PDF (maximum 10 MB)<input type="file" accept="application/pdf,.pdf" required disabled={pending} onChange={(e) => setFile(e.target.files?.[0] || null)} /></label>
        <button disabled={pending || !siteId || !file}>{pending ? "Saving talk…" : "Add additional talk"}</button>
      </form>}
      {!worker && <details className="sr-card"><summary>Browse the 70 template PDFs</summary>
        <label>Find a toolbox template<input value={search} onChange={(e) => setSearch(e.target.value)} /></label>
        <ul>{catalog.filter((t) => t.title.toLowerCase().includes(search.toLowerCase())).map((t) => <li key={t.id}><a href={`/documents/toolbox-talks/${t.filename}`} download>{t.id}. {t.title} (PDF)</a></li>)}</ul>
      </details>}
    </section>
  );
}
