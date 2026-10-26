import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, Box, Check, CheckCircle2,
  ChevronDown, CircleHelp, Clock3, Cloud, Code2, Command, Cpu, Database,
  ExternalLink, GitBranch, Github, HardDrive, LayoutDashboard, LifeBuoy,
  LoaderCircle, Menu, MoreHorizontal, Plus, RefreshCw, Rocket, Search,
  Server, Settings2, ShieldCheck, Sparkles, Terminal, TrendingUp, X,
  Zap, AlertTriangle
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

const API = "/api";
const chartData = [
  { time: "09:00", requests: 22, latency: 105 },
  { time: "09:15", requests: 34, latency: 118 },
  { time: "09:30", requests: 29, latency: 99 },
  { time: "09:45", requests: 48, latency: 132 },
  { time: "10:00", requests: 41, latency: 112 },
  { time: "10:15", requests: 57, latency: 141 },
  { time: "10:30", requests: 44, latency: 116 },
  { time: "10:45", requests: 63, latency: 128 },
  { time: "11:00", requests: 52, latency: 108 },
  { time: "11:15", requests: 72, latency: 137 },
  { time: "11:30", requests: 61, latency: 120 },
  { time: "11:45", requests: 78, latency: 114 },
];

const initialServices = [
  { id: "frontend", name: "Web Frontend", description: "React application served by Nginx", tech: "React · Nginx", status: "healthy", uptime: "99.98%", region: "ap-south-1", icon: "web" },
  { id: "backend", name: "API Service", description: "Application REST API", tech: "Python · FastAPI", status: "healthy", uptime: "99.95%", region: "ap-south-1", icon: "api" },
  { id: "database", name: "Application Data", description: "Persistent application storage", tech: "SQLite · Volume", status: "healthy", uptime: "99.99%", region: "ap-south-1", icon: "db" },
];

const initialDeployments = [
  { id: "DEP-2048", service: "frontend", environment: "production", status: "success", version: "v1.4.2", time: "2 min ago", author: "github-actions" },
  { id: "DEP-2047", service: "backend", environment: "production", status: "success", version: "v1.4.1", time: "24 min ago", author: "github-actions" },
  { id: "DEP-2046", service: "full-stack", environment: "staging", status: "success", version: "v1.4.0", time: "1 hour ago", author: "viraj" },
  { id: "DEP-2045", service: "backend", environment: "production", status: "failed", version: "v1.3.9", time: "3 hours ago", author: "github-actions" },
  { id: "DEP-2044", service: "frontend", environment: "production", status: "success", version: "v1.3.8", time: "5 hours ago", author: "github-actions" },
];

