import React, { useMemo, useState, useEffect } from "react";
import {
  Home,
  ClipboardList,
  Package,
  Boxes,
  Lightbulb,
  RefreshCw,
  Settings,
  Store,
  Search,
  ChevronDown,
  MoreHorizontal,
  AlertTriangle,
  Clock3,
  Wifi,
  Unlock,
  ScanLine,
  PackageCheck,
  Truck,
  Box,
  MapPin,
  CheckCircle2,
  TimerReset,
  Bell,
  Eye,
  ArrowRightLeft,
  QrCode,
  Keyboard,
  Zap,
  History,
  Link2,
  Unlink,
  X,
  Check,
  Camera,
  Loader2,
} from "lucide-react";

// ===================== 第1页：格口看板 =====================

const menuItems = [
  { icon: Home, label: "首页总览" },
  { icon: ClipboardList, label: "订单管理" },
  { icon: Package, label: "商品管理" },
  { icon: Boxes, label: "库存管理" },
  { icon: Box, label: "智能外卖架", page: 1, active: true },
  { icon: Lightbulb, label: "灯控中心" },
  { icon: RefreshCw, label: "平台同步" },
  { icon: Settings, label: "系统设置" },
];

const shelves = [
  {
    name: "A货架",
    zone: "骑手取货区左侧",
    online: true,
    slots: [
      { code: "A-01", status: "empty" },
      { code: "A-02", status: "occupied", order: "#21018", platform: "美团", items: 4, timer: "08:12" },
      { code: "A-03", status: "ready", order: "#21020", platform: "饿了么", items: 2, timer: "04:36" },
      { code: "A-04", status: "pickup", order: "#21023", platform: "美团", items: 5, timer: "00:32" },
      { code: "A-05", status: "empty" },
      { code: "A-06", status: "empty" },
      { code: "A-07", status: "timeout", order: "#21007", platform: "抖音", items: 3, timer: "21:08" },
      { code: "A-08", status: "empty" },
      { code: "A-09", status: "error" },
      { code: "A-10", status: "maintenance" },
    ],
  },
  {
    name: "B货架",
    zone: "骑手取货区右侧",
    online: true,
    slots: [
      { code: "B-01", status: "empty" },
      { code: "B-02", status: "occupied", order: "#21031", platform: "饿了么", items: 1, timer: "06:19" },
      { code: "B-03", status: "pickup", order: "#21038", platform: "美团", items: 6, timer: "00:48", selected: true },
      { code: "B-04", status: "ready", order: "#21040", platform: "京东到家", items: 2, timer: "03:51" },
      { code: "B-05", status: "empty" },
      { code: "B-06", status: "timeout", order: "#21012", platform: "美团", items: 4, timer: "18:24" },
      { code: "B-07", status: "timeout", order: "#21015", platform: "饿了么", items: 2, timer: "15:40" },
      { code: "B-08", status: "empty" },
      { code: "B-09", status: "empty" },
      { code: "B-10", status: "maintenance" },
    ],
  },
  {
    name: "C货架",
    zone: "异常订单暂存区",
    online: false,
    slots: [
      { code: "C-01", status: "error" },
      { code: "C-02", status: "empty" },
      { code: "C-03", status: "empty" },
      { code: "C-04", status: "maintenance" },
      { code: "C-05", status: "empty" },
      { code: "C-06", status: "empty" },
      { code: "C-07", status: "timeout", order: "#21028", platform: "美团", items: 2, timer: "25:33" },
      { code: "C-08", status: "empty" },
      { code: "C-09", status: "empty" },
      { code: "C-10", status: "empty" },
    ],
  },
];

const pendingOrders = [
  { id: "DD202501070041", platform: "美团", items: 5, amount: "¥68.50", suggest: "B-05", status: "待放入" },
  { id: "DD202501070042", platform: "饿了么", items: 2, amount: "¥35.80", suggest: "A-01", status: "待放入" },
  { id: "DD202501070043", platform: "京东到家", items: 4, amount: "¥89.90", suggest: "B-08", status: "待放入" },
];

const pickupQueue = [
  { code: "B-03", order: "#21038", rider: "王骑士", eta: "已到店", light: "紫色闪烁" },
  { code: "A-04", order: "#21023", rider: "李骑士", eta: "1分钟", light: "紫色闪烁" },
  { code: "A-03", order: "#21020", rider: "赵骑士", eta: "3分钟", light: "待亮灯" },
];

