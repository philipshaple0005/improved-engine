import React, { useState, useMemo } from "react";
import {
  Home,
  ClipboardList,
  Package,
  Boxes,
  Shelf,
  Lightbulb,
  RefreshCw,
  Settings,
  Store,
  Search,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  AlertTriangle,
  Clock3,
  Zap,
  Activity,
  Wifi,
  Power,
  Unlock,
  SlidersHorizontal,
  Eye,
  QrCode,
  Keyboard,
  Link2,
  Layers,
  Grid3X3,
  LayoutGrid,
  BarChart3,
  WifiOff,
  Thermometer,
  Settings2,
  Copy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
  Minus,
  Plus,
  X,
  ScanLine,
  PackageX,
  HandMetal,
  Timer,
  TrendingUp,
  Users,
  ShoppingBag,
  Filter,
  Download,
  Upload,
  Edit3,
  Trash2,
  EyeOff,
  Bell,
} from "lucide-react";

// ==================== 共享组件 ====================

function NeumorphicCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-[28px] border border-white/80 bg-white/72 shadow-[10px_14px_34px_rgba(35,45,65,0.10),inset_0_1px_0_rgba(255,255,255,0.96)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function PillButton({ children, active = false, danger = false, size = "md" }) {
  const base = size === "sm" ? "h-10 rounded-xl border px-4 text-xs font-medium transition-all" : "h-12 rounded-2xl border px-5 text-sm font-medium transition-all";
  const style = active
    ? "border-emerald-100 bg-emerald-50 text-emerald-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_18px_rgba(20,160,120,0.12)]"
    : danger
    ? "border-red-100 bg-red-50 text-red-600 shadow-[0_8px_18px_rgba(220,60,60,0.08)]"
    : "border-slate-200/80 bg-white/70 text-slate-600 shadow-[0_8px_18px_rgba(35,45,65,0.08)] hover:bg-white";
  return <button className={`${base} ${style}`}>{children}</button>;
}

function IconButton({ icon: Icon, size = 20, className = "" }) {
  return (
    <button className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-slate-200/80 bg-white/70 shadow-[0_6px_14px_rgba(35,45,65,0.08)] transition-all hover:bg-white hover:shadow-[0_8px_18px_rgba(35,45,65,0.12)] ${className}`}>
      <Icon size={size} className="text-slate-600" />
    </button>
  );
}

const menuItems = [
  { icon: Home, label: "首页总览" },
  { icon: ClipboardList, label: "订单管理" },
  { icon: Package, label: "商品管理" },
  { icon: Boxes, label: "库存管理" },
  { icon: Shelf, label: "智能外卖架", active: true },
  { icon: Lightbulb, label: "灯控中心" },
  { icon: RefreshCw, label: "平台同步" },
  { icon: Settings, label: "系统设置" },
];

const statusMap = {
  empty: {
    label: "空闲",
    dot: "bg-slate-300",
    card: "bg-white/70 border-slate-200 text-slate-500",
    text: "text-slate-400",
    bg: "bg-slate-50",
  },
  occupied: {
    label: "已占用",
    dot: "bg-emerald-500",
    card: "bg-emerald-50/80 border-emerald-200 text-emerald-700",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  pickup: {
    label: "取货中",
    dot: "bg-blue-500",
    card: "bg-blue-50/80 border-blue-200 text-blue-700",
    text: "text-blue-600",
    bg: "bg-blue-50",
  },
  timeout: {
    label: "超时未取",
    dot: "bg-orange-500",
    card: "bg-orange-50/80 border-orange-200 text-orange-700",
    text: "text-orange-600",
    bg: "bg-orange-50",
  },
  error: {
    label: "异常",
    dot: "bg-red-500",
    card: "bg-red-50/80 border-red-200 text-red-600",
    text: "text-red-500",
    bg: "bg-red-50",
  },
  maintenance: {
    label: "维护",
    dot: "bg-violet-500",
    card: "bg-violet-50/80 border-violet-200 text-violet-600",
    text: "text-violet-500",
    bg: "bg-violet-50",
  },
};

// ==================== 页面1：智能外卖架 - 格口看板 ====================

const shelfData = [
  {
    shelf: "A货架",
    online: true,
    slots: [
      { code: "A-01", status: "empty" },
      { code: "A-02", status: "empty" },
      { code: "A-03", status: "occupied", order: "#12000", platform: "饿了么", remain: "12:00", customer: "张**" },
      { code: "A-04", status: "pickup", order: "#12003", platform: "美团", remain: "09:12", customer: "李**" },
      { code: "A-05", status: "empty" },
      { code: "A-06", status: "occupied", order: "#12004", platform: "美团", remain: "15:30", customer: "王**" },
      { code: "A-07", status: "timeout", order: "#12001", platform: "美团", remain: "02:00", customer: "赵**" },
      { code: "A-08", status: "empty" },
    ],
  },
  {
    shelf: "B货架",
    online: true,
    slots: [
      { code: "B-01", status: "empty" },
      { code: "B-02", status: "occupied", order: "#12010", platform: "饿了么", remain: "08:12", customer: "钱**" },
      { code: "B-03", status: "pickup", order: "#12031", platform: "美团", remain: "09:41", customer: "孙**" },
      { code: "B-04", status: "empty" },
      { code: "B-05", status: "occupied", order: "#12012", platform: "饿了么", remain: "22:45", customer: "周**" },
      { code: "B-06", status: "timeout", order: "#12005", platform: "美团", remain: "01:20", customer: "吴**" },
      { code: "B-07", status: "timeout", order: "#12007", platform: "饿了么", remain: "00:17", customer: "郑**" },
      { code: "B-08", status: "empty" },
    ],
  },
  {
    shelf: "C货架",
    online: false,
    slots: [
      { code: "C-01", status: "error" },
      { code: "C-02", status: "empty" },
      { code: "C-03", status: "maintenance" },
      { code: "C-04", status: "maintenance" },
      { code: "C-05", status: "empty" },
      { code: "C-06", status: "occupied", order: "#12020", platform: "美团", remain: "18:30", customer: "冯**" },
      { code: "C-07", status: "timeout", order: "#12028", platform: "美团", remain: "02:08", customer: "陈**" },
      { code: "C-08", status: "empty" },
    ],
  },
  {
    shelf: "D货架",
    online: true,
    slots: [
      { code: "D-01", status: "empty" },
      { code: "D-02", status: "occupied", remain: "15:21", platform: "饿了么", customer: "褚**" },
      { code: "D-03", status: "empty" },
      { code: "D-04", status: "empty" },
      { code: "D-05", status: "pickup", remain: "10:05", platform: "美团", customer: "卫**" },
      { code: "D-06", status: "empty" },
      { code: "D-07", status: "timeout", remain: "00:59", platform: "饿了么", customer: "蒋**" },
      { code: "D-08", status: "empty" },
    ],
  },
];

function SlotCardKanban({ slot, selected, onClick }) {
  const config = statusMap[slot.status];
  const isSelected = selected || slot.selected;
  return (
    <button
      onClick={() => onClick(slot)}
      className={`relative flex h-[86px] min-w-[88px] flex-col items-center justify-center rounded-2xl border px-2 text-center text-sm transition-all ${config.card} ${
        isSelected ? "scale-[1.02] shadow-[0_0_0_4px_rgba(124,92,255,0.12),0_16px_30px_rgba(124,92,255,0.25)] ring-2 ring-violet-400" : "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_18px_rgba(35,45,65,0.06)]"
      }`}
    >
      {slot.status === "pickup" && (
        <span className="absolute right-2 top-2 h-2.5 w-2.5 animate-pulse rounded-full bg-violet-500 shadow-[0_0_18px_rgba(124,92,255,0.9)]" />
      )}
      {slot.status === "timeout" && (
        <span className="absolute left-2 top-2">
          <Timer size={14} className="text-orange-500" />
        </span>
      )}
      <span className="text-base font-semibold">{slot.code}</span>
      <span className={`mt-1 text-xs font-semibold ${config.text}`}>{config.label}</span>
      {slot.remain && <span className="mt-0.5 text-[11px] text-slate-500">剩 {slot.remain}</span>}
      {slot.platform && <span className="text-[11px] text-slate-400">{slot.platform}</span>}
    </button>
  );
}

function ShelfKanban() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid | list | chart
  const [filterPlatform, setFilterPlatform] = useState("全部");
  const [filterStatus, setFilterStatus] = useState("全部");
  const [selectedShelf, setSelectedShelf] = useState("全部");

  const handleSlotClick = (slot) => {
    setSelectedSlot(selectedSlot?.code === slot.code ? null : slot);
  };

  const slotCounts = useMemo(() => {
    const flat = shelfData.flatMap((row) => row.slots);
    return {
      total: flat.length,
      empty: flat.filter((s) => s.status === "empty").length,
      occupied: flat.filter((s) => s.status === "occupied").length,
      pickup: flat.filter((s) => s.status === "pickup").length,
      timeout: flat.filter((s) => s.status === "timeout").length,
      error: flat.filter((s) => s.status === "error").length,
      maintenance: flat.filter((s) => s.status === "maintenance").length,
    };
  }, []);

  const shelfStats = useMemo(() => {
    return shelfData.map((shelf) => {
      const slots = shelf.slots;
      return {
        name: shelf.shelf,
        online: shelf.online,
        total: slots.length,
        empty: slots.filter((s) => s.status === "empty").length,
        occupied: slots.filter((s) => s.status === "occupied").length,
        pickup: slots.filter((s) => s.status === "pickup").length,
        timeout: slots.filter((s) => s.status === "timeout").length,
        utilization: Math.round(((slots.filter((s) => s.status !== "empty").length) / slots.length) * 100),
      };
    });
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#eef0f0] p-6 text-slate-800">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.95),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(216,226,255,0.55),transparent_25%),linear-gradient(135deg,rgba(255,255,255,0.35),rgba(220,225,230,0.28))]" />

      <div className="relative mx-auto flex max-w-[1920px] gap-4">
        {/* 左侧导航 */}
        <aside className="w-[280px] shrink-0 rounded-[34px] border border-white/80 bg-white/58 p-4 shadow-[14px_22px_48px_rgba(45,55,72,0.16),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-2xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-[0_14px_24px_rgba(15,23,42,0.22)]">
              <Activity size={24} />
            </div>
            <button className="grid h-10 w-10 place-items-center rounded-2xl border border-white bg-white/70 shadow-[0_8px_18px_rgba(30,40,60,0.10)]">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <p className="mb-3 pl-3 text-sm font-medium text-slate-400">主菜单</p>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`flex h-12 w-full items-center gap-3 rounded-2xl px-4 text-[15px] font-medium transition-all ${
                    item.active
                      ? "bg-white text-violet-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_14px_24px_rgba(60,70,90,0.12)]"
                      : "text-slate-600 hover:bg-white/60"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-28 space-y-3">
            <NeumorphicCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-inner">
                  <Store size={22} className="text-slate-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">美味小屋便利店</p>
                  <p className="text-sm text-slate-400">切换门店⌄</p>
                </div>
              </div>
            </NeumorphicCard>
            <NeumorphicCard className="p-4">
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-500" /> 系统状态</p>
                <p className="font-semibold text-emerald-600">运行正常</p>
              </div>
            </NeumorphicCard>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 rounded-[34px] border border-white/85 bg-white/62 p-8 shadow-[14px_22px_54px_rgba(45,55,72,0.14),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-2xl">
          <header className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">即时零售运营中台 〉 <span className="text-slate-900">智能外卖架</span></p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">格口看板</h1>
              <p className="mt-1 text-slate-500">实时监控所有货架格口状态</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-[280px] items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-4 shadow-[0_10px_22px_rgba(30,40,60,0.08)]">
                <Search size={19} className="text-slate-400" />
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="搜索格口 / 订单号 / 取货人" />
              </div>
              <PillButton>全部货架 <ChevronDown className="ml-2 inline" size={15} /></PillButton>
              <PillButton active>只看待取</PillButton>
              <IconButton icon={Bell} />
            </div>
          </header>

          {/* 统计卡片 */}
          <section className="mb-5 grid grid-cols-6 gap-4">
            <NeumorphicCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 text-slate-600 shadow-lg">
                  <Layers size={22} strokeWidth={2.1} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">格口总数</p>
                  <p className="text-2xl font-semibold text-slate-900">{slotCounts.total}</p>
                </div>
              </div>
            </NeumorphicCard>
            <NeumorphicCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600 shadow-lg">
                  <Package size={22} strokeWidth={2.1} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">已占用</p>
                  <p className="text-2xl font-semibold text-emerald-600">{slotCounts.occupied}</p>
                </div>
              </div>
            </NeumorphicCard>
            <NeumorphicCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-sky-50 text-blue-600 shadow-lg">
                  <HandMetal size={22} strokeWidth={2.1} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">待取货</p>
                  <p className="text-2xl font-semibold text-blue-600">{slotCounts.pickup}</p>
                </div>
              </div>
            </NeumorphicCard>
            <NeumorphicCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 text-orange-600 shadow-lg">
                  <Timer size={22} strokeWidth={2.1} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">超时未取</p>
                  <p className="text-2xl font-semibold text-orange-600">{slotCounts.timeout}</p>
                </div>
              </div>
            </NeumorphicCard>
            <NeumorphicCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 text-slate-500 shadow-lg">
                  <CheckCircle2 size={22} strokeWidth={2.1} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">空闲</p>
                  <p className="text-2xl font-semibold text-slate-600">{slotCounts.empty}</p>
                </div>
              </div>
            </NeumorphicCard>
            <NeumorphicCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-red-100 to-orange-50 text-red-600 shadow-lg">
                  <AlertTriangle size={22} strokeWidth={2.1} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">异常/维护</p>
                  <p className="text-2xl font-semibold text-red-600">{slotCounts.error + slotCounts.maintenance}</p>
                </div>
              </div>
            </NeumorphicCard>
          </section>

          {/* 视图切换 & 货架概览 */}
          <section className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-all ${
                  viewMode === "grid" ? "bg-white shadow-[0_6px_14px_rgba(35,45,65,0.10)]" : "text-slate-500 hover:bg-white/60"
                }`}
              >
                <Grid3X3 size={18} /> 网格视图
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-all ${
                  viewMode === "list" ? "bg-white shadow-[0_6px_14px_rgba(35,45,65,0.10)]" : "text-slate-500 hover:bg-white/60"
                }`}
              >
                <LayoutGrid size={18} /> 列表视图
              </button>
              <button
                onClick={() => setViewMode("chart")}
                className={`flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-all ${
                  viewMode === "chart" ? "bg-white shadow-[0_6px_14px_rgba(35,45,65,0.10)]" : "text-slate-500 hover:bg-white/60"
                }`}
              >
                <BarChart3 size={18} /> 统计视图
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">货架状态：</span>
              {shelfStats.map((shelf) => (
                <div key={shelf.name} className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${shelf.online ? "bg-emerald-500" : "bg-red-500"}`} />
                  <span className="text-sm font-medium text-slate-700">{shelf.name}</span>
                  <span className="text-sm text-slate-400">{shelf.utilization}%</span>
                </div>
              ))}
            </div>
          </section>

          {/* 主内容 */}
          <div className="grid grid-cols-[1fr_340px] gap-4">
            <NeumorphicCard className="p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">货架格口矩阵</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">图例：</span>
                  {Object.entries({ empty: "空闲", occupied: "已占用", pickup: "待取", timeout: "超时", error: "异常", maintenance: "维护" }).map(([key, label]) => (
                    <span key={key} className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className={`h-2 w-2 rounded-full ${statusMap[key].dot}`} /> {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {shelfData.map((row) => (
                  <div key={row.shelf} className="grid grid-cols-[90px_1fr] gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="pt-3">
                      <p className="text-lg font-semibold text-slate-800">{row.shelf}</p>
                      <p className={`mt-2 flex items-center gap-2 text-sm ${row.online ? "text-emerald-600" : "text-red-500"}`}>
                        <span className={`h-2 w-2 rounded-full ${row.online ? "bg-emerald-500" : "bg-red-500"}`} />
                        {row.online ? "在线" : "离线"}
                      </p>
                      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                          style={{ width: `${(row.slots.filter((s) => s.status !== "empty").length / row.slots.length) * 100}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        {row.slots.filter((s) => s.status !== "empty").length}/{row.slots.length} 已用
                      </p>
                    </div>
                    <div className="grid grid-cols-8 gap-2.5">
                      {row.slots.map((slot) => (
                        <SlotCardKanban key={slot.code} slot={slot} selected={selectedSlot?.code === slot.code} onClick={handleSlotClick} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </NeumorphicCard>

            {/* 右侧详情/待取列表 */}
            <div className="space-y-4">
              <NeumorphicCard className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">待取订单</h3>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">{slotCounts.pickup} 单</span>
                </div>
                <div className="space-y-3">
                  {shelfData.flatMap((row) => row.slots).filter((s) => s.status === "pickup").map((slot) => (
                    <div key={slot.code} className="flex items-center justify-between rounded-2xl bg-blue-50/60 p-3">
                      <div>
                        <p className="font-semibold text-slate-800">{slot.code}</p>
                        <p className="text-sm text-slate-500">{slot.customer} · {slot.platform}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">{slot.remain}</p>
                        <p className="text-xs text-slate-400">剩余时间</p>
                      </div>
                    </div>
                  ))}
                </div>
              </NeumorphicCard>

              <NeumorphicCard className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">超时提醒</h3>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">{slotCounts.timeout} 单</span>
                </div>
                <div className="space-y-3">
                  {shelfData.flatMap((row) => row.slots).filter((s) => s.status === "timeout").map((slot) => (
                    <div key={slot.code} className="flex items-center justify-between rounded-2xl bg-orange-50/60 p-3">
                      <div>
                        <p className="font-semibold text-slate-800">{slot.code}</p>
                        <p className="text-sm text-slate-500">{slot.customer}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer size={16} className="text-orange-500" />
                        <span className="font-semibold text-orange-600">{slot.remain}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-3 w-full rounded-xl border border-orange-200 bg-orange-50 py-2 text-sm font-semibold text-orange-600">
                  一键催单
                </button>
              </NeumorphicCard>

              {selectedSlot && (
                <NeumorphicCard className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">格口详情</h3>
                    <button onClick={() => setSelectedSlot(null)} className="text-slate-400 hover:text-slate-600">
                      <X size={18} />
                    </button>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">格口号</span>
                      <span className="font-semibold text-slate-800">{selectedSlot.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">状态</span>
                      <span className={`font-semibold ${statusMap[selectedSlot.status].text}`}>
                        {statusMap[selectedSlot.status].label}
                      </span>
                    </div>
                    {selectedSlot.order && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">订单号</span>
                        <span className="font-medium text-slate-700">{selectedSlot.order}</span>
                      </div>
                    )}
                    {selectedSlot.platform && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">平台</span>
                        <span className="font-medium text-slate-700">{selectedSlot.platform}</span>
                      </div>
                    )}
                    {selectedSlot.customer && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">取货人</span>
                        <span className="font-medium text-slate-700">{selectedSlot.customer}</span>
                      </div>
                    )}
                    {selectedSlot.remain && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">剩余时间</span>
                        <span className="font-semibold text-emerald-600">{selectedSlot.remain}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 text-sm font-semibold text-blue-600">
                      <Lightbulb size={16} /> 亮灯
                    </button>
                    <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600">
                      <Eye size={16} /> 详情
                    </button>
                  </div>
                </NeumorphicCard>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ==================== 页面2：订单绑定格口 ====================

const pendingOrders = [
  { id: "DD202405120001", platform: "美团外卖", items: "汉堡套餐 x1", customer: "张明", phone: "138****1234", time: "12:30", shelf: null, slot: null, status: "待绑定" },
  { id: "DD202405120002", platform: "饿了么", items: "奶茶大杯 x2", customer: "李华", phone: "139****5678", time: "12:35", shelf: null, slot: null, status: "待绑定" },
  { id: "DD202405120003", platform: "美团外卖", items: "炒饭+饮料", customer: "王芳", phone: "137****9012", time: "12:40", shelf: null, slot: null, status: "待绑定" },
  { id: "DD202405120004", platform: "饿了么", items: "披萨套餐", customer: "赵伟", phone: "136****3456", time: "12:45", shelf: null, slot: null, status: "待绑定" },
  { id: "DD202405120005", platform: "美团外卖", items: "炸鸡+可乐", customer: "钱琳", phone: "135****7890", time: "12:50", shelf: null, slot: null, status: "待绑定" },
];

const boundOrders = [
  { id: "DD202405120006", platform: "美团外卖", items: "麻辣烫 x1", customer: "孙鹏", phone: "134****1111", time: "12:10", shelf: "A货架", slot: "A-03", status: "待取货" },
  { id: "DD202405120007", platform: "饿了么", items: "饺子 x2", customer: "周婷", phone: "133****2222", time: "12:15", shelf: "B货架", slot: "B-02", status: "待取货" },
  { id: "DD202405120008", platform: "美团外卖", items: "烧烤套餐", customer: "吴昊", phone: "132****3333", time: "12:20", shelf: "A货架", slot: "A-06", status: "取货中" },
];

function OrderBinding() {
  const [activeTab, setActiveTab] = useState("bind"); // bind | scan | manual
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [scanResult, setScanResult] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [orders, setOrders] = useState(pendingOrders);
  const [boundOrdersState, setBoundOrdersState] = useState(boundOrders);

  const availableSlots = useMemo(() => {
    return shelfData
      .filter((shelf) => shelf.online)
      .flatMap((shelf) => shelf.slots.filter((slot) => slot.status === "empty"))
      .map((slot) => ({ ...slot, shelfName: slot.code[0] + "货架" }));
  }, []);

  const handleBind = () => {
    if (selectedOrder && selectedSlot) {
      const newOrder = { ...selectedOrder, shelf: selectedSlot.shelfName, slot: selectedSlot.code, status: "待取货" };
      setBoundOrdersState([newOrder, ...boundOrdersState]);
      setOrders(orders.filter((o) => o.id !== selectedOrder.id));
      setSelectedOrder(null);
      setSelectedSlot(null);
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult("DD202405120001");
    }, 2000);
  };

  const handleQuickBind = (order, slot) => {
    const newOrder = { ...order, shelf: slot.shelfName, slot: slot.code, status: "待取货" };
    setBoundOrdersState([newOrder, ...boundOrdersState]);
    setOrders(orders.filter((o) => o.id !== order.id));
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#eef0f0] p-6 text-slate-800">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.95),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(216,226,255,0.55),transparent_25%),linear-gradient(135deg,rgba(255,255,255,0.35),rgba(220,225,230,0.28))]" />

      <div className="relative mx-auto flex max-w-[1920px] gap-4">
        {/* 左侧导航 */}
        <aside className="w-[280px] shrink-0 rounded-[34px] border border-white/80 bg-white/58 p-4 shadow-[14px_22px_48px_rgba(45,55,72,0.16),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-2xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-[0_14px_24px_rgba(15,23,42,0.22)]">
              <Activity size={24} />
            </div>
            <button className="grid h-10 w-10 place-items-center rounded-2xl border border-white bg-white/70 shadow-[0_8px_18px_rgba(30,40,60,0.10)]">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <p className="mb-3 pl-3 text-sm font-medium text-slate-400">主菜单</p>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`flex h-12 w-full items-center gap-3 rounded-2xl px-4 text-[15px] font-medium transition-all ${
                    item.label === "订单绑定格口"
                      ? "bg-white text-violet-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_14px_24px_rgba(60,70,90,0.12)]"
                      : "text-slate-600 hover:bg-white/60"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-28 space-y-3">
            <NeumorphicCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-inner">
                  <Store size={22} className="text-slate-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">美味小屋便利店</p>
                  <p className="text-sm text-slate-400">切换门店⌄</p>
                </div>
              </div>
            </NeumorphicCard>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 rounded-[34px] border border-white/85 bg-white/62 p-8 shadow-[14px_22px_54px_rgba(45,55,72,0.14),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-2xl">
          <header className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">即时零售运营中台 〉 <span className="text-slate-900">订单绑定格口</span></p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">订单绑定格口</h1>
              <p className="mt-1 text-slate-500">扫码或手动将订单分配到空闲格口</p>
            </div>
            <div className="flex items-center gap-3">
              <PillButton>今日已绑定 128 单</PillButton>
              <IconButton icon={Download} />
              <IconButton icon={Upload} />
            </div>
          </header>

          {/* 模式切换 */}
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => setActiveTab("bind")}
              className={`flex h-12 items-center gap-2 rounded-2xl border px-6 text-sm font-medium transition-all ${
                activeTab === "bind" ? "border-violet-200 bg-violet-50 text-violet-700 shadow-[0_8px_18px_rgba(124,92,255,0.12)]" : "border-slate-200/80 bg-white/70 text-slate-600 shadow-[0_8px_18px_rgba(35,45,65,0.08)]"
              }`}
            >
              <Link2 size={18} /> 快速绑定
            </button>
            <button
              onClick={() => setActiveTab("scan")}
              className={`flex h-12 items-center gap-2 rounded-2xl border px-6 text-sm font-medium transition-all ${
                activeTab === "scan" ? "border-violet-200 bg-violet-50 text-violet-700 shadow-[0_8px_18px_rgba(124,92,255,0.12)]" : "border-slate-200/80 bg-white/70 text-slate-600 shadow-[0_8px_18px_rgba(35,45,65,0.08)]"
              }`}
            >
              <QrCode size={18} /> 扫码绑定
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={`flex h-12 items-center gap-2 rounded-2xl border px-6 text-sm font-medium transition-all ${
                activeTab === "manual" ? "border-violet-200 bg-violet-50 text-violet-700 shadow-[0_8px_18px_rgba(124,92,255,0.12)]" : "border-slate-200/80 bg-white/70 text-slate-600 shadow-[0_8px_18px_rgba(35,45,65,0.08)]"
              }`}
            >
              <Keyboard size={18} /> 手动输入
            </button>
          </div>

          {activeTab === "bind" && (
            <div className="grid grid-cols-[1fr_1fr_340px] gap-4">
              {/* 待绑定订单 */}
              <NeumorphicCard className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">待绑定订单</h3>
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-600">{orders.length} 单</span>
                </div>
                <div className="space-y-2">
                  {orders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                      className={`w-full rounded-2xl p-4 text-left transition-all ${
                        selectedOrder?.id === order.id
                          ? "border-2 border-violet-400 bg-violet-50/80 shadow-[0_0_0_4px_rgba(124,92,255,0.12),0_8px_18px_rgba(124,92,255,0.15)]"
                          : "border border-slate-200 bg-white/60 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{order.id}</span>
                        <span className="text-xs text-slate-400">{order.time}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <span>{order.platform}</span>
                        <span>·</span>
                        <span>{order.customer}</span>
                        <span>·</span>
                        <span>{order.items}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </NeumorphicCard>

              {/* 空闲格口 */}
              <NeumorphicCard className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">空闲格口</h3>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">{availableSlots.length} 个</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.code}
                      onClick={() => setSelectedSlot(selectedSlot?.code === slot.code ? null : slot)}
                      className={`flex h-14 flex-col items-center justify-center rounded-xl border text-sm transition-all ${
                        selectedSlot?.code === slot.code
                          ? "border-emerald-400 bg-emerald-50 shadow-[0_0_0_4px_rgba(16,185,129,0.15),0_6px_14px_rgba(16,185,129,0.12)]"
                          : "border-slate-200 bg-white/60 hover:bg-white"
                      }`}
                    >
                      <span className="font-semibold text-slate-800">{slot.code}</span>
                      <span className="text-xs text-slate-400">{slot.shelfName}</span>
                    </button>
                  ))}
                </div>
              </NeumorphicCard>

              {/* 绑定确认 */}
              <NeumorphicCard className="flex flex-col p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">绑定确认</h3>
                <div className="flex-1 space-y-4">
                  <div className="rounded-2xl bg-slate-50/80 p-4">
                    <p className="mb-2 text-sm text-slate-400">已选订单</p>
                    {selectedOrder ? (
                      <div>
                        <p className="font-semibold text-slate-800">{selectedOrder.id}</p>
                        <p className="text-sm text-slate-500">{selectedOrder.customer} · {selectedOrder.platform}</p>
                      </div>
                    ) : (
                      <p className="text-slate-400">请选择订单</p>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <Link2 size={24} className="text-violet-500" />
                  </div>
                  <div className="rounded-2xl bg-slate-50/80 p-4">
                    <p className="mb-2 text-sm text-slate-400">分配格口</p>
                    {selectedSlot ? (
                      <div>
                        <p className="font-semibold text-slate-800">{selectedSlot.code}</p>
                        <p className="text-sm text-slate-500">{selectedSlot.shelfName}</p>
                      </div>
                    ) : (
                      <p className="text-slate-400">请选择格口</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleBind}
                  disabled={!selectedOrder || !selectedSlot}
                  className={`mt-4 flex h-12 items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all ${
                    selectedOrder && selectedSlot
                      ? "border border-violet-200 bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-[0_10px_22px_rgba(124,92,255,0.25)] hover:shadow-[0_14px_28px_rgba(124,92,255,0.30)]"
                      : "border border-slate-200 bg-slate-100 text-slate-400"
                  }`}
                >
                  <CheckCircle2 size={18} /> 确认绑定
                </button>
              </NeumorphicCard>
            </div>
          )}

          {activeTab === "scan" && (
            <div className="grid grid-cols-2 gap-4">
              <NeumorphicCard className="flex flex-col items-center justify-center p-8">
                <div className={`relative mb-6 grid h-64 w-64 place-items-center rounded-3xl ${isScanning ? "bg-gradient-to-br from-violet-100 to-purple-50" : "bg-slate-100"}`}>
                  {isScanning ? (
                    <>
                      <ScanLine className="animate-bounce text-violet-500" size={48} />
                      <p className="absolute bottom-4 text-sm text-violet-600">扫描中...</p>
                    </>
                  ) : scanResult ? (
                    <div className="text-center">
                      <CheckCircle2 className="mx-auto mb-2 text-emerald-500" size={48} />
                      <p className="font-semibold text-slate-800">{scanResult}</p>
                      <p className="text-sm text-slate-500">订单已识别</p>
                    </div>
                  ) : (
                    <QrCode className="text-slate-400" size={64} />
                  )}
                </div>
                <button
                  onClick={handleScan}
                  disabled={isScanning}
                  className="flex h-14 items-center gap-3 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-500 to-purple-500 px-8 text-white shadow-[0_10px_22px_rgba(124,92,255,0.25)] transition-all hover:shadow-[0_14px_28px_rgba(124,92,255,0.30)]"
                >
                  <ScanLine size={22} /> {isScanning ? "扫描中..." : "开始扫码"}
                </button>
                <p className="mt-4 text-sm text-slate-400">将订单二维码对准扫描窗口</p>
              </NeumorphicCard>

              <NeumorphicCard className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">空闲格口</h3>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">{availableSlots.length} 个</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.code}
                      className="flex h-14 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white/60 text-sm transition-all hover:bg-white"
                    >
                      <span className="font-semibold text-slate-800">{slot.code}</span>
                      <span className="text-xs text-slate-400">{slot.shelfName}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl bg-violet-50/80 p-4">
                  <h4 className="mb-2 font-semibold text-slate-800">扫码结果</h4>
                  {scanResult ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">订单号</span>
                        <span className="font-medium text-slate-700">{scanResult}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">平台</span>
                        <span className="font-medium text-slate-700">美团外卖</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">商品</span>
                        <span className="font-medium text-slate-700">汉堡套餐 x1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">顾客</span>
                        <span className="font-medium text-slate-700">张明</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">扫码后将显示订单详情</p>
                  )}
                </div>
              </NeumorphicCard>
            </div>
          )}

          {activeTab === "manual" && (
            <div className="grid grid-cols-[400px_1fr] gap-4">
              <NeumorphicCard className="p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">手动输入绑定</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">订单号</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="输入订单号"
                        className="h-12 flex-1 rounded-xl border border-slate-200 bg-white/70 px-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:border-violet-300"
                      />
                      <IconButton icon={Search} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">选择格口</label>
                    <div className="grid grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
                        <button key={slot.code} className="flex h-12 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white/60 text-sm transition-all hover:bg-white">
                          <span className="font-semibold text-slate-800">{slot.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="w-full h-12 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold shadow-[0_10px_22px_rgba(124,92,255,0.25)]">
                    确认绑定
                  </button>
                </div>
              </NeumorphicCard>

              <NeumorphicCard className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">待绑定订单列表</h3>
                  <div className="flex items-center gap-2">
                    <PillButton size="sm">全部 {orders.length}</PillButton>
                    <PillButton size="sm">美团 {orders.filter(o => o.platform === "美团外卖").length}</PillButton>
                    <PillButton size="sm">饿了么 {orders.filter(o => o.platform === "饿了么").length}</PillButton>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead className="text-slate-400">
                    <tr className="border-b border-slate-100">
                      <th className="py-3 font-medium">订单号</th>
                      <th className="font-medium">平台</th>
                      <th className="font-medium">顾客</th>
                      <th className="font-medium">商品</th>
                      <th className="font-medium">时间</th>
                      <th className="font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 font-medium text-slate-700">{order.id}</td>
                        <td>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${order.platform === "美团外卖" ? "bg-yellow-50 text-yellow-700" : "bg-blue-50 text-blue-600"}`}>
                            {order.platform}
                          </span>
                        </td>
                        <td>{order.customer}</td>
                        <td className="text-slate-500">{order.items}</td>
                        <td className="text-slate-400">{order.time}</td>
                        <td>
                          <button className="font-semibold text-violet-600">快速绑定</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </NeumorphicCard>
            </div>
          )}

          {/* 已绑定订单 */}
          <section className="mt-6">
            <NeumorphicCard className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">已绑定订单</h3>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">{boundOrdersState.length} 单</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {boundOrdersState.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/60 p-4">
                    <div>
                      <p className="font-semibold text-slate-800">{order.id}</p>
                      <p className="text-sm text-slate-500">{order.customer} · {order.platform}</p>
                    </div>
                    <div className="text-right">
                      <p className="rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-600">{order.slot}</p>
                      <p className="mt-1 text-xs text-slate-400">{order.shelf}</p>
                    </div>
                  </div>
                ))}
              </div>
            </NeumorphicCard>
          </section>
        </main>
      </div>
    </div>
  );
}

// ==================== 页面3：亮灯模块管理 ====================

const moduleList = [
  { code: "M-A01", shelf: "A货架", channels: 12, status: "在线", lights: 8, temp: "36.5℃", fw: "v1.2.3", heartbeat: "09:41:23", brightness: 85, mode: "常亮" },
  { code: "M-A02", shelf: "A货架", channels: 12, status: "在线", lights: 7, temp: "35.9℃", fw: "v1.2.3", heartbeat: "09:41:19", brightness: 80, mode: "常亮" },
  { code: "M-B01", shelf: "B货架", channels: 12, status: "在线", lights: 11, temp: "37.2℃", fw: "v1.2.4", heartbeat: "09:41:21", brightness: 90, mode: "闪烁" },
  { code: "M-B02", shelf: "B货架", channels: 12, status: "在线", lights: 6, temp: "36.8℃", fw: "v1.2.4", heartbeat: "09:41:18", brightness: 75, mode: "常亮" },
  { code: "M-C01", shelf: "C货架", channels: 8, status: "离线", lights: 0, temp: "--", fw: "v1.2.1", heartbeat: "09:34:02", brightness: 0, mode: "--" },
  { code: "M-D01", shelf: "D货架", channels: 12, status: "在线", lights: 4, temp: "35.5℃", fw: "v1.2.3", heartbeat: "09:41:25", brightness: 70, mode: "常亮" },
  { code: "M-D02", shelf: "D货架", channels: 12, status: "维护", lights: 0, temp: "34.2℃", fw: "v1.2.3", heartbeat: "09:40:00", brightness: 0, mode: "--" },
  { code: "M-E01", shelf: "E货架", channels: 16, status: "在线", lights: 12, temp: "38.1℃", fw: "v1.2.5", heartbeat: "09:41:30", brightness: 95, mode: "闪烁" },
];

const groups = [
  { id: 1, name: "A区组", modules: ["M-A01", "M-A02"], color: "emerald", slots: ["A-01", "A-02", "A-03", "A-04", "A-05", "A-06", "A-07", "A-08"] },
  { id: 2, name: "B区组", modules: ["M-B01", "M-B02"], color: "blue", slots: ["B-01", "B-02", "B-03", "B-04", "B-05", "B-06", "B-07", "B-08"] },
  { id: 3, name: "C区组", modules: ["M-C01"], color: "orange", slots: ["C-01", "C-02", "C-03", "C-04", "C-05", "C-06", "C-07", "C-08"] },
  { id: 4, name: "D区组", modules: ["M-D01", "M-D02"], color: "violet", slots: ["D-01", "D-02", "D-03", "D-04", "D-05", "D-06", "D-07", "D-08"] },
];

function LightModuleManagement() {
  const [activeTab, setActiveTab] = useState("list"); // list | config | group | batch
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [filterStatus, setFilterStatus] = useState("全部");
  const [brightness, setBrightness] = useState(80);
  const [selectedModules, setSelectedModules] = useState([]);

  const handleModuleSelect = (code) => {
    setSelectedModules((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleBatchOperation = (operation) => {
    console.log(`Batch operation: ${operation} on modules:`, selectedModules);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#eef0f0] p-6 text-slate-800">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.95),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(216,226,255,0.55),transparent_25%),linear-gradient(135deg,rgba(255,255,255,0.35),rgba(220,225,230,0.28))]" />

      <div className="relative mx-auto flex max-w-[1920px] gap-4">
        {/* 左侧导航 */}
        <aside className="w-[280px] shrink-0 rounded-[34px] border border-white/80 bg-white/58 p-4 shadow-[14px_22px_48px_rgba(45,55,72,0.16),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-2xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-[0_14px_24px_rgba(15,23,42,0.22)]">
              <Activity size={24} />
            </div>
            <button className="grid h-10 w-10 place-items-center rounded-2xl border border-white bg-white/70 shadow-[0_8px_18px_rgba(30,40,60,0.10)]">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <p className="mb-3 pl-3 text-sm font-medium text-slate-400">主菜单</p>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`flex h-12 w-full items-center gap-3 rounded-2xl px-4 text-[15px] font-medium transition-all ${
                    item.label === "亮灯模块管理"
                      ? "bg-white text-violet-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_14px_24px_rgba(60,70,90,0.12)]"
                      : "text-slate-600 hover:bg-white/60"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-28 space-y-3">
            <NeumorphicCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-inner">
                  <Store size={22} className="text-slate-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">美味小屋便利店</p>
                  <p className="text-sm text-slate-400">切换门店⌄</p>
                </div>
              </div>
            </NeumorphicCard>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 rounded-[34px] border border-white/85 bg-white/62 p-8 shadow-[14px_22px_54px_rgba(45,55,72,0.14),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-2xl">
          <header className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">即时零售运营中台 〉 <span className="text-slate-900">亮灯模块管理</span></p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">亮灯模块管理</h1>
              <p className="mt-1 text-slate-500">配置、分组和批量操作灯光模块</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-[260px] items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-4 shadow-[0_10px_22px_rgba(30,40,60,0.08)]">
                <Search size={19} className="text-slate-400" />
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="搜索模块编号" />
              </div>
              <PillButton>导出配置</PillButton>
              <PillButton>导入配置</PillButton>
            </div>
          </header>

          {/* 统计卡片 */}
          <section className="mb-5 grid grid-cols-5 gap-4">
            <NeumorphicCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 text-slate-600 shadow-lg">
                  <Layers size={22} strokeWidth={2.1} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">模块总数</p>
                  <p className="text-2xl font-semibold text-slate-900">{moduleList.length}</p>
                </div>
              </div>
            </NeumorphicCard>
            <NeumorphicCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600 shadow-lg">
                  <Wifi size={22} strokeWidth={2.1} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">在线</p>
                  <p className="text-2xl font-semibold text-emerald-600">{moduleList.filter(m => m.status === "在线").length}</p>
                </div>
              </div>
            </NeumorphicCard>
            <NeumorphicCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 text-slate-500 shadow-lg">
                  <WifiOff size={22} strokeWidth={2.1} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">离线</p>
                  <p className="text-2xl font-semibold text-slate-600">{moduleList.filter(m => m.status === "离线").length}</p>
                </div>
              </div>
            </NeumorphicCard>
            <NeumorphicCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 to-purple-50 text-violet-600 shadow-lg">
                  <Settings2 size={22} strokeWidth={2.1} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">维护中</p>
                  <p className="text-2xl font-semibold text-violet-600">{moduleList.filter(m => m.status === "维护").length}</p>
                </div>
              </div>
            </NeumorphicCard>
            <NeumorphicCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50 text-amber-600 shadow-lg">
                  <TrendingUp size={22} strokeWidth={2.1} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">平均温度</p>
                  <p className="text-2xl font-semibold text-amber-600">36.2℃</p>
                </div>
              </div>
            </NeumorphicCard>
          </section>

          {/* 功能切换 */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("list")}
                className={`flex h-12 items-center gap-2 rounded-2xl border px-6 text-sm font-medium transition-all ${
                  activeTab === "list" ? "border-violet-200 bg-violet-50 text-violet-700 shadow-[0_8px_18px_rgba(124,92,255,0.12)]" : "border-slate-200/80 bg-white/70 text-slate-600 shadow-[0_8px_18px_rgba(35,45,65,0.08)]"
                }`}
              >
                <Layers size={18} /> 模块列表
              </button>
              <button
                onClick={() => setActiveTab("config")}
                className={`flex h-12 items-center gap-2 rounded-2xl border px-6 text-sm font-medium transition-all ${
                  activeTab === "config" ? "border-violet-200 bg-violet-50 text-violet-700 shadow-[0_8px_18px_rgba(124,92,255,0.12)]" : "border-slate-200/80 bg-white/70 text-slate-600 shadow-[0_8px_18px_rgba(35,45,65,0.08)]"
                }`}
              >
                <Settings2 size={18} /> 参数配置
              </button>
              <button
                onClick={() => setActiveTab("group")}
                className={`flex h-12 items-center gap-2 rounded-2xl border px-6 text-sm font-medium transition-all ${
                  activeTab === "group" ? "border-violet-200 bg-violet-50 text-violet-700 shadow-[0_8px_18px_rgba(124,92,255,0.12)]" : "border-slate-200/80 bg-white/70 text-slate-600 shadow-[0_8px_18px_rgba(35,45,65,0.08)]"
                }`}
              >
                <Grid3X3 size={18} /> 分组管理
              </button>
              <button
                onClick={() => setActiveTab("batch")}
                className={`flex h-12 items-center gap-2 rounded-2xl border px-6 text-sm font-medium transition-all ${
                  activeTab === "batch" ? "border-violet-200 bg-violet-50 text-violet-700 shadow-[0_8px_18px_rgba(124,92,255,0.12)]" : "border-slate-200/80 bg-white/70 text-slate-600 shadow-[0_8px_18px_rgba(35,45,65,0.08)]"
                }`}
              >
                <Zap size={18} /> 批量操作
              </button>
            </div>
            <div className="flex items-center gap-3">
              {selectedModules.length > 0 && (
                <span className="text-sm text-slate-500">已选择 {selectedModules.length} 个模块</span>
              )}
              <PillButton>全部货架 <ChevronDown className="ml-2 inline" size={15} /></PillButton>
              <PillButton active>全部状态</PillButton>
            </div>
          </div>

          {/* 模块列表 */}
          {activeTab === "list" && (
            <NeumorphicCard className="p-5">
              <table className="w-full text-left text-sm">
                <thead className="text-slate-400">
                  <tr className="border-b border-slate-100">
                    <th className="py-3 w-10 font-medium">
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                    </th>
                    <th className="font-medium">模块编号</th>
                    <th className="font-medium">所属货架</th>
                    <th className="font-medium">通道数</th>
                    <th className="font-medium">在线状态</th>
                    <th className="font-medium">当前亮灯</th>
                    <th className="font-medium">亮度</th>
                    <th className="font-medium">温度</th>
                    <th className="font-medium">固件版本</th>
                    <th className="font-medium">最后心跳</th>
                    <th className="font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {moduleList.map((m) => (
                    <tr key={m.code} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                      <td className="py-3">
                        <input
                          type="checkbox"
                          checked={selectedModules.includes(m.code)}
                          onChange={() => handleModuleSelect(m.code)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                      </td>
                      <td className="py-3 font-semibold text-slate-700">{m.code}</td>
                      <td>{m.shelf}</td>
                      <td>{m.channels}</td>
                      <td>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          m.status === "在线" ? "bg-emerald-50 text-emerald-600" :
                          m.status === "离线" ? "bg-red-50 text-red-500" :
                          "bg-violet-50 text-violet-600"
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td>{m.lights}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-amber-400" style={{ width: `${m.brightness}%` }} />
                          </div>
                          <span className="text-xs text-slate-500">{m.brightness}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Thermometer size={14} className={parseFloat(m.temp) > 37 ? "text-red-500" : "text-slate-400"} />
                          {m.temp}
                        </div>
                      </td>
                      <td>{m.fw}</td>
                      <td className="text-slate-400">{m.heartbeat}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button className="font-semibold text-blue-500">配置</button>
                          <button className="font-semibold text-slate-500">测试</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </NeumorphicCard>
          )}

          {/* 参数配置 */}
          {activeTab === "config" && (
            <div className="grid grid-cols-[1fr_400px] gap-4">
              <NeumorphicCard className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">选择模块</h3>
                  <span className="text-sm text-slate-400">选择一个模块进行配置</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {moduleList.map((m) => (
                    <button
                      key={m.code}
                      onClick={() => setSelectedModule(m)}
                      className={`flex h-16 flex-col items-center justify-center rounded-xl border text-sm transition-all ${
                        selectedModule?.code === m.code
                          ? "border-violet-400 bg-violet-50 shadow-[0_0_0_4px_rgba(124,92,255,0.12)]"
                          : "border-slate-200 bg-white/60 hover:bg-white"
                      }`}
                    >
                      <span className="font-semibold text-slate-800">{m.code}</span>
                      <span className={`text-xs ${m.status === "在线" ? "text-emerald-600" : "text-red-500"}`}>{m.status}</span>
                    </button>
                  ))}
                </div>
              </NeumorphicCard>

              <NeumorphicCard className="p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">模块配置</h3>
                {selectedModule ? (
                  <div className="space-y-5">
                    <div className="rounded-2xl bg-slate-50/80 p-4">
                      <p className="text-sm text-slate-400">模块信息</p>
                      <p className="mt-1 font-semibold text-slate-800">{selectedModule.code}</p>
                      <p className="text-sm text-slate-500">{selectedModule.shelf} · {selectedModule.channels} 通道</p>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-600">亮度调节</label>
                        <span className="text-sm font-semibold text-amber-600">{brightness}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setBrightness(Math.max(0, brightness - 10))} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white shadow-sm">
                          <Minus size={18} className="text-slate-600" />
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={brightness}
                          onChange={(e) => setBrightness(parseInt(e.target.value))}
                          className="h-3 flex-1 appearance-none rounded-full bg-gradient-to-r from-amber-200 to-amber-400"
                        />
                        <button onClick={() => setBrightness(Math.min(100, brightness + 10))} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white shadow-sm">
                          <Plus size={18} className="text-slate-600" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600">灯光模式</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["常亮", "闪烁", "呼吸"].map((mode) => (
                          <button
                            key={mode}
                            className={`h-10 rounded-xl border text-sm font-medium transition-all ${
                              selectedModule.mode === mode
                                ? "border-violet-300 bg-violet-50 text-violet-700"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-600">闪烁频率</label>
                      <div className="grid grid-cols-4 gap-2">
                        {["0.5Hz", "1Hz", "2Hz", "4Hz"].map((freq) => (
                          <button
                            key={freq}
                            className="h-10 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50"
                          >
                            {freq}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">远程控制</span>
                      <button className="relative h-7 w-12 rounded-full bg-emerald-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                        <span className="absolute right-1 top-1 h-5 w-5 rounded-full bg-white shadow-md" />
                      </button>
                    </div>

                    <button className="w-full h-12 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold shadow-[0_10px_22px_rgba(124,92,255,0.25)]">
                      保存配置
                    </button>
                  </div>
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center text-slate-400">
                    <Settings2 size={48} className="mb-3 opacity-50" />
                    <p>请选择一个模块进行配置</p>
                  </div>
                )}
              </NeumorphicCard>
            </div>
          )}

          {/* 分组管理 */}
          {activeTab === "group" && (
            <div className="grid grid-cols-[300px_1fr] gap-4">
              <NeumorphicCard className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">分组列表</h3>
                  <IconButton icon={Plus} size={16} />
                </div>
                <div className="space-y-2">
                  {groups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroup(group)}
                      className={`w-full rounded-2xl p-4 text-left transition-all ${
                        selectedGroup?.id === group.id
                          ? "border-2 border-violet-400 bg-violet-50/80"
                          : "border border-slate-200 bg-white/60 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-4 w-4 rounded-full bg-${group.color}-500`} />
                        <span className="font-semibold text-slate-800">{group.name}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{group.modules.length} 个模块 · {group.slots.length} 个格口</p>
                    </button>
                  ))}
                </div>
              </NeumorphicCard>

              <NeumorphicCard className="p-5">
                {selectedGroup ? (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{selectedGroup.name}</h3>
                        <p className="text-sm text-slate-500">管理分组内的模块和格口</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <IconButton icon={Edit3} />
                        <IconButton icon={Trash2} />
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-slate-50/80 p-4">
                        <p className="mb-2 text-sm text-slate-400">包含模块</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedGroup.modules.map((code) => (
                            <span key={code} className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">
                              {code}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-slate-50/80 p-4">
                        <p className="mb-2 text-sm text-slate-400">控制格口</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedGroup.slots.map((slot) => (
                            <span key={slot} className="rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-600">
                              {slot}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-medium text-slate-600">分组亮度</label>
                      <div className="flex items-center gap-3">
                        <button className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white shadow-sm">
                          <Minus size={18} className="text-slate-600" />
                        </button>
                        <div className="h-3 flex-1 rounded-full bg-gradient-to-r from-amber-200 to-amber-400" />
                        <button className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white shadow-sm">
                          <Plus size={18} className="text-slate-600" />
                        </button>
                        <span className="w-12 text-right font-semibold text-amber-600">80%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <button className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-600">
                        <Lightbulb size={18} /> 全点亮灯
                      </button>
                      <button className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-600">
                        <Power size={18} /> 全关灯光
                      </button>
                      <button className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 text-sm font-semibold text-blue-600">
                        <RotateCcw size={18} /> 恢复默认
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex h-96 flex-col items-center justify-center text-slate-400">
                    <Grid3X3 size={48} className="mb-3 opacity-50" />
                    <p>请选择一个分组</p>
                  </div>
                )}
              </NeumorphicCard>
            </div>
          )}

          {/* 批量操作 */}
          {activeTab === "batch" && (
            <div className="grid grid-cols-[1fr_400px] gap-4">
              <NeumorphicCard className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">选择模块进行批量操作</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedModules(moduleList.map(m => m.code))}
                      className="text-sm font-medium text-violet-600"
                    >
                      全选
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={() => setSelectedModules([])}
                      className="text-sm font-medium text-slate-500"
                    >
                      取消全选
                    </button>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-4 gap-2">
                  {moduleList.map((m) => (
                    <button
                      key={m.code}
                      onClick={() => handleModuleSelect(m.code)}
                      className={`relative flex h-16 flex-col items-center justify-center rounded-xl border text-sm transition-all ${
                        selectedModules.includes(m.code)
                          ? "border-violet-400 bg-violet-50 shadow-[0_0_0_4px_rgba(124,92,255,0.12)]"
                          : "border-slate-200 bg-white/60 hover:bg-white"
                      }`}
                    >
                      {selectedModules.includes(m.code) && (
                        <span className="absolute right-1 top-1">
                          <CheckCircle2 size={16} className="text-violet-500" />
                        </span>
                      )}
                      <span className="font-semibold text-slate-800">{m.code}</span>
                      <span className={`text-xs ${m.status === "在线" ? "text-emerald-600" : "text-red-500"}`}>{m.status}</span>
                    </button>
                  ))}
                </div>
                <div className="rounded-2xl bg-slate-50/80 p-4">
                  <p className="text-sm text-slate-500">
                    已选择 <span className="font-semibold text-violet-600">{selectedModules.length}</span> 个模块
                  </p>
                </div>
              </NeumorphicCard>

              <NeumorphicCard className="p-5">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">批量操作</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleBatchOperation("lightAll")}
                    disabled={selectedModules.length === 0}
                    className={`flex w-full h-12 items-center gap-3 rounded-2xl border px-4 text-sm font-semibold transition-all ${
                      selectedModules.length > 0
                        ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        : "border-slate-200 bg-slate-50 text-slate-400"
                    }`}
                  >
                    <Lightbulb size={18} /> 批量点亮
                  </button>
                  <button
                    onClick={() => handleBatchOperation("turnOff")}
                    disabled={selectedModules.length === 0}
                    className={`flex w-full h-12 items-center gap-3 rounded-2xl border px-4 text-sm font-semibold transition-all ${
                      selectedModules.length > 0
                        ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        : "border-slate-200 bg-slate-50 text-slate-400"
                    }`}
                  >
                    <EyeOff size={18} /> 批量关闭
                  </button>
                  <button
                    onClick={() => handleBatchOperation("setBrightness")}
                    disabled={selectedModules.length === 0}
                    className={`flex w-full h-12 items-center gap-3 rounded-2xl border px-4 text-sm font-semibold transition-all ${
                      selectedModules.length > 0
                        ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                        : "border-slate-200 bg-slate-50 text-slate-400"
                    }`}
                  >
                    <SlidersHorizontal size={18} /> 设置亮度
                  </button>
                  <button
                    onClick={() => handleBatchOperation("setMode")}
                    disabled={selectedModules.length === 0}
                    className={`flex w-full h-12 items-center gap-3 rounded-2xl border px-4 text-sm font-semibold transition-all ${
                      selectedModules.length > 0
                        ? "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
                        : "border-slate-200 bg-slate-50 text-slate-400"
                    }`}
                  >
                    <Zap size={18} /> 设置模式
                  </button>
                  <button
                    onClick={() => handleBatchOperation("setMaintenance")}
                    disabled={selectedModules.length === 0}
                    className={`flex w-full h-12 items-center gap-3 rounded-2xl border px-4 text-sm font-semibold transition-all ${
                      selectedModules.length > 0
                        ? "border-violet-200 bg-violet-50 text-violet-600 hover:bg-violet-100"
                        : "border-slate-200 bg-slate-50 text-slate-400"
                    }`}
                  >
                    <Settings2 size={18} /> 设为维护
                  </button>
                  <button
                    onClick={() => handleBatchOperation("updateFw")}
                    disabled={selectedModules.length === 0}
                    className={`flex w-full h-12 items-center gap-3 rounded-2xl border px-4 text-sm font-semibold transition-all ${
                      selectedModules.length > 0
                        ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        : "border-slate-200 bg-slate-50 text-slate-400"
                    }`}
                  >
                    <RefreshCw size={18} /> 批量升级固件
                  </button>
                </div>
              </NeumorphicCard>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ==================== 导出所有页面 ====================

export { ShelfKanban, OrderBinding, LightModuleManagement };
export default ShelfKanban;
