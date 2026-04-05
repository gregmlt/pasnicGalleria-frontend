"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const STATUS_COLORS = {
  "À Vendre":  { bg: "bg-emerald-500", text: "text-emerald-600", light: "bg-emerald-100", hex: "#10b981" },
  "A garder":  { bg: "bg-blue-500",    text: "text-blue-600",    light: "bg-blue-100",    hex: "#3b82f6" },
  "A jeter":   { bg: "bg-red-500",     text: "text-red-600",     light: "bg-red-100",     hex: "#ef4444" },
  "Trop beau": { bg: "bg-purple-500",  text: "text-purple-600",  light: "bg-purple-100",  hex: "#a855f7" },
};
const FALLBACK_COLOR = { bg: "bg-slate-400", text: "text-slate-500", light: "bg-slate-100", hex: "#94a3b8" };

// --- Donut Chart SVG ---
function DonutChart({ data, total }) {
  const SIZE = 200;
  const RADIUS = 75;
  const STROKE = 22;
  const CENTER = SIZE / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  let offset = 0;
  const segments = data.map((item) => {
    const portion = total > 0 ? item.count / total : 0;
    const dash = portion * CIRCUMFERENCE;
    const seg = { ...item, dash, offset, portion };
    offset += dash;
    return seg;
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
          {/* Fond */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />
          {/* Segments */}
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={STATUS_COLORS[seg.statut]?.hex || FALLBACK_COLOR.hex}
              strokeWidth={STROKE}
              strokeDasharray={`${seg.dash} ${CIRCUMFERENCE}`}
              strokeDashoffset={-seg.offset}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        {/* Texte central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900">{total}</span>
          <span className="text-xs text-slate-400 mt-0.5">oeuvres</span>
        </div>
      </div>
    </div>
  );
}

// --- Carte stat ---
function StatCard({ label, value, sub, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-start gap-4">
      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 text-slate-500">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-900 truncate">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// --- Page principale ---
export default function Dashboard() {
  const router = useRouter();
  const token = useSelector((s) => s.users.token);
  const role = useSelector((s) => s.users.role);
  const [oeuvres, setOeuvres] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => token || (typeof window !== "undefined" ? localStorage.getItem("pg_token") : "");
  const getRole = () => role || (typeof window !== "undefined" ? localStorage.getItem("pg_role") : "");

  useEffect(() => {
    const t = getToken();
    const r = getRole();
    if (!t) { router.push("/"); return; }
    // Dashboard réservé aux admins et superadmins
    if (r && !["admin", "superadmin"].includes(r)) { router.push("/search"); return; }
    fetch(`${BACKEND_URL}/articles/get/all`, {
      headers: { Authorization: `Bearer ${t}` },
    })
      .then((r) => r.json())
      .then((data) => { if (data.result) setOeuvres(data.oeuvres); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  // --- Calculs ---
  const totalOeuvres = oeuvres.length;

  const totalValeur = oeuvres.reduce((sum, o) => {
    const p = parseFloat(o.prix?.toString().replace(/[^\d.]/g, ""));
    return sum + (isNaN(p) ? 0 : p);
  }, 0);

  const artistesUniques = new Set(
    oeuvres.map((o) => o.artiste?.nom).filter(Boolean)
  ).size;

  // Répartition par statut
  const statutMap = {};
  oeuvres.forEach((o) => {
    const s = o.statut || "Non défini";
    statutMap[s] = (statutMap[s] || 0) + 1;
  });
  const statutData = Object.entries(statutMap)
    .map(([statut, count]) => ({ statut, count }))
    .sort((a, b) => b.count - a.count);

  // Artistes les + représentés
  const artisteMap = {};
  oeuvres.forEach((o) => {
    const nom = o.artiste?.nom;
    if (nom) artisteMap[nom] = (artisteMap[nom] || 0) + 1;
  });
  const topArtistes = Object.entries(artisteMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const formatPrice = (n) =>
    n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Titre */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-slate-400 text-sm mt-1">Vue d'ensemble de la collection</p>
        </div>

        {/* Cartes stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Oeuvres"
            value={totalOeuvres}
            sub={`${artistesUniques} artiste${artistesUniques > 1 ? "s" : ""}`}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.83.83a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd"/>
              </svg>
            }
          />
          <StatCard
            label="Valeur totale"
            value={formatPrice(totalValeur)}
            sub={totalOeuvres > 0 ? `moy. ${formatPrice(totalValeur / totalOeuvres)} / oeuvre` : "—"}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z"/>
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clipRule="evenodd"/>
              </svg>
            }
          />
          <StatCard
            label="Artistes"
            value={artistesUniques}
            sub={`dans la collection`}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd"/>
              </svg>
            }
          />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Donut — répartition par statut */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-6">Répartition par statut</h2>
            {totalOeuvres === 0 ? (
              <p className="text-slate-400 text-sm text-center py-10">Aucune donnée</p>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <DonutChart data={statutData} total={totalOeuvres} />
                {/* Légende */}
                <div className="flex-1 space-y-3 w-full">
                  {statutData.map((item) => {
                    const colors = STATUS_COLORS[item.statut] || FALLBACK_COLOR;
                    const pct = Math.round((item.count / totalOeuvres) * 100);
                    return (
                      <div key={item.statut}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${colors.bg}`} />
                            <span className="text-sm text-slate-600">{item.statut}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-semibold text-slate-800">{item.count}</span>
                            <span className="text-slate-400">{pct}%</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${colors.bg}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Top artistes */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-6">Top artistes</h2>
            {topArtistes.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-10">Aucune donnée</p>
            ) : (
              <div className="space-y-4">
                {topArtistes.map(([nom, count], i) => {
                  const max = topArtistes[0][1];
                  const pct = Math.round((count / max) * 100);
                  return (
                    <div key={nom}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-bold text-slate-300 w-4">#{i + 1}</span>
                          <span className="text-sm text-slate-700 capitalize">{nom}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-800">
                          {count} oeuvre{count > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