const alarms = [
  { type: "timeout", title: "C-07 超时未取", desc: "已超过 25 分钟", time: "09:34" },
  { type: "error", title: "A-09 异常占用", desc: "需要人工检查", time: "09:28" },
  { type: "timeout", title: "B-06 超时未取", desc: "已超过 18 分钟", time: "09:21" },
];

// ===================== 第2页：订单绑定格口 =====================

const bindModes = [
  { id: "scan", label: "扫码绑定", icon: QrCode, desc: "扫描订单二维码自动绑定" },
  { id: "quick", label: "快速绑定", icon: Zap, desc: "从待绑定订单列表选择" },
  { id: "manual", label: "手动输入", icon: Keyboard, desc: "输入订单号和格口手动绑定" },
];

const bindHistory = [
  { time: "09:45", order: "DD202501070045", platform: "美团", slot: "A-05", operator: "店员小王", status: "success" },
  { time: "09:38", order: "DD202501070044", platform: "饿了么", slot: "B-08", operator: "店员小李", status: "success" },
  { time: "09:32", order: "DD202501070043", platform: "京东到家", slot: "B-05", operator: "店员小王", status: "success" },
  { time: "09:21", order: "DD202501070041", platform: "美团", slot: "B-03", operator: "店员小李", status: "failed", reason: "格口已被占用" },
  { time: "09:15", order: "DD202501070038", platform: "美团", slot: "A-02", operator: "店员小王", status: "success" },
];

const availableSlots = [
  { code: "A-01", light: "正常", selected: false },
  { code: "A-05", light: "正常", selected: false },
  { code: "A-06", light: "正常", selected: false },
  { code: "A-08", light: "正常", selected: false },
  { code: "B-01", light: "正常", selected: false },
  { code: "B-05", light: "正常", selected: true },
  { code: "B-08", light: "正常", selected: false },
  { code: "B-09", light: "正常", selected: false },
  { code: "C-02", light: "正常", selected: false },
  { code: "C-03", light: "正常", selected: false },
];

const statusMap = {
  empty: {
    label: "空闲",
    dot: "bg-slate-300",
    card: "bg-white/72 border-slate-200 text-slate-500",
    text: "text-slate-400",
  },
  occupied: {
    label: "已占用",
    dot: "bg-emerald-500",
    card: "bg-emerald-50/85 border-emerald-200 text-emerald-700",
    text: "text-emerald-600",
  },
  ready: {
    label: "待取货",
    dot: "bg-sky-500",
    card: "bg-sky-50/85 border-sky-200 text-sky-700",
    text: "text-sky-600",
  },
  pickup: {
    label: "取货中",
    dot: "bg-violet-500",
    card: "bg-violet-50/85 border-violet-200 text-violet-700 ring-2 ring-violet-300/70",
    text: "text-violet-600",
  },
  timeout: {
    label: "超时未取",
    dot: "bg-orange-500",
    card: "bg-orange-50/85 border-orange-200 text-orange-700",
    text: "text-orange-600",
  },
  error: {
    label: "异常",
    dot: "bg-red-500",
    card: "bg-red-50/85 border-red-200 text-red-600",
    text: "text-red-500",
  },
  maintenance: {
    label: "维护",
    dot: "bg-indigo-500",
    card: "bg-indigo-50/85 border-indigo-200 text-indigo-600",
    text: "text-indigo-500",
  },
};

function ShellCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-[30px] border border-white/85 bg-white/68 shadow-[12px_18px_42px_rgba(38,48,66,0.12),inset_0_1px_0_rgba(255,255,255,0.98)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

function SoftButton({ children, active = false, danger = false, small = false, className = "" }) {
  const size = small ? "h-10 px-4 text-sm" : "h-12 px-5 text-sm";
  const style = active
    ? "border-violet-100 bg-violet-50 text-violet-700 shadow-[0_12px_24px_rgba(124,92,255,0.14),inset_0_1px_0_rgba(255,255,255,0.95)]"
    : danger
    ? "border-red-100 bg-red-50 text-red-600 shadow-[0_12px_24px_rgba(239,68,68,0.10),inset_0_1px_0_rgba(255,255,255,0.95)]"
    : "border-slate-200/80 bg-white/70 text-slate-600 shadow-[0_10px_22px_rgba(38,48,66,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] hover:bg-white";
  return <button className={`rounded-2xl border px-5 font-semibold transition-all ${size} ${style} ${className}`}>{children}</button>;
}

function MetricCard({ icon: Icon, title, value, sub, tone = "emerald", warning = false }) {
  const tones = {
    emerald: "from-emerald-100 to-teal-50 text-emerald-600 shadow-emerald-200/50",
    violet: "from-violet-100 to-purple-50 text-violet-600 shadow-violet-200/50",
    blue: "from-blue-100 to-sky-50 text-blue-600 shadow-blue-200/50",
    orange: "from-orange-100 to-amber-50 text-orange-600 shadow-orange-200/50",
    red: "from-red-100 to-rose-50 text-red-600 shadow-red-200/50",
  };

  return (
    <ShellCard className="h-[118px] p-5">
      <div className="flex h-full items-center gap-4">
        <div className={`grid h-15 w-15 place-items-center rounded-2xl bg-gradient-to-br ${tones[tone]} shadow-lg`}>
          <Icon size={26} strokeWidth={2.1} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-[32px] font-semibold leading-none tracking-tight text-slate-900">{value}</p>
          <p className={`mt-2 text-sm ${warning ? "text-red-500" : "text-emerald-600"}`}>{sub}</p>
        </div>
      </div>
    </ShellCard>
  );
}

function SlotCard({ slot, selected, onClick }) {
  const config = statusMap[slot.status];
  return (
    <button
      onClick={() => onClick(slot)}
      className={`relative flex h-[88px] min-w-[82px] flex-col items-center justify-center rounded-2xl border px-2 text-center text-sm transition-all ${config.card} ${
        selected
          ? "scale-[1.03] shadow-[0_0_0_5px_rgba(139,92,246,0.12),0_16px_30px_rgba(124,58,237,0.22)] ring-2 ring-violet-400"
          : "shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_18px_rgba(38,48,66,0.06)]"
      }`}
    >
      {slot.status === "pickup" && (
        <span className="absolute right-2 top-2 h-2.5 w-2.5 animate-pulse rounded-full bg-violet-500 shadow-[0_0_18px_rgba(124,58,237,0.9)]" />
      )}
      <span className="text-base font-semibold">{slot.code}</span>
      <span className={`mt-1 text-xs font-semibold ${config.text}`}>{config.label}</span>
      {slot.order && <span className="mt-0.5 text-[11px] text-slate-500">{slot.order}</span>}
      {slot.timer && <span className="text-[11px] text-slate-400">{slot.timer}</span>}
    </button>
  );
}

// ===================== 第1页组件 =====================
function Page1_ShelfBoard({ onNavigate }) {
  const [selectedSlot, setSelectedSlot] = useState({
    code: "B-03",
    status: "pickup",
    order: "DD202501070038",
    platform: "美团外卖",
    shelf: "B货架",
    items: 6,
    rider: "王骑士",
    eta: "已到店",
    light: "紫色闪烁",
    duration: "00:09:41",
  });

  const counts = useMemo(() => {
    const flat = shelves.flatMap((s) => s.slots);
    return {
      total: flat.length,
      empty: flat.filter((s) => s.status === "empty").length,
      occupied: flat.filter((s) => ["occupied", "ready", "pickup", "timeout"].includes(s.status)).length,
      pickup: flat.filter((s) => s.status === "pickup").length,
      alarm: flat.filter((s) => ["timeout", "error"].includes(s.status)).length,
    };
  }, []);

  const handleSlotClick = (slot) => {
    setSelectedSlot({
      code: slot.code,
      status: slot.status,
      order: slot.order ? `DD202501070${slot.order.replace("#", "")}` : "未绑定订单",
      platform: slot.platform ? `${slot.platform}外卖` : "--",
      shelf: `${slot.code[0]}货架`,
      items: slot.items || 0,
      rider: slot.status === "empty" ? "--" : "骑手待确认",
      eta: slot.status === "pickup" ? "已到店" : slot.status === "ready" ? "3分钟" : "--",
      light: slot.status === "pickup" ? "紫色闪烁" : slot.status === "timeout" ? "橙色慢闪" : slot.status === "error" ? "红色报警" : "待机",
      duration: slot.timer || "--",
    });
  };

  return (
    <>
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">即时零售运营中台 〉 <span className="text-slate-900">智能外卖架</span></p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">格口看板 <span className="text-xl font-medium text-slate-400">取货区实时状态</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-[320px] items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-4 shadow-[0_10px_22px_rgba(30,40,60,0.08)]">
            <Search size={19} className="text-slate-400" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="搜索订单号 / 格口 / 骑手 / 平台" />
          </div>
          <SoftButton>全部货架 <ChevronDown className="ml-2 inline" size={15} /></SoftButton>
          <SoftButton>全部状态 <ChevronDown className="ml-2 inline" size={15} /></SoftButton>
          <SoftButton onClick={() => onNavigate(2)}>扫码绑定</SoftButton>
          <SoftButton danger>异常处理</SoftButton>
        </div>
      </header>

      <section className="mb-5 grid grid-cols-4 gap-4">
        <MetricCard icon={Wifi} title="在线货架" value="3 / 4" sub="货架状态正常" tone="emerald" />
        <MetricCard icon={PackageCheck} title="已占用格口" value={`${counts.occupied}`} sub={`空闲 ${counts.empty} 个`} tone="blue" />
        <MetricCard icon={Truck} title="取货中" value={`${counts.pickup}`} sub="骑手到店处理中" tone="violet" />
        <MetricCard icon={AlertTriangle} title="异常格口" value={`${counts.alarm}`} sub="需要人工处理" tone="red" warning />
      </section>

      <section className="grid grid-cols-[1fr_334px] gap-4">
        <ShellCard className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-slate-900">货架与格口总览</h2>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                {Object.entries({ empty: "空闲", occupied: "已占用", ready: "待取货", pickup: "取货中", timeout: "超时", error: "异常", maintenance: "维护" }).map(([key, label]) => (
                  <span key={key} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${statusMap[key].dot}`} /> {label}
                  </span>
                ))}
              </div>
            </div>
            <button className="text-sm font-medium text-slate-500">展开全部 ↗</button>
          </div>

          <div className="space-y-5">
            {shelves.map((row) => (
              <div key={row.name} className="grid grid-cols-[118px_1fr] gap-4 border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                <div className="pt-3">
                  <p className="text-lg font-semibold text-slate-800">{row.name}</p>
                  <p className={`mt-2 flex items-center gap-2 text-sm ${row.online ? "text-emerald-600" : "text-red-500"}`}>
                    <span className={`h-2 w-2 rounded-full ${row.online ? "bg-emerald-500" : "bg-red-500"}`} />
                    {row.online ? "在线" : "离线"}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{row.zone}</p>
                </div>
                <div className="grid grid-cols-10 gap-2.5">
                  {row.slots.map((slot) => (
                    <SlotCard key={slot.code} slot={slot} selected={selectedSlot.code === slot.code || slot.selected} onClick={handleSlotClick} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{selectedSlot.code}</h2>
            <span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-600">{statusMap[selectedSlot.status]?.label || "取货中"}</span>
          </div>
          <div className="space-y-3 text-[15px]">
            {[
              ["订单号", selectedSlot.order],
              ["平台", selectedSlot.platform],
              ["货架", selectedSlot.shelf],
              ["商品件数", `${selectedSlot.items} 件`],
              ["骑手", selectedSlot.rider],
              ["预计状态", selectedSlot.eta],
              ["灯光", selectedSlot.light],
              ["占用时长", selectedSlot.duration],
            ].map(([k, v]) => (
              <div className="flex justify-between gap-4" key={k}>
                <span className="text-slate-400">{k}</span>
                <span className="font-medium text-slate-700">{v}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 text-sm font-semibold text-violet-600 shadow-[0_10px_18px_rgba(124,58,237,0.12)]">
              <Lightbulb size={18} /> 亮灯找货
            </button>
            <button className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 text-sm font-semibold text-red-600 shadow-[0_10px_18px_rgba(239,68,68,0.10)]">
              <Unlock size={18} /> 释放格口
            </button>
            <button className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 text-sm font-semibold text-blue-600 shadow-[0_10px_18px_rgba(59,130,246,0.12)]">
              <ScanLine size={18} /> 重新绑定
            </button>
            <button className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/75 text-sm font-semibold text-slate-600 shadow-[0_10px_18px_rgba(35,45,65,0.08)]">
              <MoreHorizontal size={18} /> 更多操作
            </button>
          </div>
        </ShellCard>
      </section>

      <section className="mt-4 grid grid-cols-[1.2fr_0.9fr_0.9fr] gap-4">
        <ShellCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">待放入订单</h3>
            <button className="text-sm text-slate-400">查看全部 ›</button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr className="border-b border-slate-100">
                <th className="py-3 font-medium">订单号</th>
                <th className="font-medium">平台</th>
                <th className="font-medium">件数</th>
                <th className="font-medium">金额</th>
                <th className="font-medium">建议格口</th>
                <th className="font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 font-semibold text-slate-700">{order.id}</td>
                  <td>{order.platform}</td>
                  <td>{order.items}</td>
                  <td>{order.amount}</td>
                  <td><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">{order.suggest}</span></td>
                  <td><button className="font-semibold text-violet-600" onClick={() => onNavigate(2)}>绑定</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </ShellCard>

        <ShellCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">取货队列</h3>
            <button className="text-sm text-slate-400">全部 ›</button>
          </div>
          <div className="space-y-3">
            {pickupQueue.map((item) => (
              <div key={item.code} className="rounded-2xl bg-white/55 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 font-semibold text-violet-600">{item.code}</span>
                    <div>
                      <p className="font-semibold text-slate-700">{item.order}</p>
                      <p className="text-xs text-slate-400">{item.rider} · {item.eta}</p>
                    </div>
                  </div>
                  <button className="text-sm font-semibold text-violet-600">亮灯</button>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">异常提醒</h3>
            <button className="text-sm text-slate-400">全部 ›</button>
          </div>
          <div className="space-y-3">
            {alarms.map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-2xl bg-white/55 p-3">
                <div className="flex items-center gap-3">
                  {item.type === "error" ? <AlertTriangle className="text-red-500" size={22} /> : <Clock3 className="text-orange-500" size={22} />}
                  <div>
                    <p className="font-medium text-slate-700">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <span className="text-sm text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        </ShellCard>
      </section>
    </>
  );
}

// ===================== 第2页组件：订单绑定格口 =====================
function Page2_OrderBinding({ onNavigate }) {
  const [activeMode, setActiveMode] = useState("scan");
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualOrder, setManualOrder] = useState("");
  const [manualSlot, setManualSlot] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("B-05");
  const [bindSuccess, setBindSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const allSlots = useMemo(() => {
    const slots = [];
    shelves.forEach((shelf) => {
      shelf.slots.forEach((slot) => {
        if (slot.status === "empty") {
          slots.push({ ...slot, shelf: shelf.name });
        }
      });
    });
    return slots;
  }, []);

  const handleStartScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        order: "DD202501070046",
        platform: "美团",
        items: 3,
        amount: "¥45.20",
        suggest: "A-08",
      });
    }, 2500);
  };

  const handleScanBind = () => {
    setShowConfirm(true);
  };

  const handleConfirmBind = () => {
    setBindSuccess(true);
    setShowConfirm(false);
    setTimeout(() => {
      setBindSuccess(false);
      setScanResult(null);
    }, 3000);
  };

  const handleQuickBind = (order) => {
    setSelectedOrder(order);
    setShowConfirm(true);
  };

  const handleManualBind = () => {
    if (manualOrder && manualSlot) {
      setShowConfirm(true);
    }
  };

  const handleConfirmManual = () => {
    setBindSuccess(true);
    setShowConfirm(false);
    setManualOrder("");
    setManualSlot("");
    setTimeout(() => setBindSuccess(false), 3000);
  };

  return (
    <>
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">即时零售运营中台 〉 <span className="text-slate-900">智能外卖架</span></p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">订单绑定格口 <span className="text-xl font-medium text-slate-400">扫码 / 手动绑定</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-[320px] items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-4 shadow-[0_10px_22px_rgba(30,40,60,0.08)]">
            <Search size={19} className="text-slate-400" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="搜索订单号 / 格口" />
          </div>
          <SoftButton onClick={() => onNavigate(1)}>返回看板</SoftButton>
          <SoftButton>批量绑定</SoftButton>
          <SoftButton>绑定记录 <History className="ml-2 inline" size={16} /></SoftButton>
        </div>
      </header>

      <section className="mb-5 grid grid-cols-4 gap-4">
        <MetricCard icon={PackageCheck} title="今日绑定" value="128" sub="较昨日 +12%" tone="emerald" />
        <MetricCard icon={Link2} title="待绑定订单" value="8" sub="可绑定格口 15 个" tone="blue" />
        <MetricCard icon={CheckCircle2} title="绑定成功率" value="98.2%" sub="失败 2 单" tone="violet" />
        <MetricCard icon={TimerReset} title="平均绑定耗时" value="3.2秒" sub="环比持平" tone="orange" />
      </section>

      <section className="grid grid-cols-[1fr_420px] gap-4">
        {/* 左侧：绑定模式 */}
        <div className="space-y-4">
          {/* 绑定模式切换 */}
          <ShellCard className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">选择绑定方式</h2>
            <div className="grid grid-cols-3 gap-4">
              {bindModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`flex flex-col items-center gap-3 rounded-2xl border p-5 transition-all ${
                      activeMode === mode.id
                        ? "border-violet-200 bg-violet-50 shadow-[0_12px_24px_rgba(124,92,255,0.14),inset_0_1px_0_rgba(255,255,255,0.95)]"
                        : "border-slate-200/80 bg-white/70 hover:bg-white"
                    }`}
                  >
                    <div className={`grid h-14 w-14 place-items-center rounded-2xl ${
                      activeMode === mode.id ? "bg-violet-100 text-violet-600" : "bg-slate-100 text-slate-500"
                    }`}>
                      <Icon size={28} />
                    </div>
                    <span className={`font-semibold ${activeMode === mode.id ? "text-violet-700" : "text-slate-700"}`}>{mode.label}</span>
                    <span className="text-xs text-slate-400">{mode.desc}</span>
                  </button>
                );
              })}
            </div>
          </ShellCard>

          {/* 扫码绑定区域 */}
          {activeMode === "scan" && (
            <ShellCard className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">扫码绑定订单</h3>
              {!scanResult ? (
                <div className="flex flex-col items-center">
                  <button
                    onClick={handleStartScan}
                    className="mb-6 flex h-48 w-48 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all hover:border-violet-300 hover:bg-violet-50"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 size={48} className="mb-3 animate-spin text-violet-500" />
                        <span className="text-sm font-medium text-slate-500">扫描中...</span>
                      </>
                    ) : (
                      <>
                        <Camera size={48} className="mb-3 text-slate-400" />
                        <span className="text-sm font-medium text-slate-500">点击扫描订单二维码</span>
                      </>
                    )}
                  </button>
                  <p className="text-sm text-slate-400">对准订单二维码进行扫描，系统将自动识别订单信息</p>
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100">
                      <Check size={24} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-700">扫码成功</p>
                      <p className="text-sm text-slate-500">订单信息已识别</p>
                    </div>
                  </div>
                  <div className="mb-5 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white p-4">
                      <p className="text-sm text-slate-400">订单号</p>
                      <p className="font-semibold text-slate-800">{scanResult.order}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4">
                      <p className="text-sm text-slate-400">外卖平台</p>
                      <p className="font-semibold text-slate-800">{scanResult.platform}</p>
                    </div>
                    <div className="rounded-xl bg-white p-4">
                      <p className="text-sm text-slate-400">商品件数</p>
                      <p className="font-semibold text-slate-800">{scanResult.items} 件</p>
                    </div>
                    <div className="rounded-xl bg-white p-4">
                      <p className="text-sm text-slate-400">建议格口</p>
                      <p className="font-semibold text-violet-600">{scanResult.suggest}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleScanBind}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(124,58,237,0.25)] hover:bg-violet-700"
                  >
                    <Link2 size={18} /> 绑定到 {scanResult.suggest}
                  </button>
                </div>
              )}
            </ShellCard>
          )}

          {/* 快速绑定区域 */}
          {activeMode === "quick" && (
            <ShellCard className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">快速绑定订单</h3>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">{pendingOrders.length} 单待绑定</span>
              </div>
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-2xl bg-white/55 p-4">
                    <div className="flex items-center gap-4">
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100">
                        <Package size={22} className="text-slate-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{order.id}</p>
                        <p className="text-sm text-slate-500">{order.platform} · {order.items}件 · {order.amount}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">建议 {order.suggest}</span>
                      <SoftButton small onClick={() => handleQuickBind(order)}>绑定</SoftButton>
                    </div>
                  </div>
                ))}
              </div>
            </ShellCard>
          )}

          {/* 手动输入绑定区域 */}
          {activeMode === "manual" && (
            <ShellCard className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">手动输入绑定</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">输入订单号</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={manualOrder}
                      onChange={(e) => setManualOrder(e.target.value)}
                      placeholder="例如：DD202501070046"
                      className="h-12 flex-1 rounded-2xl border border-slate-200/80 bg-white/70 px-4 shadow-[0_8px_18px_rgba(38,48,66,0.06)] outline-none placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
                    />
                    <SoftButton>查询</SoftButton>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">选择空闲格口</label>
                  <div className="flex flex-wrap gap-2">
                    {allSlots.slice(0, 10).map((slot) => (
                      <button
                        key={slot.code}
                        onClick={() => setManualSlot(slot.code)}
                        className={`h-12 min-w-[70px] rounded-2xl border px-4 text-sm font-semibold transition-all ${
                          manualSlot === slot.code
                            ? "border-violet-300 bg-violet-50 text-violet-700 shadow-[0_8px_18px_rgba(124,92,255,0.15)]"
                            : "border-slate-200/80 bg-white/70 text-slate-600 hover:bg-white"
                        }`}
                      >
                        {slot.code}
                      </button>
                    ))}
                  </div>
                </div>
                <SoftButton
                  className="w-full"
                  onClick={handleManualBind}
                  disabled={!manualOrder || !manualSlot}
                >
                  确认绑定
                </SoftButton>
              </div>
            </ShellCard>
          )}

          {/* 绑定历史 */}
          <ShellCard className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">绑定历史</h3>
              <button className="text-sm text-slate-400">查看全部 ›</button>
            </div>
            <div className="space-y-2">
              {bindHistory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-2xl bg-white/55 p-3">
                  <div className="flex items-center gap-3">
                    <span className={`grid h-8 w-8 place-items-center rounded-lg ${item.status === "success" ? "bg-emerald-100" : "bg-red-100"}`}>
                      {item.status === "success" ? (
                        <Check size={16} className="text-emerald-600" />
                      ) : (
                        <X size={16} className="text-red-500" />
                      )}
                    </span>
                    <div>
                      <p className="font-medium text-slate-700">
                        {item.order} → {item.slot}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.platform} · {item.operator}
                        {item.reason && <span className="text-red-500"> · {item.reason}</span>}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
          </ShellCard>
        </div>

        {/* 右侧：空闲格口选择 */}
        <ShellCard className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">空闲格口</h3>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">{allSlots.length} 个可用</span>
          </div>

          {/* 已选格口 */}
          {selectedOrder && (
            <div className="mb-4 rounded-2xl bg-violet-50 p-4">
              <p className="mb-2 text-sm font-medium text-violet-700">即将绑定</p>
              <p className="font-semibold text-slate-800">{selectedOrder.id}</p>
              <p className="text-sm text-slate-500">{selectedOrder.platform} · {selectedOrder.items}件</p>
            </div>
          )}

          {/* 格口网格 */}
          <div className="mb-6 grid grid-cols-4 gap-2">
            {allSlots.map((slot) => (
              <button
                key={slot.code}
                onClick={() => setSelectedSlot(slot.code)}
                className={`flex h-[70px] flex-col items-center justify-center rounded-2xl border text-sm transition-all ${
                  selectedSlot === slot.code
                    ? "border-violet-300 bg-violet-50 ring-2 ring-violet-400 shadow-[0_8px_18px_rgba(124,92,255,0.18)]"
                    : "border-slate-200/80 bg-white/70 text-slate-600 hover:bg-white"
                }`}
              >
                <span className="font-semibold">{slot.code}</span>
                <span className="mt-1 flex items-center gap-1 text-xs text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {slot.light}
                </span>
              </button>
            ))}
          </div>

          {/* 确认绑定按钮 */}
          {selectedOrder && (
            <div className="space-y-3">
              <button
                onClick={() => setShowConfirm(true)}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 text-base font-semibold text-white shadow-[0_12px_24px_rgba(124,58,237,0.25)] hover:bg-violet-700"
              >
                <Link2 size={20} /> 确认绑定到 {selectedSlot}
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/70 text-sm font-semibold text-slate-600 hover:bg-white"
              >
                取消选择
              </button>
            </div>
          )}

          {/* 格口筛选 */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="mb-3 text-sm font-medium text-slate-600">按货架筛选</p>
            <div className="flex flex-wrap gap-2">
              {["全部", "A货架", "B货架", "C货架"].map((shelf) => (
                <button
                  key={shelf}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${
                    shelf === "全部"
                      ? "border-violet-200 bg-violet-50 text-violet-600"
                      : "border-slate-200 bg-white/70 text-slate-500 hover:bg-white"
                  }`}
                >
                  {shelf}
                </button>
              ))}
            </div>
          </div>
        </ShellCard>
      </section>

      {/* 绑定成功提示 */}
      {bindSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <ShellCard className="mx-4 w-[400px] p-8 text-center">
            <div className="mb-4 grid place-items-center">
              <div className="relative">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-emerald-100">
                  <CheckCircle2 size={40} className="text-emerald-600" />
                </div>
                <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white">
                  <Check size={14} />
                </span>
              </div>
            </div>
            <h3 className="mb-2 text-2xl font-semibold text-slate-900">绑定成功</h3>
            <p className="mb-6 text-slate-500">订单已成功绑定到格口 {selectedSlot || scanResult?.suggest}</p>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">灯光状态</span>
                <span className="font-semibold text-emerald-600">已点亮</span>
              </div>
            </div>
          </ShellCard>
        </div>
      )}

      {/* 绑定确认弹窗 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <ShellCard className="mx-4 w-[440px] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">确认绑定</h3>
              <button onClick={() => setShowConfirm(false)} className="grid h-8 w-8 place-items-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200">
                <X size={16} />
              </button>
            </div>
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <span className="text-slate-500">订单号</span>
                <span className="font-semibold text-slate-800">{selectedOrder?.id || manualOrder || scanResult?.order}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <span className="text-slate-500">绑定格口</span>
                <span className="font-semibold text-violet-600">{selectedSlot || scanResult?.suggest || manualSlot}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <SoftButton className="flex-1" onClick={() => setShowConfirm(false)}>取消</SoftButton>
              <button
                onClick={selectedOrder ? handleConfirmBind : handleConfirmManual}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-violet-600 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(124,58,237,0.25)] hover:bg-violet-700"
              >
                <Check size={18} /> 确认绑定
              </button>
            </div>
          </ShellCard>
        </div>
      )}
    </>
  );
}

// ===================== 主组件 =====================
export default function SmartShelfSystem() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen overflow-hidden bg-[#eef0f0] p-6 text-slate-800">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.96),transparent_30%),radial-gradient(circle_at_82%_0%,rgba(219,226,255,0.55),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.42),rgba(220,225,230,0.25))]" />

      <div className="relative mx-auto flex max-w-[1680px] gap-4">
        {/* 左侧导航 */}
        <aside className="w-[276px] shrink-0 rounded-[34px] border border-white/85 bg-white/58 p-4 shadow-[14px_22px_48px_rgba(45,55,72,0.16),inset_0_1px_0_rgba(255,255,255,0.96)] backdrop-blur-2xl">
          <div className="mb-8 flex items-center justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-[0_14px_24px_rgba(15,23,42,0.22)]">
              <Store size={23} />
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
                  onClick={() => item.page ? setCurrentPage(item.page) : null}
                  className={`flex h-12 w-full items-center gap-3 rounded-2xl px-4 text-[15px] font-medium transition-all ${
                    (item.page && currentPage === item.page) || (!item.page && item.label === "智能外卖架")
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

          <div className="mt-24 space-y-3">
            <ShellCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-inner">
                  <Store size={22} className="text-slate-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">美味小屋便利店</p>
                  <p className="text-sm text-slate-400">当前门店</p>
                </div>
              </div>
            </ShellCard>
            <ShellCard className="p-4">
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-500" /> 货架系统</p>
                <p className="font-semibold text-emerald-600">运行正常</p>
              </div>
            </ShellCard>
          </div>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 rounded-[34px] border border-white/85 bg-white/62 p-8 shadow-[14px_22px_54px_rgba(45,55,72,0.14),inset_0_1px_0_rgba(255,255,255,0.96)] backdrop-blur-2xl">
          {currentPage === 1 ? (
            <Page1_ShelfBoard onNavigate={setCurrentPage} />
          ) : (
            <Page2_OrderBinding onNavigate={setCurrentPage} />
          )}
        </main>
      </div>
    </div>
  );
}
