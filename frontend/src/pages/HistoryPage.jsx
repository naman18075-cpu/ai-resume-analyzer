import { Search } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { EmptyState } from "../components/common/EmptyState";
import { SkeletonCard } from "../components/common/SkeletonCard";
import { HistoryTable } from "../components/dashboard/HistoryTable";
import { ScoreRing } from "../components/dashboard/ScoreRing";
import { Button } from "../components/ui/Button";
import { getAnalysis, listAnalyses } from "../services/analysis";

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const load = async () => {
      try {
        const history = await listAnalyses();
        setItems(history);
        if (history[0]) {
          setSelectedId(history[0].id);
          setDetailLoading(true);
          const detail = await getAnalysis(history[0].id);
          setSelectedAnalysis(detail);
        }
      } catch (error) {
        toast.error("Could not load analysis history.");
      } finally {
        setDetailLoading(false);
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredItems = useMemo(() => {
    const query = deferredSearch.toLowerCase().trim();
    if (!query) {
      return items;
    }
    return items.filter((item) =>
      [item.target_role, item.company_name, item.resume_name, item.job_description_title]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [deferredSearch, items]);

  useEffect(() => {
    if (!filteredItems.length) {
      return;
    }
    if (!filteredItems.some((item) => item.id === selectedId)) {
      handleSelect(filteredItems[0].id);
    }
  }, [filteredItems, selectedId]);

  const handleSelect = async (id) => {
    setSelectedId(id);
    setDetailLoading(true);
    try {
      const detail = await getAnalysis(id);
      setSelectedAnalysis(detail);
    } catch (error) {
      toast.error("Could not load the selected analysis.");
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6">
        <SkeletonCard className="h-16 rounded-3xl" />
        <SkeletonCard className="h-[520px] rounded-3xl" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        title="No analysis history yet."
        description="Once you run a resume analysis, your ATS history and keyword gaps will appear here."
        action={
          <Link to="/app/analyze">
            <Button>Create Analysis</Button>
          </Link>
        }
      />
    );
  }

  if (!filteredItems.length) {
    return (
      <EmptyState
        title="No matching analyses found."
        description="Try a different role, company, or resume search term."
        action={
          <Button variant="secondary" onClick={() => setSearch("")}>
            Clear Search
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-6">
      <div className="panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by role, company, resume..."
            className="h-12 w-full rounded-full border border-slate-200 bg-white/80 pl-11 pr-4 text-sm dark:border-slate-700 dark:bg-slate-900/70"
          />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {filteredItems.length} analyses available
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <HistoryTable items={filteredItems} selectedId={selectedId} onSelect={handleSelect} />

        {detailLoading || !selectedAnalysis ? (
          <SkeletonCard className="h-[560px] rounded-3xl" />
        ) : (
          <div className="grid gap-6">
            <ScoreRing score={selectedAnalysis.ats_score} />
            <div className="panel p-6">
              <h3 className="text-2xl font-semibold">{selectedAnalysis.target_role}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{selectedAnalysis.company_name || "Independent target role"}</p>
              <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {selectedAnalysis.executive_summary}
              </p>
            </div>
            <div className="panel p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Recommendations
              </p>
              <div className="mt-4 space-y-3">
                {selectedAnalysis.improvement_suggestions.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200/70 p-4 text-sm dark:border-slate-800">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