function IconBox({ children, tone = "blue" }) {
  return <span className={`icon-box ${tone}`}>{children}</span>;
}
function Status({ value }) {
  const label = value === "healthy" ? "Healthy" : value === "success" ? "Successful" : value === "running" ? "In progress" : value === "failed" ? "Failed" : value;
  return <span className={`status status-${value}`}><span className="status-dot" />{label}</span>;
}
function timeLabel(date) {
  const diff = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hr ago`;
  return `${Math.floor(diff / 1440)} days ago`;
}

export default function App() {
  const [active, setActive] = useState("Overview");
  const [services, setServices] = useState(initialServices);
  const [deployments, setDeployments] = useState(initialDeployments);
  const [apiOnline, setApiOnline] = useState(false);
  const [apiMessage, setApiMessage] = useState("Connecting to API…");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [environment, setEnvironment] = useState("production");

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };

  async function refreshData() {
    try {
      const [healthRes, servicesRes, deployRes] = await Promise.all([
        fetch(`${API}/health`), fetch(`${API}/services`), fetch(`${API}/deployments`)
      ]);
      if (!healthRes.ok || !servicesRes.ok || !deployRes.ok) throw new Error("API returned an error");
      const health = await healthRes.json();
      const serviceData = await servicesRes.json();
      const deployData = await deployRes.json();
      setApiOnline(health.status === "healthy");
      setApiMessage("Connected to live API");
      setServices(serviceData.map((s) => ({
        ...s,
        description: s.id === "frontend" ? "React application served by Nginx" : s.id === "backend" ? "Application REST API" : "Persistent application storage",
        tech: s.technology,
        icon: s.id === "frontend" ? "web" : s.id === "backend" ? "api" : "db",
      })));
      setDeployments(deployData.map((d) => ({
        ...d, id: `DEP-${String(d.id).padStart(4, "0")}`, time: timeLabel(d.created_at), author: "dashboard"
      })));
    } catch {
      setApiOnline(false);
      setApiMessage("Demo preview · API not connected");
    }
  }

  useEffect(() => { refreshData(); }, []);

  const visibleDeployments = useMemo(() => deployments.filter((d) =>
    `${d.id} ${d.service} ${d.environment} ${d.status} ${d.version}`.toLowerCase().includes(search.toLowerCase())
  ), [deployments, search]);

  async function triggerDeployment(service) {
    if (busy) return;
    setBusy(true);
    const version = `v1.4.${Math.floor(Math.random() * 90) + 10}`;
    try {
      const response = await fetch(`${API}/deployments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, environment, status: "success", version })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Deployment event could not be saved");
      }
      const item = await response.json();
      setDeployments((old) => [{
        ...item, id: `DEP-${String(item.id).padStart(4, "0")}`, time: "Just now", author: "dashboard"
      }, ...old]);
      notify("Deployment event recorded successfully");
    } catch (error) {
      notify(apiOnline ? error.message : "API unavailable. Start Docker Compose to save deployment events.");
    } finally {
      setBusy(false);
    }
  }

  const navGroups = [
    { label: "WORKSPACE", items: [
      { name: "Overview", icon: LayoutDashboard },
      { name: "Deployments", icon: Rocket, badge: deployments.length },
      { name: "Services", icon: Box },
    ]},
    { label: "INFRASTRUCTURE", items: [
      { name: "Environments", icon: Cloud },
      { name: "Activity logs", icon: Terminal },
    ]},
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark"><Command size={20} strokeWidth={2.4} /></div>
          <div className="brand-name">cloud<span>deploy</span><small>CONTROL CENTER</small></div>
          <button className="icon-button sidebar-close" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <button className="workspace-switch">
          <span className="workspace-avatar">V</span>
          <span className="workspace-text"><strong>Viraj's workspace</strong><small>Free workspace</small></span>
          <ChevronDown size={15} className="muted-icon"/>
        </button>
        <div className="nav-scroll">
          {navGroups.map((group) => <div className="nav-group" key={group.label}>
            <p className="nav-label">{group.label}</p>
            {group.items.map(({ name, icon: Icon, badge }) => <button key={name}
              className={`nav-item ${active === name ? "nav-active" : ""}`}
              onClick={() => { setActive(name); setMobileNav(false); }}>
              <Icon size={17} strokeWidth={1.8}/><span>{name}</span>
              {badge && <span className="nav-badge">{badge}</span>}
            </button>)}
          </div>)}
          <div className="nav-group">
            <p className="nav-label">PREFERENCES</p>
            <button className={`nav-item ${active === "Settings" ? "nav-active" : ""}`} onClick={() => setActive("Settings")}><Settings2 size={17}/><span>Settings</span></button>
            <button className={`nav-item ${active === "Help & support" ? "nav-active" : ""}`} onClick={() => setActive("Help & support")}><LifeBuoy size={17}/><span>Help & support</span></button>
          </div>
        </div>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Sparkles size={17}/></div>
            <strong>Built for shipping.</strong>
            <p>Automate the boring stuff. Focus on what matters.</p>
            <button onClick={() => notify("Connect your GitHub Actions workflow to enable automated delivery.")}>Explore CI/CD <ArrowUpRight size={14}/></button>
          </div>
          <div className="profile-row">
            <div className="profile-avatar">VG</div>
            <div className="profile-text"><strong>Viraj Ghodvinde</strong><small>DevOps Engineer</small></div>
            <MoreHorizontal size={18} className="muted-icon"/>
          </div>
        </div>
      </aside>

      {mobileNav && <button className="nav-backdrop" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={20}/></button>
            <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{active}</strong></div>
          </div>
          <div className="topbar-actions">
            <div className="env-select"><span className="env-dot"/><select value={environment} onChange={(e) => setEnvironment(e.target.value)} aria-label="Environment"><option value="production">Production</option><option value="staging">Staging</option><option value="development">Development</option></select><ChevronDown size={13}/></div>
            <span className={`connection-pill ${apiOnline ? "connected" : ""}`} title={apiMessage}><span/>{apiOnline ? "API connected" : "Demo mode"}</span>
            <button className="icon-button notification-button" onClick={() => notify("You're all caught up. No new alerts.")} aria-label="Notifications"><Bell size={18}/><i/></button>
            <div className="top-avatar">VG</div>
          </div>
        </header>

        <div className="page-content">
          {active === "Overview" ? <>
            <div className="page-heading">
              <div><div className="eyebrow"><span className="eyebrow-line"/> MONDAY, OCTOBER 26, 2026</div><h1>Good morning, Viraj <span className="wave">✳</span></h1><p>Here's what's happening with your infrastructure today.</p></div>
              <div className="heading-actions">
                <button className="button button-secondary" onClick={() => { refreshData(); notify("Refreshing service data…"); }}><RefreshCw size={15}/> Refresh</button>
                <button className="button button-primary" onClick={() => triggerDeployment("full-stack")} disabled={busy}>{busy ? <LoaderCircle size={16} className="spin"/> : <Rocket size={16}/>} Deploy update</button>
              </div>
            </div>

            <div className="info-banner">
              <div className="banner-symbol"><ShieldCheck size={20}/></div>
              <div className="banner-copy"><strong>All systems operational</strong><span>{apiOnline ? "Your dashboard is connected to the live API." : "You're viewing the dashboard preview. Run Docker Compose to enable live API data and persistence."}</span></div>
              <span className="banner-status"><span/> {apiOnline ? "LIVE" : "PREVIEW"}</span>
              <button className="icon-button banner-close" onClick={(e) => e.currentTarget.parentElement.style.display = "none"} aria-label="Dismiss banner"><X size={16}/></button>
            </div>

            <section className="metric-grid">
              <MetricCard title="Service availability" value="99.98%" change="+0.04%" positive icon={<Activity size={18}/>} tone="blue" note="vs. last 30 days" />
              <MetricCard title="Active services" value={`${services.filter(s => s.status === "healthy").length} / ${services.length}`} change="All healthy" positive icon={<Server size={18}/>} tone="green" note="Across all environments" />
              <MetricCard title="Deployments" value={String(deployments.length + 2043)} change="+12.8%" positive icon={<Rocket size={18}/>} tone="violet" note="Total delivery events" />
              <MetricCard title="Failed deployments" value={String(deployments.filter(d => d.status === "failed").length)} change="This session" positive={deployments.every(d => d.status !== "failed")} icon={<AlertTriangle size={18}/>} tone="amber" note="Recorded failures" />
            </section>

            <section className="content-grid">
              <div className="panel traffic-panel">
                <div className="panel-header">
                  <div><h2>Application performance</h2><p>Request activity over the last 3 hours</p></div>
                  <button className="select-button" onClick={() => notify("Showing the last 3 hours of sample traffic.")}>Last 3 hours <ChevronDown size={14}/></button>
                </div>
                <div className="chart-summary"><div><span className="legend-dot blue-dot"/><span className="summary-label">Requests / min</span><strong>1,284</strong><em className="positive-text"><ArrowUpRight size={13}/> 8.2%</em></div><div><span className="legend-dot purple-dot"/><span className="summary-label">Avg. latency</span><strong>118 ms</strong><em className="positive-text"><ArrowDownRight size={13}/> 3.4%</em></div></div>
                <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                  <defs><linearGradient id="requestFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5688f7" stopOpacity={0.23}/><stop offset="95%" stopColor="#5688f7" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#e9edf4"/>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#8b95a7", fontSize: 11 }} interval={2}/>
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8b95a7", fontSize: 11 }}/>
                  <Tooltip contentStyle={{ border: "1px solid #e8edf5", borderRadius: 10, boxShadow: "0 8px 24px #15213b12", fontSize: 12 }} />
                  <Area type="monotone" dataKey="requests" stroke="#4f7ff0" strokeWidth={2.4} fill="url(#requestFill)" activeDot={{ r: 5, strokeWidth: 0 }}/>
                </AreaChart></ResponsiveContainer></div>
                <div className="chart-footer"><span><span className="live-pulse"/> Data refreshes when you click refresh</span><button onClick={() => setActive("Activity logs")}>View activity <ArrowUpRight size={14}/></button></div>
              </div>

              <div className="panel pipeline-panel">
                <div className="panel-header"><div><h2>Delivery pipeline</h2><p>Latest CI/CD execution</p></div><button className="icon-button" onClick={() => notify("Pipeline status refreshed.")} aria-label="Refresh pipeline"><RefreshCw size={16}/></button></div>
                <div className="pipeline-repo"><span className="repo-icon"><Github size={18}/></span><div><strong>clouddeploy-app</strong><span><GitBranch size={12}/> main · 8fd3a21</span></div><span className="pipeline-pass"><Check size={13}/> Passed</span></div>
                <div className="pipeline-steps">
                  {[["Source checkout","Completed","2s"],["Unit tests","Completed","8s"],["Docker build","Completed","24s"],["Push to registry","Completed","6s"]].map((step, i) => <div className="pipeline-step" key={step[0]}><div className="step-rail"><span className="step-check"><Check size={12}/></span>{i < 3 && <i/>}</div><div className="step-copy"><strong>{step[0]}</strong><span>{step[1]}</span></div><time>{step[2]}</time></div>)}
                </div>
                <div className="pipeline-total"><span><Clock3 size={14}/> Total duration</span><strong>40s</strong></div>
                <button className="button button-outline full-button" onClick={() => notify("Connect this card to your GitHub Actions run URL.")}>View workflow <ExternalLink size={14}/></button>
              </div>
            </section>

            <section className="panel services-panel">
              <div className="panel-header"><div><h2>Services</h2><p>Monitor the health of your application components</p></div><button className="text-button" onClick={() => setActive("Services")}>View all services <ArrowUpRight size={14}/></button></div>
              <div className="table-scroll"><table className="data-table"><thead><tr><th>SERVICE</th><th>STATUS</th><th>UPTIME (30D)</th><th>REGION</th><th>TECHNOLOGY</th><th/></tr></thead><tbody>
                {services.map((s) => <tr key={s.id}><td><div className="service-name"><IconBox tone={s.id === "frontend" ? "blue" : s.id === "backend" ? "violet" : "green"}>{s.id === "frontend" ? <Code2 size={17}/> : s.id === "backend" ? <Zap size={17}/> : <Database size={17}/>}</IconBox><span><strong>{s.name}</strong><small>{s.description}</small></span></div></td><td><Status value={s.status}/></td><td><strong className="uptime-value">{s.uptime}</strong></td><td><span className="region"><span className="region-dot"/>{s.region}</span></td><td><span className="tech-label">{s.tech}</span></td><td><button className="icon-button row-more" onClick={() => notify(`${s.name}: ${s.status}. ${s.description}.`)} aria-label={`Details for ${s.name}`}><MoreHorizontal size={18}/></button></td></tr>)}
              </tbody></table></div>
              <div className="panel-footer"><span>Showing <strong>{services.length}</strong> services</span><span className="healthy-summary"><CheckCircle2 size={14}/> No incidents detected</span></div>
            </section>

            <section className="panel deployments-panel">
              <div className="panel-header"><div><h2>Recent deployments</h2><p>Track releases across your environments</p></div><button className="text-button" onClick={() => setActive("Deployments")}>All deployments <ArrowUpRight size={14}/></button></div>
              <DeploymentTable items={deployments.slice(0, 4)} />
            </section>

            <footer className="page-footer"><span>© 2026 CloudDeploy · Built for reliable releases.</span><div><span className="footer-health"><span/> All systems normal</span><span>v1.4.2</span><button onClick={() => notify(apiMessage)}><CircleHelp size={14}/> Help</button></div></footer>
          </> : <SecondaryPage active={active} services={services} deployments={visibleDeployments} search={search} setSearch={setSearch} triggerDeployment={triggerDeployment} busy={busy} environment={environment} notify={notify} refreshData={refreshData} />}
        </div>
      </main>
      {toast && <div className="toast"><CheckCircle2 size={18}/><span>{toast}</span><button onClick={() => setToast("")} aria-label="Dismiss"><X size={15}/></button></div>}
    </div>
  );
}

