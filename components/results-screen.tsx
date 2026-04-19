import { motion } from "framer-motion";
import { type TestStats, type WpmSnapshot } from "../hooks/use-typing-test";
import { RotateCcw, ArrowRight, Download, Info } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { useMemo } from "react";

interface ResultsScreenProps {
  stats: TestStats;
  onRestart: () => void;
  mode: string;
  amount: number;
}

export function ResultsScreen({ stats, onRestart, mode, amount }: ResultsScreenProps) {
  // Compute consistency from wpmHistory
  const consistency = useMemo(() => {
    if (!stats.wpmHistory || stats.wpmHistory.length === 0) return 100;
    const wpms = stats.wpmHistory.map(h => h.wpm);
    const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
    if (mean === 0) return 100;
    const variance = wpms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpms.length;
    const stdev = Math.sqrt(variance);
    const cv = (stdev / mean) * 100;
    return Math.max(0, Math.round(100 - cv));
  }, [stats.wpmHistory]);

  const maxVal = Math.max(...(stats.wpmHistory?.map((d) => d.raw) || [10]), 10);
  
  // time representation
  const timeS = stats.wpmHistory && stats.wpmHistory.length > 0 
    ? stats.wpmHistory[stats.wpmHistory.length - 1].second 
    : (mode === "time" ? amount : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col w-full max-w-5xl md:mx-auto gap-8 transition-colors duration-500"
    >
      <div className="flex flex-col md:flex-row md:items-start gap-10">
        
        {/* Left Side: Main Stats */}
        <div className="flex flex-col w-full md:w-40 shrink-0 gap-6">
          <StatBig label="wpm" value={stats.wpm} delay={0.1} />
          <StatBig label="acc" value={`${stats.accuracy}%`} delay={0.2} />
          <div className="mt-2 flex flex-col gap-1 text-xs text-sub tracking-wide uppercase font-semibold">
            <span className="opacity-50 tracking-widest text-[10px]">test type</span>
            <span className="text-accent normal-case tracking-normal">{mode} {amount}</span>
            <span className="opacity-50 normal-case tracking-normal">english</span>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-[240px] md:flex-1 relative">
          {stats.wpmHistory && stats.wpmHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.wpmHistory} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-sub)" strokeOpacity={0.2} />
                <XAxis 
                  dataKey="second" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 11, fill: "var(--color-sub)" }} 
                  interval="preserveStartEnd" 
                  minTickGap={20}
                />
                <YAxis 
                  domain={[0, Math.ceil(maxVal * 1.2)]} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 11, fill: "var(--color-sub)" }}
                  width={30}
                />
                <Tooltip
                  cursor={{ stroke: "var(--color-accent)", strokeOpacity: 0.2, strokeWidth: 1 }}
                  contentStyle={{ backgroundColor: "var(--color-background)", border: "1px solid var(--color-sub)", borderRadius: "8px" }}
                  itemStyle={{ color: "var(--color-foreground)" }}
                  labelStyle={{ color: "var(--color-sub)", marginBottom: "4px" }}
                />
                <Line
                  name="Raw"
                  dataKey="raw"
                  type="monotone"
                  stroke="var(--color-sub)"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  name="WPM"
                  dataKey="wpm"
                  type="monotone"
                  stroke="var(--color-accent)"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "var(--color-background)", stroke: "var(--color-accent)", strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: "var(--color-accent)", strokeWidth: 0 }}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-sub">no chart data</div>
          )}
        </div>
      </div>

      {/* Bottom Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 border-t border-sub/30 pt-6">
        <StatBox label="raw" value={stats.rawWpm} delay={0.3} />
        <StatBox label="characters" value={`${stats.correctChars}/${stats.incorrectChars}/${stats.extraChars}/${stats.missedChars}`} delay={0.35} />
        <StatBox label="consistency" value={`${consistency}%`} delay={0.4} />
        <StatBox label="time" value={`${timeS}s`} delay={0.45} />
        <StatBox label="fixes" value={0} hint="backspaces on wrong chars" delay={0.5} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 pt-4">
        <ActionButton icon={<ArrowRight size={16} />} label="next test" onClick={onRestart} />
        <ActionButton icon={<RotateCcw size={16} />} label="restart" onClick={onRestart} />
        <ActionButton icon={<Download size={16} />} label="download" onClick={() => {}} />
        <ActionButton icon={<Info size={16} />} label="calculation formula" onClick={() => {}} />
      </div>

    </motion.div>
  );
}

function StatBig({ label, value, delay }: { label: string; value: string | number; delay: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-sub font-medium text-3xl tracking-wide">{label}</span>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, type: "spring" }}
        className="text-accent font-bold text-6xl leading-none"
      >
        {value}
      </motion.span>
    </div>
  );
}

function StatBox({ label, value, hint, delay }: { label: string; value: string | number; hint?: string; delay: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sub text-xs tracking-wider">{label}</span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay }}
        className="text-accent font-bold text-2xl leading-none"
      >
        {value}
      </motion.span>
      {hint && <span className="text-foreground text-[10px] mt-1">{hint}</span>}
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 text-sub hover:text-foreground transition-colors bg-transparent border-none focus:outline-none"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