function MetricCard({ title, value, change, positive, icon, tone, note }) {
  return <div className="metric-card"><div className="metric-top"><span>{title}</span><IconBox tone={tone}>{icon}</IconBox></div><div className="metric-value">{value}</div><div className="metric-bottom"><span className={`metric-change ${positive ? "positive-text" : "negative-text"}`}>{positive ? <TrendingUp size={13}/> : <ArrowDownRight size={13}/>} {change}</span><span>{note}</span></div></div>;
}

function DeploymentTable({ items }) {
  if (!items.length) return <div className="empty-state"><Rocket size={25}/><strong>No deployments found</strong><span>Deployment events will appear here.</span></div>;
  return <div className="table-scroll"><table className="data-table deployment-table"><thead><tr><th>DEPLOYMENT</th><th>SERVICE</th><th>ENVIRONMENT</th><th>VERSION</th><th>STATUS</th><th>TRIGGERED BY</th><th>TIME</th></tr></thead><tbody>{items.map((d, i) => <tr key={`${d.id}-${i}`}><td><span className="deployment-id">{d.id}</span></td><td><span className="service-cell">{d.service}</span></td><td><span className={`environment-tag ${d.environment}`}>{d.environment}</span></td><td><code className="version-code">{d.version}</code></td><td><Status value={d.status}/></td><td><span className="trigger-user"><span>{(d.author || "GH").slice(0, 2).toUpperCase()}</span>{d.author || "github-actions"}</span></td><td><span className="time-cell">{d.time || "—"}</span></td></tr>)}</tbody></table></div>;
}

function SecondaryPage({ active, services, deployments, search, setSearch, triggerDeployment, busy, environment, notify, refreshData }) {
  if (active === "Deployments") return <><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> DELIVERY CENTER</div><h1>Deployments</h1><p>Every release, tracked in one place.</p></div><button className="button button-primary" onClick={() => triggerDeployment("full-stack")} disabled={busy}><Rocket size={16}/> Deploy update</button></div><div className="panel list-panel"><div className="panel-header"><div><h2>Deployment history</h2><p>Search and review recent release events</p></div><div className="search-box"><Search size={15}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search deployments…"/></div></div><DeploymentTable items={deployments}/></div></>;
  if (active === "Services") return <><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> INFRASTRUCTURE</div><h1>Services</h1><p>Health and availability across your application.</p></div><button className="button button-secondary" onClick={refreshData}><RefreshCw size={15}/> Refresh status</button></div><div className="service-card-grid">{services.map(s => <div className="panel service-detail" key={s.id}><div className="service-detail-top"><IconBox tone={s.id === "frontend" ? "blue" : s.id === "backend" ? "violet" : "green"}>{s.id === "frontend" ? <Code2/> : s.id === "backend" ? <Zap/> : <Database/>}</IconBox><Status value={s.status}/></div><h2>{s.name}</h2><p>{s.description}</p><div className="detail-stat"><span>30-day uptime</span><strong>{s.uptime}</strong></div><div className="detail-stat"><span>Region</span><strong>{s.region}</strong></div><div className="detail-stat"><span>Technology</span><strong>{s.tech}</strong></div><button className="button button-outline full-button" onClick={() => notify(`${s.name} is ${s.status}.`)}>View service details <ArrowUpRight size={14}/></button></div>)}</div></>;
  if (active === "Environments") return <><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> DEPLOYMENT TARGETS</div><h1>Environments</h1><p>Keep development, staging, and production organized.</p></div></div><div className="environment-grid">{[["production","Production","Live workloads","ap-south-1","green"],["staging","Staging","Pre-release validation","ap-south-1","violet"],["development","Development","Active development","local","blue"]].map(e => <div className="panel env-card" key={e[0]}><div className={`env-card-icon ${e[4]}`}><Cloud size={21}/></div><div className="env-card-head"><span className={`environment-tag ${e[0]}`}>{e[0]}</span><span className="env-card-dot"/></div><h2>{e[1]}</h2><p>{e[2]}</p><div className="detail-stat"><span>Region / target</span><strong>{e[3]}</strong></div><div className="detail-stat"><span>Services</span><strong>{services.length} configured</strong></div><button className="button button-outline full-button" onClick={() => notify(`${e[1]} is a demo environment. Configure Terraform workspaces or separate state for real isolation.`)}>Environment details <ArrowUpRight size={14}/></button></div>)}</div><div className="info-banner env-note"><div className="banner-symbol"><ShieldCheck size={20}/></div><div className="banner-copy"><strong>Infrastructure as Code</strong><span>For real environment isolation, use separate Terraform state and restrict production permissions. The cards above are illustrative.</span></div></div></>;
  if (active === "Activity logs") return <><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> AUDIT TRAIL</div><h1>Activity logs</h1><p>Review recent deployment activity.</p></div><button className="button button-secondary" onClick={refreshData}><RefreshCw size={15}/> Refresh</button></div><div className="panel list-panel"><div className="panel-header"><div><h2>Recent events</h2><p>Latest activity in your workspace</p></div></div><div className="activity-list">{deployments.map((d, i) => <div className="activity-item" key={`${d.id}-${i}`}><div className={`activity-icon ${d.status}`}><Rocket size={16}/></div><div className="activity-copy"><strong>{d.service} deployment {d.status === "failed" ? "failed" : "completed"}</strong><span>{d.id} · {d.environment} · {d.version}</span></div><time>{d.time}</time><Status value={d.status}/></div>)}</div></div></>;
  if (active === "Settings") return <><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> WORKSPACE</div><h1>Settings</h1><p>Application configuration and connection details.</p></div></div><div className="settings-grid"><div className="panel settings-card"><h2>Application</h2><p>CloudDeploy demo configuration</p>{[["Application name","CloudDeploy"],["Frontend","React + Nginx"],["Backend","FastAPI"],["Database","SQLite persistent volume"],["Selected environment",environment]].map(x => <div className="detail-stat" key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong></div>)}</div><div className="panel settings-card"><h2>API connection</h2><p>Frontend proxies API requests through Nginx.</p><div className="detail-stat"><span>API base path</span><code>/api</code></div><div className="detail-stat"><span>Health endpoint</span><code>/api/health</code></div><div className="detail-stat"><span>Connection</span><Status value="healthy"/></div><button className="button button-outline full-button" onClick={refreshData}><RefreshCw size={15}/> Test connection</button></div></div></>;
  return <><div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> SUPPORT</div><h1>Help & support</h1><p>Useful links for your CloudDeploy project.</p></div></div><div className="help-grid"><HelpCard icon={<Terminal/>} title="Run locally" text="Start both application tiers with Docker Compose." action="docker compose up --build -d" onClick={() => notify("Run: docker compose up --build -d")}/><HelpCard icon={<GitBranch/>} title="CI/CD pipeline" text="Push to main to trigger the GitHub Actions workflow." action="git push origin main" onClick={() => notify("Review .github/workflows/ci-cd.yml before pushing.")}/><HelpCard icon={<Cloud/>} title="Infrastructure" text="Provision the EC2 instance using Terraform." action="terraform apply" onClick={() => notify("Run Terraform from the terraform/ directory after reviewing variables.")}/></div></>;
}
function HelpCard({icon,title,text,action,onClick}) { return <div className="panel help-card"><IconBox>{icon}</IconBox><h2>{title}</h2><p>{text}</p><button className="help-action" onClick={onClick}><code>{action}</code><ArrowUpRight size={14}/></button></div>; }
